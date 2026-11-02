// Integration regression: both services must be running. Invalid payloads ensure
// no email is sent, even when the request passes the proxy-origin guard.
import assert from 'node:assert/strict';
import { request } from 'node:http';

// node:http preserves Host, which fetch can replace with the loopback target.
function post(url, headers, body) {
  return new Promise((resolve, reject) => {
    const req = request(url, { method: 'POST', headers }, response => {
      response.resume();
      response.on('end', () => resolve({ status: response.statusCode }));
    });
    req.on('error', reject);
    req.end(body);
  });
}
const base = process.env.CONTACT_QA_URL || 'http://127.0.0.1:10022';
const preview = 'tenbeltz-landing.dev.tenbeltz.com';
const cases = [
  ['HTTPS through proxy', preview, `https://${preview}`, {}, 422],
  ['HTTPS with forwarded headers', preview, `https://${preview}`, { 'X-Forwarded-Proto': 'https', 'X-Forwarded-Host': preview }, 422],
  ['Untrusted origin', preview, 'https://attacker.example', {}, 403],
  ['Untrusted origin plus spoofed forwarding', preview, 'https://attacker.example', { 'X-Forwarded-Proto': 'https', 'X-Forwarded-Host': preview }, 403],
  ['HTTP preview origin', preview, `http://${preview}`, {}, 403],
  ['Missing origin', preview, null, {}, 403],
  ['Local origin', '127.0.0.1:10022', 'http://127.0.0.1:10022', {}, 422],
  ['Foreign origin on local host', '127.0.0.1:10022', `https://${preview}`, {}, 403],
  ['Production HTTPS', 'tenbeltz.com', 'https://tenbeltz.com', {}, 422],
  ['Production HTTP rejected', 'tenbeltz.com', 'http://tenbeltz.com', {}, 403],
  ['Production foreign origin rejected', 'tenbeltz.com', 'https://attacker.example', {}, 403],
  ['Unknown hostname rejected', 'unknown.example', 'https://unknown.example', {}, 404],
  ['Host with injected path rejected', 'tenbeltz.com/invalid', 'https://tenbeltz.com', {}, 404],
  ['Unknown host with trusted forwarded host', 'unknown.example', 'https://tenbeltz.com', { 'X-Forwarded-Host': 'tenbeltz.com', 'X-Forwarded-Proto': 'https' }, 404],
  ['Local host cannot adopt forwarded public origin', '127.0.0.1:10022', 'https://tenbeltz.com', { 'X-Forwarded-Host': 'tenbeltz.com', 'X-Forwarded-Proto': 'https' }, 403],
  ['Valid preview origin with a different forwarded host', preview, `https://${preview}`, { 'X-Forwarded-Host': 'tenbeltz.com', 'X-Forwarded-Proto': 'https' }, 422],
];
for (const [name, host, origin, forwarded, status] of cases) {
  const headers = { Host: host, 'Content-Type': 'application/json', ...forwarded };
  if (origin) headers.Origin = origin;
  const response = await post(`${base}/api/contact`, headers, '{}');
  assert.equal(response.status, status, name);
  console.log(`${name}: ${status}`);
}
const oversized = await post(`${base}/api/contact`, { Host: preview, Origin: `https://${preview}`, 'Content-Type': 'application/json' }, 'x'.repeat(32769));
assert.equal(oversized.status, 413);
console.log(`Oversized body: 413. ${cases.length + 1} cases passed; no emails sent.`);
