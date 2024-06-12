import { type Writable, writable } from 'svelte/store';
const pageTitle: Writable<string> = writable('Frontpage');

export { pageTitle };
