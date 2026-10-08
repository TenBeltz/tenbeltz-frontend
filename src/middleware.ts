import { defineMiddleware } from 'astro:middleware';

// Only build assets carry a content hash. Discovery files and favicons can change
// at the same URL and must remain revalidatable. Node serves public files before
// middleware; apply the same policy in the reverse proxy (docs/deploy/nginx-seo.md).
const REVALIDATED_FILES = new Set(['/robots.txt', '/llms.txt', '/sitemap-index.xml', '/sitemap-0.xml']);

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  const { pathname } = context.url;

  if (pathname.startsWith('/_astro/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    return response;
  }

  if (REVALIDATED_FILES.has(pathname) || pathname.startsWith('/favicon/')) {
    response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
    return response;
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('text/html')) {
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
  }

  return response;
});
