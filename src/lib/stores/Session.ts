// src/lib/stores/session.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const storedUser = browser ? JSON.parse(localStorage.getItem('user') ?? 'null') : null;

export const session = writable<{ user: { character_name: string, character_id: number, expiration: string, identifier: string } | null }>({
  user: storedUser
});

if (browser) {
    session.subscribe(value => {
        if (value.user) {
            localStorage.setItem('user', JSON.stringify(value.user));
        } else {
            localStorage.removeItem('user');
        }
    });
}

export function logout() {
    session.set({ user: null });
    localStorage.removeItem('user');
}

// Fake that we are logged in
session.set({ user: { character_name: 'Karbowiak', character_id: 268946627, expiration: '2022-01-01T00:00:00Z', identifier: '66d6217dc5e398.30017466' } });
