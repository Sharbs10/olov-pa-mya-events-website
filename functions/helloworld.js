export const onRequest = (context) => {
    // cast the platform Response to the Cloudflare Workers Response type
    return new Response('Hello, world!', {
        headers: { 'Content-Type': 'text/plain' },
    });
};
