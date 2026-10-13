// Shared translated paths for HTML metadata, sitemap and navigation.
// Both keys resolve to the same pair, so callers may start in either locale.
const pairs = [
  ['/quien-esta-detras', '/who-is-behind'],
  ['/diagnostico-ia', '/ai-diagnosis'],
  ['/casos', '/case-studies'],
  ['/evaluacion-ia-saas', '/ai-evaluation-for-saas'],
  ['/agentes-voz-saas', '/voice-agents-for-saas'],
  ['/ia-privada-productos', '/private-ai-products'],
  ['/ia-para-empresas', '/ai-for-business'],
  ['/ia-para-software', '/ai-for-software'],
];

/** @type {Record<string, { es: string; en: string }>} */
export const localizedSlugMap = Object.fromEntries(
  pairs.flatMap(([es, en]) => [[es, { es, en }], [en, { es, en }]])
);

/**
 * Resolve either locale's pathname to its counterpart, without a trailing slash.
 * @param {string} pathname
 * @param {string} lang
 * @returns {string}
 */
export function localizedPath(pathname, lang = 'es') {
  const base = pathname.replace(/^\/en(?=\/|$)/, '').replace(/\/$/, '') || '/';
  const pair = localizedSlugMap[base];
  const translated = pair ? (lang === 'en' ? pair.en : pair.es) : base;
  return lang === 'en' ? `/en${translated === '/' ? '' : translated}` : translated;
}
