import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const WIDTH = 1080;
const HEIGHT = 1350;
const OUT_DIR = path.join(process.cwd(), 'assets/banners/ai-evals-explicadas-5-slides');

const colors = {
  bg0: '#090212',
  bg1: '#120127',
  bg2: '#1E0337',
  panel: '#100221',
  panelSoft: '#140329',
  stroke: '#9238D6',
  strokeSoft: '#7E3BC5',
  text: '#F8F2FF',
  textSoft: '#DCCAF2',
  textMuted: '#BFA9E3',
  accent: '#C45BFF',
  accentDeep: '#7D36D6',
  cyan: '#79CAFF',
  cyanSoft: '#59B8FF',
  ink: '#1B0833',
  success: '#72F0C2',
  warning: '#FFCF66',
  danger: '#FF7AA8',
};

const logoPaths = [
  'M12.4643 0.202185C12.4643 0.321143 12.3054 0.737495 12.1099 1.13006C11.4745 2.43859 10.1182 3.39026 7.17336 4.57984C3.78865 5.93596 2.50563 6.70918 1.45479 7.98203C0.538347 9.08834 0.367279 9.69503 0.367279 11.753C0.367279 12.6214 0.391717 13.3232 0.428375 13.3232C0.587224 13.3232 1.47922 12.8474 5.25495 10.7538C6.29358 10.1828 7.67435 9.43332 8.30974 9.10024C12.5009 6.88762 14.1139 5.91216 14.7004 5.19842C15.3358 4.43709 15.5802 3.53301 15.3724 2.72409C15.2136 2.1293 13.1608 -4.3869e-05 12.7331 -4.3869e-05C12.562 -4.3869e-05 12.4643 0.071331 12.4643 0.202185Z',
  'M23.3988 2.86702C22.8611 3.18821 22.0913 3.65214 21.6881 3.90195C21.2971 4.13987 20.4295 4.85362 19.7941 5.4722C17.5458 7.63723 16.5805 9.50487 16.8004 11.313C16.9226 12.3004 17.2159 12.7643 18.7799 14.3584C19.5253 15.1316 20.2585 15.9048 20.4051 16.0951C21.0649 16.9159 22.1524 17.0111 23.2888 16.345C23.6798 16.107 24.303 15.7621 24.6696 15.5598C26.2214 14.7152 27.7488 13.6684 27.8588 13.371C27.9321 13.2045 27.981 12.8119 27.981 12.4907C27.981 12.003 27.9077 11.8364 27.5044 11.3368C27.2478 11.0275 26.6857 10.4446 26.2703 10.0521C25.8548 9.65952 25.2928 9.07662 25.0239 8.75544L24.5474 8.17254L24.5596 5.48409C24.584 2.20086 24.584 2.26033 24.4741 2.27223C24.413 2.27223 23.9364 2.54583 23.3988 2.86702Z',
  'M11.8533 11.0156C9.95932 12.0029 9.21395 13.4304 9.89822 14.7508C10.1182 15.1791 11.7189 16.9278 14.4804 19.7471C15.0181 20.3062 15.5679 20.9604 15.6779 21.1984C15.8001 21.4482 15.9467 21.6504 16.0078 21.6504C16.2033 21.6504 17.2175 20.2586 17.5963 19.4854C18.0118 18.6527 18.0851 17.7486 17.7918 17.0943C17.6452 16.7493 14.3216 13.252 13.7717 12.8594C13.2585 12.5025 12.8308 11.7531 12.8308 11.2297C12.8308 10.9442 12.7819 10.6944 12.7331 10.6587C12.6842 10.6349 12.281 10.7895 11.8533 11.0156Z',
  'M4.93655 14.9891C4.7166 15.0367 4.11786 15.2984 3.59244 15.5839C3.05479 15.8694 2.16279 16.3333 1.58849 16.6307C0.195507 17.3326 0 17.5586 0 18.4151C0 18.8552 0.073315 19.2002 0.219945 19.4024C0.329918 19.5809 1.19748 20.5087 2.13836 21.4604L3.84904 23.2091L3.92236 24.0656C3.97123 24.5414 4.00789 25.8024 4.02011 26.8611L4.03233 28.812L4.85101 28.3719C7.17266 27.1347 9.73868 24.5652 10.5329 22.6976C10.7284 22.2217 10.8018 21.8173 10.8018 20.9965C10.814 19.6404 10.704 19.45 8.59008 17.1898C6.73277 15.2151 5.97518 14.7512 4.93655 14.9891Z',
  'M25.4749 18.9265C24.2041 19.6522 22.9822 20.3064 22.7745 20.3897C22.5667 20.4849 22.1635 20.699 21.858 20.8893C21.5648 21.0678 20.966 21.4008 20.5261 21.6269C19.0232 22.3882 15.5774 24.3034 14.7342 24.8506C13.7323 25.493 12.7914 26.3971 12.4493 27.0514C12.1193 27.658 12.0216 28.6216 12.2293 29.1093C12.4126 29.5138 14.722 32 14.9175 32C14.9786 32 15.0519 31.8573 15.0886 31.6788C15.5163 29.6565 16.5182 28.6692 19.3042 27.5272C21.3937 26.6707 22.9211 26.0164 23.0311 25.9331C23.1044 25.8856 23.5321 25.6476 23.9964 25.4097C25.2183 24.7674 26.5746 23.7562 27.0634 23.1138C27.7354 22.2098 27.9554 21.3652 27.992 19.3905C28.0165 18.3793 27.9798 17.6656 27.9187 17.6418C27.8454 17.6299 26.7579 18.2009 25.4749 18.9265Z',
];

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function wrapText(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = '';

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars) {
      current = next;
    } else {
      if (current) {
        lines.push(current);
      }
      current = word;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function textBlock({
  x,
  y,
  text,
  maxChars,
  fontSize = 24,
  lineHeight = 32,
  fill = colors.textSoft,
  weight = 500,
  opacity,
}) {
  const lines = Array.isArray(text) ? text : wrapText(text, maxChars);
  const opacityAttr = opacity === undefined ? '' : ` opacity="${opacity}"`;

  return `
    <text x="${x}" y="${y}" fill="${fill}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="${fontSize}" font-weight="${weight}"${opacityAttr}>
      ${lines
        .map((line, index) => `<tspan x="${x}" y="${y + index * lineHeight}">${escapeXml(line)}</tspan>`)
        .join('')}
    </text>
  `;
}

function titleLines(lines, x = 104, y = 252) {
  return lines
    .map(
      (line, index) => `
        <text x="${x}" y="${y + index * 84}" fill="${line.fill ?? colors.text}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="${line.size ?? 76}" font-weight="${line.weight ?? 800}" letter-spacing="-0.04em">
          ${escapeXml(line.text)}
        </text>
      `,
    )
    .join('');
}

function logoMark(x, y, scale = 1) {
  return `
    <g transform="translate(${x} ${y}) scale(${scale})">
      ${logoPaths.map((d) => `<path d="${d}" fill="${colors.text}"/>`).join('')}
    </g>
  `;
}

function chip(x, y, label, tone = 'accent') {
  const theme =
    tone === 'cyan'
      ? { bg: '#0C1A2F', stroke: 'rgba(121, 202, 255, 0.44)', text: '#D7F0FF' }
      : tone === 'soft'
        ? { bg: '#16052B', stroke: 'rgba(191, 169, 227, 0.34)', text: colors.textSoft }
        : { bg: '#18052F', stroke: 'rgba(196, 91, 255, 0.42)', text: '#F3DEFF' };

  const width = Math.max(130, label.length * 12 + 38);
  return `
    <g transform="translate(${x} ${y})">
      <rect width="${width}" height="48" rx="16" fill="${theme.bg}" stroke="${theme.stroke}" />
      <text x="${width / 2}" y="31" text-anchor="middle" fill="${theme.text}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="18" font-weight="600" letter-spacing="0.02em">${escapeXml(label)}</text>
    </g>
  `;
}

function infoCard({ x, y, w, h, index, title, text }) {
  return `
    <g transform="translate(${x} ${y})">
      <rect width="${w}" height="${h}" rx="24" fill="rgba(16, 2, 33, 0.82)" stroke="rgba(146, 56, 214, 0.28)" />
      <text x="24" y="42" fill="${colors.accent}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="0.12em">${escapeXml(index)}</text>
      <text x="24" y="78" fill="${colors.text}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="28" font-weight="700">${escapeXml(title)}</text>
      ${textBlock({ x: 24, y: 112, text, maxChars: 30, fontSize: 22, lineHeight: 30, fill: colors.textSoft })}
    </g>
  `;
}

function stepCard({ x, y, w, h, number, text }) {
  return `
    <g transform="translate(${x} ${y})">
      <rect width="${w}" height="${h}" rx="22" fill="rgba(16, 2, 33, 0.78)" stroke="rgba(121, 202, 255, 0.24)" />
      <rect x="20" y="20" width="54" height="54" rx="16" fill="rgba(196, 91, 255, 0.18)" stroke="rgba(196, 91, 255, 0.5)" />
      <text x="47" y="55" text-anchor="middle" fill="${colors.text}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="24" font-weight="700">${escapeXml(number)}</text>
      ${textBlock({ x: 96, y: 52, text, maxChars: 31, fontSize: 23, lineHeight: 32, fill: colors.textSoft })}
    </g>
  `;
}

function checklistRow({ x, y, w, text }) {
  return `
    <g transform="translate(${x} ${y})">
      <rect width="${w}" height="92" rx="22" fill="rgba(16, 2, 33, 0.78)" stroke="rgba(146, 56, 214, 0.24)" />
      <circle cx="36" cy="46" r="16" fill="rgba(114, 240, 194, 0.16)" stroke="rgba(114, 240, 194, 0.48)" />
      <path d="M28 46L34 52L45 39" stroke="${colors.success}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      ${textBlock({ x: 66, y: 53, text, maxChars: 33, fontSize: 22, lineHeight: 30, fill: colors.text })}
    </g>
  `;
}

function defs() {
  return `
    <defs>
      <linearGradient id="bgGradient" x1="120" y1="80" x2="1000" y2="1310" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="${colors.bg0}" />
        <stop offset="0.46" stop-color="${colors.bg1}" />
        <stop offset="1" stop-color="${colors.bg2}" />
      </linearGradient>
      <linearGradient id="titleGradient" x1="120" y1="240" x2="700" y2="560" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="${colors.accent}" />
        <stop offset="1" stop-color="${colors.cyan}" />
      </linearGradient>
      <linearGradient id="panelLine" x1="690" y1="260" x2="950" y2="1050" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="${colors.accent}" />
        <stop offset="1" stop-color="${colors.cyanSoft}" />
      </linearGradient>
      <radialGradient id="glowLeft" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(220 270) rotate(22) scale(420 320)">
        <stop stop-color="${colors.accent}" stop-opacity="0.5" />
        <stop offset="1" stop-color="${colors.accent}" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="glowRight" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(900 1040) rotate(-15) scale(360 280)">
        <stop stop-color="${colors.cyan}" stop-opacity="0.28" />
        <stop offset="1" stop-color="${colors.cyan}" stop-opacity="0" />
      </radialGradient>
      <filter id="blurSoft" x="-80" y="-80" width="${WIDTH + 160}" height="${HEIGHT + 160}" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="50" />
      </filter>
      <pattern id="gridPattern" x="0" y="0" width="42" height="42" patternUnits="userSpaceOnUse">
        <path d="M 42 0 L 0 0 0 42" stroke="#7F2FB5" stroke-opacity="0.16" stroke-width="1" />
      </pattern>
    </defs>
  `;
}

function shell({ page, pageLabel, body, panel, footerTitle }) {
  return `
    <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" fill="none" xmlns="http://www.w3.org/2000/svg">
      ${defs()}
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgGradient)" />
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#gridPattern)" opacity="0.44" />
      <g filter="url(#blurSoft)">
        <ellipse cx="248" cy="278" rx="300" ry="220" fill="url(#glowLeft)" />
        <ellipse cx="874" cy="1040" rx="280" ry="220" fill="url(#glowRight)" />
      </g>
      <rect x="44" y="44" width="992" height="1262" rx="38" fill="rgba(11, 1, 34, 0.58)" stroke="rgba(146, 56, 214, 0.3)" stroke-width="2" />

      ${logoMark(98, 92, 1.55)}
      <text x="154" y="128" fill="${colors.text}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="28" font-weight="700" letter-spacing="0.08em">TENBELTZ</text>

      <g transform="translate(770 86)">
        <rect width="208" height="46" rx="16" fill="rgba(16, 2, 33, 0.78)" stroke="rgba(146, 56, 214, 0.32)" />
        <text x="104" y="30" text-anchor="middle" fill="${colors.textSoft}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="18" font-weight="600" letter-spacing="0.08em">${escapeXml(pageLabel)}</text>
      </g>

      <g transform="translate(942 154)">
        <circle r="44" fill="rgba(18, 1, 39, 0.9)" stroke="rgba(121, 202, 255, 0.38)" stroke-width="2" />
        <text y="11" text-anchor="middle" fill="${colors.text}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="34" font-weight="800">${escapeXml(page)}</text>
      </g>

      <g transform="translate(690 206)">
        <rect width="294" height="936" rx="30" fill="rgba(16, 2, 33, 0.82)" stroke="rgba(126, 59, 197, 0.36)" stroke-width="2" />
        ${panel}
      </g>

      ${body}

      <line x1="92" y1="1208" x2="988" y2="1208" stroke="rgba(191, 169, 227, 0.18)" />
      <text x="98" y="1252" fill="${colors.textSoft}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="22" font-weight="600">${escapeXml(footerTitle)}</text>
      <text x="984" y="1252" text-anchor="end" fill="${colors.textMuted}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="20" font-weight="500">tenbeltz.com</text>
    </svg>
  `;
}

function heroPanel() {
  return `
    <text x="34" y="58" fill="${colors.textSoft}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="0.12em">EVAL SURFACE</text>
    <rect x="26" y="90" width="242" height="138" rx="24" fill="rgba(27, 8, 51, 0.84)" />
    <path d="M52 194C82 170 110 184 136 152C161 124 194 132 242 104" stroke="url(#panelLine)" stroke-width="8" stroke-linecap="round" />
    <circle cx="136" cy="152" r="10" fill="${colors.accent}" />
    <circle cx="242" cy="104" r="10" fill="${colors.cyan}" />
    <text x="44" y="126" fill="${colors.text}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="18" font-weight="700">Calidad observable</text>
    <text x="44" y="154" fill="${colors.textMuted}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="16" font-weight="500">salida • coste • formato</text>

    ${[
      ['Output fidelity', '0.92', colors.accent],
      ['Policy checks', '0.98', colors.success],
      ['Latency budget', 'OK', colors.cyan],
      ['Cost guardrail', 'OK', colors.warning],
    ]
      .map(
        ([label, value, color], index) => `
          <g transform="translate(26 ${264 + index * 116})">
            <rect width="242" height="96" rx="22" fill="rgba(15, 2, 30, 0.78)" stroke="rgba(191, 169, 227, 0.12)" />
            <text x="18" y="38" fill="${colors.textMuted}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="16" font-weight="600">${escapeXml(label)}</text>
            <text x="18" y="72" fill="${color}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="30" font-weight="800">${escapeXml(value)}</text>
            <rect x="142" y="56" width="82" height="10" rx="5" fill="rgba(255,255,255,0.08)" />
            <rect x="142" y="56" width="${value === '0.92' ? 66 : value === '0.98' ? 74 : 82}" height="10" rx="5" fill="${color}" />
          </g>
        `,
      )
      .join('')}
  `;
}

function evalsPanel() {
  return `
    <text x="34" y="58" fill="${colors.textSoft}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="0.12em">COMO LO MIDES</text>
    <g transform="translate(34 104)">
      <rect width="226" height="122" rx="24" fill="rgba(27, 8, 51, 0.84)" />
      <text x="24" y="42" fill="${colors.text}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="26" font-weight="700">Input</text>
      ${textBlock({ x: 24, y: 76, text: 'Caso real o sintetico que representa una decision importante.', maxChars: 20, fontSize: 18, lineHeight: 24, fill: colors.textMuted })}
    </g>
    <path d="M147 238V300" stroke="rgba(191, 169, 227, 0.36)" stroke-width="3" stroke-linecap="round" />
    <path d="M138 292L147 304L156 292" stroke="${colors.textMuted}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    <g transform="translate(34 326)">
      <rect width="226" height="170" rx="24" fill="rgba(16, 2, 33, 0.84)" stroke="rgba(146, 56, 214, 0.22)" />
      <text x="24" y="44" fill="${colors.text}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="26" font-weight="700">Sistema</text>
      ${textBlock({ x: 24, y: 78, text: 'Prompt, modelo, herramientas y reglas del pipeline.', maxChars: 20, fontSize: 18, lineHeight: 24, fill: colors.textMuted })}
      <rect x="24" y="114" width="178" height="10" rx="5" fill="rgba(255,255,255,0.08)" />
      <rect x="24" y="114" width="142" height="10" rx="5" fill="${colors.accent}" />
      <rect x="24" y="138" width="148" height="10" rx="5" fill="rgba(255,255,255,0.08)" />
      <rect x="24" y="138" width="118" height="10" rx="5" fill="${colors.cyan}" />
    </g>
    <path d="M147 508V570" stroke="rgba(191, 169, 227, 0.36)" stroke-width="3" stroke-linecap="round" />
    <path d="M138 562L147 574L156 562" stroke="${colors.textMuted}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    <g transform="translate(34 596)">
      <rect width="226" height="236" rx="24" fill="rgba(27, 8, 51, 0.84)" />
      <text x="24" y="44" fill="${colors.text}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="26" font-weight="700">Score</text>
      ${['calidad', 'formato', 'seguridad', 'coste'].map((item, index) => `
        <text x="24" y="${92 + index * 36}" fill="${colors.textMuted}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="18" font-weight="600">${escapeXml(item)}</text>
        <rect x="114" y="${82 + index * 36}" width="88" height="10" rx="5" fill="rgba(255,255,255,0.08)" />
        <rect x="114" y="${82 + index * 36}" width="${[70, 82, 76, 64][index]}" height="10" rx="5" fill="${index % 2 === 0 ? colors.accent : colors.cyan}" />
      `).join('')}
      <rect x="24" y="176" width="178" height="40" rx="14" fill="rgba(114, 240, 194, 0.14)" stroke="rgba(114, 240, 194, 0.42)" />
      <text x="113" y="202" text-anchor="middle" fill="${colors.success}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="18" font-weight="700">pasa el umbral</text>
    </g>
  `;
}

function whyPanel() {
  return `
    <text x="34" y="58" fill="${colors.textSoft}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="0.12em">SIN VS CON EVALS</text>
    <text x="34" y="102" fill="${colors.textMuted}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="16" font-weight="600">sin criterio comun</text>
    <text x="168" y="102" fill="${colors.textMuted}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="16" font-weight="600">con criterio comun</text>
    <rect x="28" y="126" width="108" height="264" rx="22" fill="rgba(16, 2, 33, 0.78)" />
    <rect x="158" y="126" width="108" height="264" rx="22" fill="rgba(16, 2, 33, 0.78)" />
    <path d="M44 340C58 238 76 318 92 206C104 124 118 284 126 182" stroke="${colors.danger}" stroke-width="7" stroke-linecap="round" />
    <path d="M174 332C188 318 206 294 222 276C234 262 244 222 250 182" stroke="url(#panelLine)" stroke-width="7" stroke-linecap="round" />
    ${[
      ['release', 'umbral antes de enviar'],
      ['regresion', 'comparas cambios'],
      ['alineacion', 'producto e ingenieria'],
      ['riesgo', 'menos apuestas ciegas'],
    ]
      .map(
        ([label, desc], index) => `
          <g transform="translate(28 ${434 + index * 108})">
            <rect width="238" height="84" rx="20" fill="rgba(15, 2, 30, 0.72)" stroke="rgba(191, 169, 227, 0.1)" />
            <text x="18" y="34" fill="${colors.text}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="0.06em">${escapeXml(label.toUpperCase())}</text>
            <text x="18" y="60" fill="${colors.textMuted}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="16" font-weight="500">${escapeXml(desc)}</text>
          </g>
        `,
      )
      .join('')}
  `;
}

function goldenSetPanel() {
  return `
    <text x="34" y="58" fill="${colors.textSoft}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="0.12em">MEZCLA DE CASOS</text>
    <g transform="translate(34 100)">
      <rect width="226" height="178" rx="24" fill="rgba(27, 8, 51, 0.84)" />
      <text x="24" y="42" fill="${colors.text}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="22" font-weight="700">Ejemplo de composicion</text>
      ${[
        ['tipicos', 96, colors.accent],
        ['edge cases', 56, colors.cyan],
        ['adversariales', 34, colors.warning],
      ]
        .map(
          ([label, width, fill], index) => `
            <text x="24" y="${82 + index * 34}" fill="${colors.textMuted}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="17" font-weight="600">${escapeXml(label)}</text>
            <rect x="118" y="${72 + index * 34}" width="100" height="10" rx="5" fill="rgba(255,255,255,0.08)" />
            <rect x="118" y="${72 + index * 34}" width="${width}" height="10" rx="5" fill="${fill}" />
          `,
        )
        .join('')}
      <text x="24" y="164" fill="${colors.textMuted}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="14" font-weight="500">No hay reparto unico.</text>
      <text x="24" y="182" fill="${colors.textMuted}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="14" font-weight="500">Depende del riesgo real.</text>
    </g>
    ${[
      ['1', 'Tarea'],
      ['2', 'Casos'],
      ['3', 'Rubrica'],
      ['4', 'Balance'],
    ]
      .map(
        ([n, label], index) => `
          <g transform="translate(34 ${332 + index * 132})">
            <rect width="226" height="98" rx="22" fill="rgba(16, 2, 33, 0.78)" stroke="rgba(121, 202, 255, 0.16)" />
            <rect x="18" y="18" width="50" height="50" rx="16" fill="rgba(121, 202, 255, 0.12)" stroke="rgba(121, 202, 255, 0.34)" />
            <text x="43" y="52" text-anchor="middle" fill="${colors.text}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="24" font-weight="700">${escapeXml(n)}</text>
            <text x="86" y="52" fill="${colors.text}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="24" font-weight="700">${escapeXml(label)}</text>
          </g>
        `,
      )
      .join('')}
  `;
}

function checklistPanel() {
  return `
    <text x="34" y="58" fill="${colors.textSoft}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="0.12em">MENTAL MODEL</text>
    <g transform="translate(34 102)">
      <rect width="226" height="202" rx="24" fill="rgba(27, 8, 51, 0.84)" />
      <text x="24" y="44" fill="${colors.text}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="24" font-weight="700">Una buena eval...</text>
      ${textBlock({ x: 24, y: 88, text: 'no promete perfeccion. Te da criterio para saber si el sistema sigue sirviendo.', maxChars: 24, fontSize: 20, lineHeight: 28, fill: colors.textSoft })}
      <line x1="24" y1="174" x2="202" y2="174" stroke="rgba(121, 202, 255, 0.22)" />
      <text x="24" y="202" fill="${colors.cyan}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="16" font-weight="700" letter-spacing="0.08em">OFFLINE + PRODUCCION</text>
    </g>
    ${[
      ['versionado', 'git o snapshots'],
      ['thresholds', 'antes del release'],
      ['fallos nuevos', 'entran al set'],
      ['review', 'cuando cambia producto'],
    ]
      .map(
        ([title, desc], index) => `
          <g transform="translate(34 ${352 + index * 126})">
            <rect width="226" height="92" rx="22" fill="rgba(16, 2, 33, 0.78)" stroke="rgba(146, 56, 214, 0.16)" />
            <text x="22" y="38" fill="${colors.text}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="20" font-weight="700">${escapeXml(title)}</text>
            <text x="22" y="66" fill="${colors.textMuted}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="16" font-weight="500">${escapeXml(desc)}</text>
          </g>
        `,
      )
      .join('')}
  `;
}

const slides = [
  {
    filename: '01-evals-de-ia-explicadas-1080x1350',
    page: '01',
    pageLabel: 'CARRUSEL TECNICO',
    footerTitle: 'Evals de IA explicadas en 5 slides',
    body: `
      ${titleLines([
        { text: 'Evals de IA' },
        { text: 'explicadas', fill: 'url(#titleGradient)' },
        { text: 'en 5 slides' },
      ])}
      ${textBlock({
        x: 104,
        y: 486,
        text: 'Que son, por que importan y como construir un golden set que sirva para tomar decisiones.',
        maxChars: 34,
        fontSize: 28,
        lineHeight: 38,
        fill: colors.textSoft,
      })}
      ${chip(104, 602, 'fiabilidad')}
      ${chip(252, 602, 'coste', 'cyan')}
      ${chip(372, 602, 'guardrails', 'soft')}
      ${infoCard({
        x: 104,
        y: 690,
        w: 520,
        h: 140,
        index: '01',
        title: 'Que son',
        text: 'Pruebas repetibles para medir si el sistema hace lo que promete.',
      })}
      ${infoCard({
        x: 104,
        y: 852,
        w: 520,
        h: 140,
        index: '02',
        title: 'Por que importan',
        text: 'Evitan lanzar cambios por intuicion o porque tres demos salieron bien.',
      })}
      ${infoCard({
        x: 104,
        y: 1014,
        w: 520,
        h: 140,
        index: '03',
        title: 'Golden set',
        text: 'Un conjunto pequeno y curado de casos que representa el trabajo real.',
      })}
    `,
    panel: heroPanel(),
  },
  {
    filename: '02-que-son-las-evals-1080x1350',
    page: '02',
    pageLabel: 'QUE SON',
    footerTitle: 'Que son las evals',
    body: `
      ${titleLines([
        { text: 'Que son' },
        { text: 'las evals', fill: 'url(#titleGradient)' },
      ])}
      ${textBlock({
        x: 104,
        y: 402,
        text: 'No son una opinion sobre tres outputs. Son un sistema de medicion.',
        maxChars: 33,
        fontSize: 28,
        lineHeight: 38,
        fill: colors.textSoft,
      })}
      ${infoCard({
        x: 104,
        y: 518,
        w: 520,
        h: 166,
        index: 'A',
        title: 'Prueba repetible',
        text: 'Repites el mismo caso sobre distintas versiones y comparas resultados.',
      })}
      ${infoCard({
        x: 104,
        y: 706,
        w: 520,
        h: 166,
        index: 'B',
        title: 'Score con criterio',
        text: 'Mides calidad, formato, seguridad, latencia o coste con una rubrica clara.',
      })}
      ${infoCard({
        x: 104,
        y: 894,
        w: 520,
        h: 166,
        index: 'C',
        title: 'Base para comparar',
        text: 'Te permite decidir entre prompts, modelos o pipelines sin discutir por sensaciones.',
      })}
    `,
    panel: evalsPanel(),
  },
  {
    filename: '03-por-que-importan-las-evals-1080x1350',
    page: '03',
    pageLabel: 'POR QUE IMPORTAN',
    footerTitle: 'Por que importan las evals',
    body: `
      ${titleLines([
        { text: 'Por que importan' },
        { text: 'las evals', fill: 'url(#titleGradient)' },
      ])}
      ${textBlock({
        x: 104,
        y: 402,
        text: 'Porque sin evals cada iteracion es una apuesta. Con evals, cada cambio tiene criterio.',
        maxChars: 35,
        fontSize: 28,
        lineHeight: 38,
        fill: colors.textSoft,
      })}
      ${infoCard({
        x: 104,
        y: 520,
        w: 520,
        h: 132,
        index: '01',
        title: 'Release con umbral',
        text: 'Defines cuando una version esta lista para salir.',
      })}
      ${infoCard({
        x: 104,
        y: 670,
        w: 520,
        h: 132,
        index: '02',
        title: 'Detectan regresiones',
        text: 'Un cambio puede arreglar un caso y romper otros diez.',
      })}
      ${infoCard({
        x: 104,
        y: 820,
        w: 520,
        h: 132,
        index: '03',
        title: 'Alinean al equipo',
        text: 'Producto, negocio e ingenieria miran la misma definicion de funciona.',
      })}
      ${infoCard({
        x: 104,
        y: 970,
        w: 520,
        h: 132,
        index: '04',
        title: 'Reducen riesgo',
        text: 'Comparas opciones con evidencia y no solo con demos bonitas.',
      })}
    `,
    panel: whyPanel(),
  },
  {
    filename: '04-como-construir-un-golden-set-1080x1350',
    page: '04',
    pageLabel: 'GOLDEN SET',
    footerTitle: 'Como construir un golden set',
    body: `
      ${titleLines([
        { text: 'Como construir' },
        { text: 'un golden set', fill: 'url(#titleGradient)', size: 74 },
      ])}
      ${textBlock({
        x: 104,
        y: 402,
        text: 'Pequeno, curado y representativo. El objetivo no es cantidad. Es utilidad.',
        maxChars: 34,
        fontSize: 28,
        lineHeight: 38,
        fill: colors.textSoft,
      })}
      ${stepCard({ x: 104, y: 516, w: 520, h: 126, number: '1', text: 'Define la tarea y los fallos que de verdad importan.' })}
      ${stepCard({ x: 104, y: 660, w: 520, h: 126, number: '2', text: 'Recoge casos reales y representativos del uso en produccion.' })}
      ${stepCard({ x: 104, y: 804, w: 520, h: 126, number: '3', text: 'Anota la respuesta esperada o una rubrica clara de scoring.' })}
      ${stepCard({ x: 104, y: 948, w: 520, h: 126, number: '4', text: 'Mezcla casos tipicos, edge cases y escenarios adversariales.' })}
      <g transform="translate(104 1110)">
        <rect width="520" height="72" rx="22" fill="rgba(121, 202, 255, 0.1)" stroke="rgba(121, 202, 255, 0.28)" />
        <text x="260" y="46" text-anchor="middle" fill="${colors.cyan}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="22" font-weight="700">Mejor 50 casos utiles que 5.000 ruidosos</text>
      </g>
    `,
    panel: goldenSetPanel(),
  },
  {
    filename: '05-checklist-minimo-de-evals-1080x1350',
    page: '05',
    pageLabel: 'CHECKLIST',
    footerTitle: 'Checklist minimo de evals',
    body: `
      ${titleLines([
        { text: 'Checklist minimo' },
        { text: 'antes de lanzar', fill: 'url(#titleGradient)' },
      ])}
      ${textBlock({
        x: 104,
        y: 402,
        text: 'Si quieres que las evals sirvan de verdad, no te quedes solo en correr un script.',
        maxChars: 35,
        fontSize: 28,
        lineHeight: 38,
        fill: colors.textSoft,
      })}
      ${checklistRow({ x: 104, y: 520, w: 520, text: 'Versiona el golden set y separalo del entrenamiento.' })}
      ${checklistRow({ x: 104, y: 626, w: 520, text: 'Define thresholds antes de mirar los resultados.' })}
      ${checklistRow({ x: 104, y: 732, w: 520, text: 'Cada fallo nuevo relevante tiene que entrar al set.' })}
      ${checklistRow({ x: 104, y: 838, w: 520, text: 'Separa eval offline de metricas y alertas en produccion.' })}
      ${checklistRow({ x: 104, y: 944, w: 520, text: 'Revisa el set cuando cambie el producto, no solo el modelo.' })}
      <g transform="translate(104 1068)">
        <rect width="520" height="114" rx="24" fill="rgba(16, 2, 33, 0.84)" stroke="rgba(196, 91, 255, 0.28)" />
        ${textBlock({ x: 24, y: 44, text: 'Una buena eval no demuestra perfeccion.', maxChars: 34, fontSize: 24, lineHeight: 32, fill: colors.text, weight: 700 })}
        ${textBlock({ x: 24, y: 80, text: 'Demuestra que sabes cuando tu IA deja de ser util.', maxChars: 35, fontSize: 20, lineHeight: 28, fill: colors.textSoft })}
      </g>
    `,
    panel: checklistPanel(),
  },
];

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const slide of slides) {
  const svg = shell(slide);
  const svgPath = path.join(OUT_DIR, `${slide.filename}.svg`);
  const pngPath = path.join(OUT_DIR, `${slide.filename}.png`);

  fs.writeFileSync(svgPath, svg);

  try {
    execFileSync('sips', ['-s', 'format', 'png', svgPath, '--out', pngPath], {
      stdio: 'ignore',
    });
  } catch (error) {
    console.error(`No se pudo exportar PNG para ${slide.filename}:`, error.message);
  }
}

console.log(`Generated ${slides.length} slides in ${OUT_DIR}`);
