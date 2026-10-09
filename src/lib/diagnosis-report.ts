import { jsPDF } from 'jspdf';
import { evaluate, questions, priorityEvidence } from './diagnosis';

type Lead = { name: string; company: string; email: string };
type Node = { type: string; x: number; y: number; w?: number; h?: number; x2?: number; y2?: number; fill?: string; stroke?: number; path?: string };
type Kit = { width: number; height: number; colors: Record<string, string>; scenes: Record<string, { background: string; nodes: Node[] }> };
const base = '/brand/diagnosis/';
async function load(path: string) {
  const response = await fetch(base + path);
  if (!response.ok) throw new Error('Brand resource unavailable');
  return response;
}
function base64(bytes: Uint8Array) {
  let raw = '';
  for (let i = 0; i < bytes.length; i += 8192) raw += String.fromCharCode(...bytes.subarray(i, i + 8192));
  return btoa(raw);
}
let assets: Promise<{ kit: Kit; fonts: string[]; images: Record<string, string> }> | undefined;
function loadAssets() {
  if (!assets) assets = (async () => {
    const [kit, fonts, images] = await Promise.all([
      load('templates.json').then(r => r.json() as Promise<Kit>),
      Promise.all(['Regular', 'Medium'].map(async weight => base64(new Uint8Array(await (await load(`IBMPlexSans-${weight}.ttf`)).arrayBuffer())))),
      Promise.all(['logo-color.png', 'logo-white.png', 'flower.png', 'contours.png'].map(async name => [name, 'data:image/png;base64,' + base64(new Uint8Array(await (await load(name)).arrayBuffer()))] as const)),
    ]);
    return { kit, fonts, images: Object.fromEntries(images) };
  })().catch(error => { assets = undefined; throw error; });
  return assets;
}

export async function buildDiagnosisReport(lead: Lead, answers: number[], lang: string) {
  const en = lang === 'en';
  const t = (es: string, english: string) => en ? english : es;
  const result = evaluate(answers);
  const { kit, fonts, images } = await loadAssets();
  const doc = new jsPDF({ unit: 'pt', format: [kit.width, kit.height], compress: true });
  for (const [i, weight] of ['Regular', 'Medium'].entries()) {
    doc.addFileToVFS(`Plex-${weight}.ttf`, fonts[i]);
    doc.addFont(`Plex-${weight}.ttf`, 'Plex', weight === 'Regular' ? 'normal' : 'bold');
  }
  doc.setProperties({ title: t('Diagnóstico de madurez de IA', 'AI maturity diagnosis') + ' / ' + lead.company, author: 'TenBeltz', creator: 'TenBeltz / Brand kit 2026.10' });
  const C = kit.colors;
  const levels = en ? ['Foundations to define', 'Controls in progress', 'A structured foundation', 'Advanced practices'] : ['Bases por definir', 'Controles en desarrollo', 'Una base estructurada', 'Prácticas avanzadas'];
  const categories = en ? ['Stage', 'Success criteria', 'Test cases', 'Change evaluation', 'Observability', 'Cost and latency', 'Permissions', 'Adversarial testing', 'Failure recovery', 'Continuous improvement'] : ['Fase', 'Criterios de éxito', 'Casos de prueba', 'Evaluación de cambios', 'Observabilidad', 'Coste y latencia', 'Permisos', 'Pruebas adversas', 'Recuperación ante fallos', 'Mejora continua'];
  const text = (value: string, x: number, y: number, width: number, size = 11, color = 'ink', medium = false, limit = 770) => {
    doc.setFont('Plex', medium ? 'bold' : 'normal'); doc.setFontSize(size); doc.setTextColor(C[color]);
    const lines = doc.splitTextToSize(value, width) as string[];
    const leading = size * 1.4;
    if (y + lines.length * leading > limit) throw new Error('Report text exceeds its layout');
    doc.text(lines, x, y + size, { lineHeightFactor: 1.4 });
    return y + lines.length * leading;
  };
  function fitted(value: string, x: number, y: number, width: number, height: number, initial: number, color: string, medium = false) {
    let size = initial;
    doc.setFont('Plex', medium ? 'bold' : 'normal');
    while (size > 7) {
      doc.setFontSize(size);
      if ((doc.splitTextToSize(value, width) as string[]).length * size * 1.4 <= height) break;
      size -= .5;
    }
    return text(value, x, y, width, size, color, medium, y + height + .1);
  }
  const box = (x: number, y: number, w: number, h: number, fill = 'surface') => { doc.setFillColor(C[fill]); doc.rect(x, y, w, h, 'F'); };
  const line = (x: number, y: number, x2: number, y2: number, color = 'line') => { doc.setDrawColor(C[color]); doc.setLineWidth(.7); doc.line(x, y, x2, y2); };
  const date = new Date().toLocaleDateString(en ? 'en-GB' : 'es-ES');
  let pageCount = 0;
  function page(kind: string, label: string) {
    if (pageCount++) doc.addPage();
    const scene = kit.scenes[kind];
    box(0, 0, kit.width, kit.height, scene.background);
    for (const n of scene.nodes) {
      if (n.type === 'line') line(n.x, n.y, n.x2!, n.y2!, n.fill);
      if (n.type === 'image') doc.addImage(images[n.path!], 'PNG', n.x, n.y, n.w!, n.h!);
      if (n.type === 'rect') box(n.x, n.y, n.w!, n.h!, n.fill);
    }
    const dark = kind === 'closing';
    text(t('DIAGNÓSTICO / IA', 'DIAGNOSIS / AI'), 374, 43, 179, 8, dark ? 'petal' : 'muted', true, 80);
    text('TENBELTZ / ' + label, 42, 794, 455, 7.5, dark ? 'petal' : 'muted', false, 820);
    text(String(pageCount).padStart(2, '0'), 527, 794, 26, 8, dark ? 'petal' : 'muted', false, 820);
  }
  function title(value: string, subtitle: string, width = 511) {
    const end = text(value, 42, 116, width, 30, 'ink', true, 220);
    text(subtitle, 42, Math.max(end + 16, 209), 511, 10.5, 'muted', false, 258);
  }

  // Cover composition follows the brand-kit report/proposal cover geometry.
  page('cover', t('INFORME PERSONALIZADO', 'PERSONALISED REPORT'));
  text(t('INGENIERÍA DE IA / AUTOEVALUACIÓN', 'AI ENGINEERING / SELF-ASSESSMENT'), 42, 137, 511, 9, 'accent', true);
  text(t('De la nota\na un plan\nde acción.', 'From your score\nto an action\nplan.'), 42, 193, 500, 43, 'ink', true, 390);
  text(result.score.toLocaleString(en ? 'en-GB' : 'es-ES'), 42, 413, 220, 82, 'accent', true, 540);
  text('/ 10', 44, 524, 150, 18, 'muted');
  text(levels[result.level], 42, 567, 270, 13, 'accent', true, 625);
  fitted(lead.company, 42, 638, 511, 55, 19, 'ink', true);
  fitted(lead.name, 42, 704, 511, 22, 9, 'muted');
  fitted(lead.email, 42, 728, 511, 22, 8.5, 'muted');
  text(date, 42, 756, 511, 9, 'muted', false, 778);

  page('profile', t('VUESTRAS PRÁCTICAS', 'YOUR PRACTICES'));
  title(t('La foto de\nvuestro proyecto.', 'Your project\nat a glance.'), t('Nueve controles, según vuestras respuestas. Cada barra representa 0, 1 o 2 puntos.', 'Nine controls, based on your answers. Each bar represents 0, 1 or 2 points.'), 305);
  for (let i = 1; i < 10; i++) {
    const yy = 278 + (i - 1) * 43;
    text(categories[i], 42, yy, 223, 11, 'ink', true);
    box(282, yy + 5, 212, 9);
    if (answers[i]) box(282, yy + 5, 212 * answers[i] / 2, 9, 'accent');
    text(`${answers[i]} / 2`, 513, yy, 42, 10, 'muted');
  }
  box(42, 686, 511, 70);
  text(t('Fase del proyecto', 'Project stage'), 55, 697, 480, 9, 'muted', true);
  text(questions[0][en ? 3 : 2][answers[0]], 55, 717, 480, 14, 'accent', true);
  text(t('La fase da contexto y no modifica la nota.', 'Stage provides context and does not affect the score.'), 55, 739, 480, 8, 'muted');

  page('body', t('PLAN DE MEJORA', 'IMPROVEMENT PLAN'));
  title(result.priorities.length ? t('Primero, lo que\nmás conviene reforzar.', 'Start with what\nneeds strengthening.') : t('Mantened el nivel.\nPreparad la próxima revisión.', 'Maintain your practices.\nPrepare your next review.'), t('Acción, evidencia y responsable: una hoja de trabajo para vuestro equipo.', 'Action, evidence and owner: a worksheet for your team.'));
  const selected = result.priorities.length ? result.priorities : [2, 6, 8];
  const maintenance = en ? ['Expand the test set with recent incidents and rerun evaluations.', 'Review permissions after changes to users, tools or data sources.', 'Rehearse a failure scenario and check the handover and recovery process.'] : ['Ampliad el conjunto de pruebas con incidencias recientes y repetid las evaluaciones.', 'Revisad permisos tras cambios de usuarios, herramientas o fuentes de datos.', 'Ensayad un fallo y comprobad la derivación y la recuperación del servicio.'];
  selected.forEach((i, n) => {
    const top = 271 + n * 162;
    box(42, top, 511, 151);
    text(`0${n + 1}`, 55, top + 12, 42, 24, 'accent', true);
    let yy = text(categories[i], 108, top + 12, 431, 12, 'accent', true, top + 40);
    yy = text(result.priorities.length ? questions[i][en ? 5 : 4] : maintenance[n], 108, yy + 7, 431, 10, 'ink', false, top + 96);
    yy = text(t('Evidencia: ', 'Evidence: ') + priorityEvidence[i][en ? 1 : 0], 108, yy + 6, 431, 9, 'muted', false, top + 130);
    text(t('Responsable: __________________  Revisión: ______________', 'Owner: __________________  Review: ______________'), 108, top + 132, 431, 8, 'muted', false, top + 150);
  });
  if (selected.length < 3) {
    const yy = 271 + selected.length * 162 + 22;
    text(t('Acordad el siguiente paso en equipo.', 'Agree on the next step together.'), 42, yy, 511, 18, 'accent', true);
    text(t('Priorizad el alcance, asignad un responsable y elegid una evidencia de avance antes de la próxima revisión. Las demás prácticas también necesitan mantenimiento.', 'Agree scope, assign an owner and choose evidence of progress before your next review. The remaining practices also need maintenance.'), 42, yy + 39, 511, 11, 'muted');
  }

  for (let group = 0; group < 2; group++) {
    page('body', t('REGISTRO DE RESPUESTAS', 'ANSWER RECORD'));
    title(t('El punto de partida,\npregunta a pregunta.', 'Your starting point,\nquestion by question.'), `${t('Respuestas declaradas', 'Declared answers')} / ${group ? '06—10' : '01—05'}`);
    for (let n = 0; n < 5; n++) {
      const i = group * 5 + n, top = 278 + n * 92;
      line(42, top - 10, 553, top - 10);
      text(String(i + 1).padStart(2, '0'), 42, top, 40, 13, 'accent', true);
      const end = text(questions[i][en ? 1 : 0], 94, top, 459, 11, 'ink', true, top + 45);
      text(questions[i][en ? 3 : 2][answers[i]], 94, end + 8, 459, 10, 'muted', false, top + 80);
    }
  }

  page('closing', t('CRITERIO Y SIGUIENTE PASO', 'METHOD AND NEXT STEP'));
  text(t('Una dirección clara.\nUn siguiente paso\nque se puede comprobar.', 'A clear direction.\nA next step\nyou can verify.'), 42, 137, 511, 32, 'white', true, 300);
  text(t('Cómo leer este diagnóstico', 'How to read this diagnosis'), 42, 323, 511, 16, 'petal', true);
  text(t('La fase no puntúa. Las otras nueve preguntas suman 0, 1 o 2 puntos: nota = 1 + puntos / 2. Las prioridades corresponden a las respuestas con menos puntos; en empate, primero permisos, seguridad y evaluación.', 'Stage is not scored. The other nine questions earn 0, 1 or 2 points: score = 1 + points / 2. Priorities follow the lowest scores; ties favour permissions, security and evaluation.'), 42, 365, 511, 11, 'white');
  text(t('Autoevaluación, no certificación', 'Self-assessment, not certification'), 42, 467, 511, 16, 'petal', true);
  text(t('El informe se basa en lo declarado. No hemos inspeccionado el sistema ni verificado sus controles. La nota no demuestra que sea seguro ni apto para producción. El plan propone un orden de trabajo, no una estimación de esfuerzo ni una garantía de resultados.', 'This report is based on declared answers. We have not inspected your system or verified its controls. The score does not establish safety or production readiness. The plan suggests a work order, not an effort estimate or a guarantee of results.'), 42, 509, 511, 11, 'white');
  line(42, 619, 553, 619, 'muted');
  text(t('¿Lo revisamos con vuestro equipo?', 'Shall we review it with your team?'), 42, 647, 511, 21, 'white', true);
  text(t('Una llamada telefónica de 15 minutos para comentar el contexto y el siguiente paso.', 'A 15-minute phone call to discuss context and your next step.'), 42, 690, 511, 11, 'petal');
  text('hello@tenbeltz.com   /   tenbeltz.com', 42, 738, 511, 12, 'white', true);
  doc.link(42, 736, 165, 21, { url: 'mailto:hello@tenbeltz.com' });
  doc.link(227, 736, 180, 21, { url: en ? 'https://tenbeltz.com/en#contact-section' : 'https://tenbeltz.com/#contact-section' });
  return doc;
}
