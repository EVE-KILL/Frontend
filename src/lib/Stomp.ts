import { Client } from '@stomp/stompjs';

export async function stompConnection(topic: string, onMessageReceived: (message: any) => void) {
    const stompUrl = `wss://stomp.eve-kill.com/ws`; // Use 'wss' for secure WebSocket

    const client = new Client({
        brokerURL: stompUrl,
        connectHeaders: {
            login: 'guest',
            passcode: 'guest',
        },
        reconnectDelay: 5000, // Automatically reconnect after 5 seconds if disconnected
        heartbeatIncoming: 4000, // Set heartbeat for incoming messages
        heartbeatOutgoing: 4000, // Set heartbeat for outgoing messages
    });

    client.onConnect = () => {
        console.log('Connected to STOMP server');
        client.subscribe(topic, (message) => {
            // Handle the received message
            onMessageReceived(JSON.parse(message.body));
        });
    };

    client.onStompError = (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
    };

    client.activate();
}
