import type { PagesFunction, Response as CFResponse } from '@cloudflare/workers-types';

export const onRequest: PagesFunction = (context) => {
  // cast the platform Response to the Cloudflare Workers Response type
  return new Response('Hello, world!', {
    headers: { 'Content-Type': 'text/plain' },
  }) as unknown as CFResponse;
};
