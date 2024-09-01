<script lang="ts">
	import { javascript, php } from 'svelte-highlight/languages';
	import { Highlight } from 'svelte-highlight';
	import { tomorrowNight } from 'svelte-highlight/styles';
</script>

<svelte:head>
	{@html tomorrowNight}
</svelte:head>

<div class="overflow-x-auto">
	<div class="flex flex-col lg:flex-row gap-6 mb-8">
        <!-- Connection Details Table -->
        <div class="w-full lg:w-1/2">
            <table class="table-auto min-w-full bg-gray-800 rounded-lg shadow-lg">
                <thead>
                    <tr class="bg-darker text-white uppercase text-xs leading-normal">
                        <th class="px-2 py-1" scope="col" colspan="2">Connection Details</th>
                    </tr>
                </thead>
                <tbody class="text-gray-300 text-sm">
                    <tr class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300">
                        <td class="px-2 py-1 font-semibold">WebSocket URL</td>
                        <td class="px-2 py-1"><code>wss://stomp.eve-kill.com/ws</code></td>
                    </tr>
                    <tr class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300">
                        <td class="px-2 py-1 font-semibold">Username</td>
                        <td class="px-2 py-1"><code>guest</code></td>
                    </tr>
                    <tr class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300">
                        <td class="px-2 py-1 font-semibold">Password</td>
                        <td class="px-2 py-1"><code>guest</code></td>
                    </tr>
                    <tr class="hover:bg-gray-600 transition-colors duration-300">
                        <td class="px-2 py-1 font-semibold">Default Topic</td>
                        <td class="px-2 py-1"><code>/exchange/killmail_topic_exchange/all</code></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Available Topics Table -->
        <div class="w-full lg:w-1/2">
            <table class="table-auto min-w-full bg-gray-800 rounded-lg shadow-lg">
                <thead>
                    <tr class="bg-darker text-white uppercase text-xs leading-normal">
                        <th class="px-2 py-1" scope="col" colspan="2">Available Topics</th>
                    </tr>
                </thead>
                <tbody class="text-gray-300 text-sm">
                    <tr class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300">
                        <td class="px-2 py-1"><code>/exchange/killmail_topic_exchange/all</code></td>
                        <td class="px-2 py-1">Emits all killmails.</td>
                    </tr>
                    <tr class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300">
                        <td class="px-2 py-1"><code>/exchange/killmail_topic_exchange/character.id</code></td>
                        <td class="px-2 py-1">Emits all killmails for a particular character id</td>
                    </tr>
                    <tr class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300">
                        <td class="px-2 py-1"><code>/exchange/killmail_topic_exchange/corporation.id</code></td>
                        <td class="px-2 py-1">Emits all killmails for a particular corporation id</td>
                    </tr>
                    <tr class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300">
                        <td class="px-2 py-1"><code>/exchange/killmail_topic_exchange/alliance.id</code></td>
                        <td class="px-2 py-1">Emits all killmails for a particular alliance id</td>
                    </tr>
                    <tr class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300">
                        <td class="px-2 py-1"><code>/exchange/killmail_topic_exchange/faction.id</code></td>
                        <td class="px-2 py-1">Emits all killmails for a particular faction id</td>
                    </tr>
                    <tr class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300">
                        <td class="px-2 py-1"><code>/exchange/killmail_topic_exchange/system.id</code></td>
                        <td class="px-2 py-1">Emits all killmails for a particular system id</td>
                    </tr>
                    <tr class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300">
                        <td class="px-2 py-1"><code>/exchange/killmail_topic_exchange/region.id</code></td>
                        <td class="px-2 py-1">Emits all killmails for a particular region id</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

	<p class="text-gray-300 mb-4">
		Keep the following in mind.

		<li>1. The connection is not durable, meaning that you will not receive messages that were sent while you were disconnected.</li>
		<li>2. The oldest messages you will receive will be a max of 7 days old.</li>

	</p>

    <h2 class="text-xl font-semibold mb-4 text-white">Connecting with STOMP.js (JavaScript)</h2>
    <p class="text-gray-300 mb-4">
        The easiest way to connect to the WebSocket using STOMP is by using the
        <code>@stomp/stompjs</code> library. Here's a basic example of how to set it up:
    </p>

	<Highlight language={javascript} code={`import { Client } from '@stomp/stompjs';

// Connection configuration
const client = new Client({
    brokerURL: 'wss://stomp.eve-kill.com/ws',
    connectHeaders: {
        login: 'guest',
        passcode: 'guest',
    },
    debug: function (str) {
        console.log(str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
});

// Callback when connected
client.onConnect = function (frame) {
    console.log('Connected:', frame);

    // Subscribe to the topic
    client.subscribe('/exchange/killmail_topic_exchange/all', function (message) {
        // Handle the incoming message
        const body = JSON.parse(message.body);
        console.log('Received message:', body);
    });
};

// Callback for errors
client.onStompError = function (frame) {
    console.error('Broker reported error:', frame.headers['message']);
    console.error('Additional details:', frame.body);
};

// Activate the connection
client.activate();`} />

    <h2 class="text-xl font-semibold mt-8 mb-4 text-white">Connecting with PHP</h2>
    <p class="text-gray-300 mb-4">
        Below is a simplified example of how to connect and subscribe using PHP:
    </p>

	<p class="text-gray-300 mb-4">
		Note that you will need to install the <code>textalk/websocket</code> package via Composer to use this example.
	</p>

	<Highlight language={php} code={`<?php
require 'vendor/autoload.php';

use WebSocket\\Client;

$client = new Client('wss://stomp.eve-kill.com/ws');

// Construct the CONNECT frame
$connectFrame = "CONNECT\\nlogin:guest\\npasscode:guest\\nheart-beat:0,10000\\n\\n\\x00";

// Construct the SUBSCRIBE frame
$subscribeFrame = "SUBSCRIBE\\ndestination:/exchange/killmail_topic_exchange/all\\nack:auto\\n\\n\\x00";

// Send the CONNECT and SUBSCRIBE frames
$client->send($connectFrame);
$client->send($subscribeFrame);

// Listen and handle incoming messages
while (true) {
    $message = $client->receive();
    echo "Received message: {$message}\\n";
}

$client->close();`} />

    <h2 class="text-xl font-semibold mt-8 mb-4 text-white">Handling Incoming Messages</h2>
    <p class="text-gray-300 mb-4">
        Once connected and subscribed, you will receive incoming messages containing killmail data in JSON format.
        You can process these messages according to your application's requirements.
    </p>

    <p class="text-gray-300">
        For more advanced usage, including filtering and processing specific data, refer to the full API documentation or contact support.
    </p>


</div>
