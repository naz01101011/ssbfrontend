import sanityClient from '@sanity/client';

const Client = sanityClient({
    projectId: 'w58sh5v7',
    dataset: 'production',
    useCdn: true
})

export default Client;