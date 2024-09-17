import type { KillmailFilters } from '$lib/types/killmailFilters';
import type { Killmail } from '$lib/types/Killmail';
import { killmailFilters, killmails } from '$lib/stores/killmails';
import { FILTER_PRESETS } from '$lib/models/useConstants';
import { get } from 'svelte/store';
import { stompConnection } from '$lib/Stomp.ts';

const messageQueue: Killmail[] = [];
let isPaused = false;
let pauseTimeout: NodeJS.Timeout;
let subscriptionEnabled = false;

export const useKillmails = () => {
	const setup = () => {
		let currentFilters: KillmailFilters;

		killmailFilters.subscribe((value) => {
			if (checkFilters(currentFilters, value)) {
				currentFilters = value;
				getKillmails(currentFilters);
			}
		});

		const subscriptionTopic = 'all'; // for now we hardcode this. TODO better sub logic?
		const topic = '/exchange/killmail_topic_exchange/' + subscriptionTopic;
		stompConnection(topic, stompHandler);
	};

	const enableSubscription = (enabled: boolean) => {
		subscriptionEnabled = enabled;
	};

	const setFilters = (newFilters: KillmailFilters) => {
		killmailFilters.set(newFilters);
	};

	const setFilterPreset = (preset: string, params: any = {}) => {
		const newFilters = FILTER_PRESETS[preset].filter(params);

		setFilters(newFilters);
	};

	const getKillmails = async (
		currentFilters: KillmailFilters,
		options?: {
			limit?: number;
			skip?: number;
		}
	) => {
		try {
			const url = `https://eve-kill.com/api/query`;

			// const params = assembleParams(currentFilters);
			const params = {
				type: 'simple',
				filter: {
					...currentFilters
				},
				options: {
					limit: 10, // how many things should be returned. min 1, max 1000
					skip: 0, // for pagination. makes it skip the first x results
					sort: { kill_time: -1 }
					// TODO
				}
			};

			if (options) {
				params.options = {
					...params.options,
					...options
				};
			}

			console.log('Filter params:', params);

			const response = await fetch(url, {
				method: 'POST',
				body: JSON.stringify(params),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			const data = await response.json();

			killmails.set({
				data: data.killmails,
				pagination: data.pagination
			});
		} catch (error) {
			console.error(error);
		}
	};

	const checkFilters = (oldFilters: KillmailFilters, newFilters: KillmailFilters) => {
		// First up, the filters are the same, we return false
		if (oldFilters === newFilters) {
			return false;
		}

		return true;
	};

	const assembleParams = (filters: KillmailFilters) => {
		const params = {
			type: 'simple',
			filter: {
				...filters
			},
			options: {
				// TODO
			}
		};

		return params;
	};

	const getPage = (page: number) => {
		const currentPage = get(killmails).pagination.page;
		const limit = get(killmails).pagination.limit;

		// so we want to calculate the target skip based on the limit and the target page
		const targetSkip = page * limit;

		const currentFilters = get(killmailFilters);

		if (page === currentPage) {
			return;
		}

		const options = {
			limit,
			skip: targetSkip
		};

		getKillmails(currentFilters, options);
	};

	const stompHandler = (message: Killmail) => {
		if (!subscriptionEnabled) {
			return;
		}

		// if we are paused, we want to add it to the queue
		if (isPaused) {
			messageQueue.push(message);
			return;
		}

		addKillmail(message);
	};

	const addKillmail = (message: Killmail) => {
		// so the subscription message is a killmail

		// here is the tricky bit. we want to know if the killmail matches the current filters
		// const currentFilters = get(killmailFilters);
		// TODO

		// we only want to add it if the killmail isn't in the data already
		if (get(killmails).data.find((killmail) => killmail.killmail_id === message.killmail_id)) {
			return;
		}

		// we also want to skip adding it if we are at a page greater than 1
		if (get(killmails).pagination.page > 1) {
			return;
		}

		// we want to make sure that the length of the data stays within the limit
		// if we are at the limit, we want to remove the last item
		killmails.update((value) => {
			const newData = [message, ...value.data];

			if (newData.length > value.pagination.limit) {
				newData.pop();
			}

			value.data = newData;
			return value;
		});
	};

	const pauseHandlingMessages = () => {
		clearTimeout(pauseTimeout);
		// the idea here is we want to pause the handling of incoming messages
		// while paused, we will add the messages to a queue

		isPaused = true;
		pauseTimeout = setTimeout(() => {
			processQueue();
			isPaused = false;
		}, 5000);
	};

	const processQueue = () => {
		while (messageQueue.length > 0) {
			const message = messageQueue.shift();
			if (message) {
				addKillmail(message);
			} else {
				break;
			}
		}
	};

	return {
		setup,
		setFilters,
		setFilterPreset,
		getKillmails,
		getPage,
		pauseHandlingMessages,
		enableSubscription
	};
};
