import type { APIRoute } from 'astro';

// Temporarily disabled: the landing now uses a local, closed diagnosis.
export const ALL: APIRoute = () => new Response('Not found', { status: 404 });
