// src/lib/stores/meta.ts
import { writable } from 'svelte/store';

interface Meta {
    title: string;
    description: string;
    keywords: string;
    robots: string;
    creator: string;
    siteName: string;
    image: string;
    type: string;
    card: string;
    site: string;
    hasCustomMeta: boolean;
}

// Create the store with default values
const defaultMeta: Meta = {
    title: '',
    description: '',
    keywords: '',
    robots: '',
    creator: '',
    siteName: '',
    image: '',
    type: '',
    card: '',
    site: '',
    hasCustomMeta: false,
};

export const meta = writable<Partial<Meta>>(defaultMeta);
