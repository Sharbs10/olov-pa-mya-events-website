export default async function (request: Request): Promise<Response> {
  console.log('Request URL:', request.url);

  try {
    const response = await fetch(request); // pass-through request
    return response;
  } catch (err) {
    console.error('Error caught at edge:', err);
    return new Response('Worker exception', { status: 500 });
  }
}
