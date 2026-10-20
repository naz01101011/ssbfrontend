import { createClient } from '@sanity/client';

const Client = createClient({
    projectId: 'w58sh5v7',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: true
})

export default Client;
