import { defineMiddleware } from 'astro:middleware';

const IMMUTABLE_ASSET_PREFIXES = ['/_astro/', '/favicon/'];
const IMMUTABLE_ASSET_FILES = new Set(['/robots.txt', '/sitemap-index.xml', '/sitemap-0.xml']);

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  const { pathname } = context.url;

  if (IMMUTABLE_ASSET_PREFIXES.some((prefix) => pathname.startsWith(prefix)) || IMMUTABLE_ASSET_FILES.has(pathname)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    return response;
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('text/html')) {
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
  }

  return response;
});
