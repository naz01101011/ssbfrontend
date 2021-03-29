import sanityClient from '@sanity/client';

const Client = sanityClient({
    projectId: 'w58sh5v7',
    dataset: 'production',
    // token: 'skDigpIvznVq9up1wcFDcXXRHo8pmGTDa440hwkbxDA7iSo7rhsQdWu1aitWkKYuOOxUPaJ6rZTB0GrzEA6dA0gq5PfiLzUSlnTydsLIueVKxYm5IXXZqMrDzttVNgOwyo4QDBd6f0HhWIoflGpWyPFbkWNxw2PgFl48T5SmtdCeGoXELieK',
    useCdn: true
})

export default Client;