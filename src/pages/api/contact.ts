import type { APIRoute } from 'astro';

// Fixed, private upstream. Browser never receives SMTP credentials or bridge token.
export const POST: APIRoute = async ({ request, url }) => {
  if (!['tenbeltz-landing.dev.tenbeltz.com', '127.0.0.1', 'localhost'].includes(url.hostname)) return new Response('Not found', { status: 404 });
  // TLS terminates at Nginx; Astro sees HTTP internally. Pin the external
  // preview origin instead of trusting arbitrary forwarded headers.
  const expectedOrigin = url.hostname === 'tenbeltz-landing.dev.tenbeltz.com'
    ? 'https://tenbeltz-landing.dev.tenbeltz.com' : url.origin;
  if (request.headers.get('origin') !== expectedOrigin) return new Response('Forbidden', { status: 403 });
  if (!request.headers.get('content-type')?.startsWith('application/json')) return new Response('JSON required', { status: 415 });
  const token = import.meta.env.CONTACT_BRIDGE_TOKEN;
  if (!token) return Response.json({ success: false }, { status: 503 });
  const reader = request.body?.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  if (reader) while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 32768) { await reader.cancel(); return new Response('Payload too large', { status: 413 }); }
    chunks.push(value);
  }
  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.length; }
  try {
    const upstream = await fetch('http://127.0.0.1:10024/api/contact', {
      method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body, signal: AbortSignal.timeout(40000),
    });
    return Response.json({ success: upstream.ok }, { status: upstream.ok ? 200 : upstream.status, headers: { 'Cache-Control': 'no-store' } });
  } catch { return Response.json({ success: false }, { status: 503 }); }
};
