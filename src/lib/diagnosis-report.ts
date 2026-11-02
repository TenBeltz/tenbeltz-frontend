import { jsPDF } from 'jspdf';
import { answerLabel, evaluate, questions, type DiagnosisLead, type DiagnosisLocale } from './diagnosis';

type SceneNode = { type: string; x: number; y: number; w?: number; h?: number; x2?: number; y2?: number; fill?: string; path?: string };
type Kit = { width: number; height: number; colors: Record<string, string>; scenes: Record<string, { background: string; nodes: SceneNode[] }> };
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
      load('templates.json').then(response => response.json() as Promise<Kit>),
      Promise.all(['Regular', 'Medium'].map(async weight => base64(new Uint8Array(await (await load(`IBMPlexSans-${weight}.ttf`)).arrayBuffer())))),
      Promise.all(['logo-color.png', 'logo-white.png', 'flower.png', 'contours.png'].map(async name => [name, 'data:image/png;base64,' + base64(new Uint8Array(await (await load(name)).arrayBuffer()))] as const)),
    ]);
    return { kit, fonts, images: Object.fromEntries(images) };
  })().catch(error => { assets = undefined; throw error; });
  return assets;
}

export async function buildDiagnosisReport(lead: DiagnosisLead, answers: string[], lang: string) {
  const locale: DiagnosisLocale = lang === 'en' ? 'en' : 'es';
  const en = locale === 'en';
  const t = (es: string, english: string) => en ? english : es;
  const result = evaluate(answers);
  if (!lead.name.trim() || !lead.company.trim() || !lead.email.trim() || lead.name.length > 120 || lead.company.length > 160 || lead.email.length > 254) throw new Error('Invalid report recipient');
  const { kit, fonts, images } = await loadAssets();
  const doc = new jsPDF({ unit: 'pt', format: [kit.width, kit.height], compress: true });
  for (const [index, weight] of ['Regular', 'Medium'].entries()) {
    doc.addFileToVFS(`Plex-${weight}.ttf`, fonts[index]);
    doc.addFont(`Plex-${weight}.ttf`, 'Plex', weight === 'Regular' ? 'normal' : 'bold');
  }
  doc.setProperties({ title: t('Tu primer proceso con IA', 'Your first AI workflow') + ' / ' + lead.company, author: 'TenBeltz', creator: 'TenBeltz / Brand kit 2026.10', subject: t('Orientación de procesos basada en las respuestas compartidas', 'Workflow orientation based on shared answers') });
  const colors = kit.colors;
  function lines(value: string, width: number, size: number, medium = false) {
    doc.setFont('Plex', medium ? 'bold' : 'normal');
    doc.setFontSize(size);
    return doc.splitTextToSize(value, width) as string[];
  }
  function text(value: string, x: number, y: number, width: number, size = 11, color = 'ink', medium = false, bottom = 765) {
    const wrapped = lines(value, width, size, medium);
    const end = y + wrapped.length * size * 1.45;
    if (end > bottom) throw new Error('Report text exceeds its layout');
    doc.setTextColor(colors[color]);
    doc.text(wrapped, x, y + size, { lineHeightFactor: 1.45 });
    return end;
  }
  function fitted(value: string, x: number, y: number, width: number, height: number, initial: number, color: string, medium = false) {
    let size = initial;
    while (size > 7 && lines(value, width, size, medium).length * size * 1.45 > height) size -= .5;
    return text(value, x, y, width, size, color, medium, y + height + .1);
  }
  const box = (x: number, y: number, w: number, h: number, fill = 'surface') => { doc.setFillColor(colors[fill]); doc.rect(x, y, w, h, 'F'); };
  const line = (x: number, y: number, x2: number, y2: number, color = 'line') => { doc.setDrawColor(colors[color]); doc.setLineWidth(.7); doc.line(x, y, x2, y2); };
  let pageCount = 0;
  function page(kind: string, label: string) {
    if (pageCount++) doc.addPage();
    const scene = kit.scenes[kind];
    box(0, 0, kit.width, kit.height, scene.background);
    for (const node of scene.nodes) {
      if (node.type === 'line') line(node.x, node.y, node.x2!, node.y2!, node.fill);
      if (node.type === 'image') doc.addImage(images[node.path!], 'PNG', node.x, node.y, node.w!, node.h!);
      if (node.type === 'rect') box(node.x, node.y, node.w!, node.h!, node.fill);
    }
    const dark = kind === 'closing';
    text(t('PROCESOS / IA', 'WORKFLOWS / AI'), 374, 43, 179, 8, dark ? 'petal' : 'muted', true, 80);
    text('TENBELTZ / ' + label, 42, 794, 455, 7.5, dark ? 'petal' : 'muted', false, 820);
    text(String(pageCount).padStart(2, '0'), 527, 794, 26, 8, dark ? 'petal' : 'muted', false, 820);
  }
  function title(value: string, subtitle: string) {
    const end = text(value, 42, 116, 511, 29, 'ink', true, 215);
    text(subtitle, 42, Math.max(end + 15, 202), 511, 10, 'muted', false, 255);
  }

  page('cover', t('RESUMEN PERSONALIZADO', 'PERSONALISED SUMMARY'));
  text(t('IA APLICADA AL TRABAJO DIARIO', 'AI FOR EVERYDAY WORK'), 42, 137, 511, 9, 'accent', true);
  text(t('Tu primer\nproceso\ncon IA.', 'Your first\nworkflow\nwith AI.'), 42, 192, 500, 43, 'ink', true, 390);
  text(t('UN PUNTO DE PARTIDA PARA CONVERSAR', 'A STARTING POINT FOR A CONVERSATION'), 42, 424, 235, 8, 'muted', true, 480);
  fitted(result.recommendation[locale], 42, 482, 228, 115, 22, 'accent', true);
  fitted(lead.company, 42, 638, 511, 55, 19, 'ink', true);
  fitted(lead.name, 42, 704, 511, 22, 9, 'muted');
  fitted(lead.email, 42, 728, 511, 22, 8.5, 'muted');
  text(new Date().toLocaleDateString(en ? 'en-GB' : 'es-ES'), 42, 756, 511, 9, 'muted', false, 778);

  page('body', t('EL PUNTO DE PARTIDA', 'YOUR STARTING POINT'));
  title(t('Lo que queréis\nmejorar.', 'What you want\nto improve.'), t('Un resumen de lo que habéis indicado, para revisar con el equipo.', 'A summary of what you shared, ready for a team review.'));
  let cursor = 273;
  const summaryLabels = en ? ['Work area', 'Priority', 'Current stage', 'Frequency', 'Current team effort', 'Information sources', 'Information sensitivity', 'Result review'] : ['Área de trabajo', 'Prioridad', 'Momento actual', 'Frecuencia', 'Dedicación actual del equipo', 'Fuentes de información', 'Sensibilidad de la información', 'Revisión de resultados'];
  [0, 8, 9, 2, 3, 5, 6, 7].forEach((index, row) => {
    line(42, cursor - 5, 553, cursor - 5);
    text(summaryLabels[row], 42, cursor + 6, 170, 9, 'muted', true);
    text(answerLabel(questions[index], answers[index], locale), 230, cursor + 5, 323, 11, 'ink', false, cursor + 50);
    cursor += 55;
  });
  text(t('El tiempo indicado describe la carga de trabajo actual; no estima el ahorro de una solución.', 'The time you shared describes current workload; it does not estimate savings from a solution.'), 42, 735, 511, 9, 'muted', false, 770);

  page('body', t('SIGUIENTE PASO', 'NEXT STEP'));
  title(t('Preparar la\nsiguiente conversación.', 'Prepare the\nnext conversation.'), result.recommendation[locale]);
  cursor = 272;
  cursor = text(result.description[locale], 42, cursor, 511, 11) + 24;
  result.actions.forEach((action, index) => {
    const height = lines(action[locale], 461, 11).length * 11 * 1.45 + 24;
    if (cursor + height > 755) {
      page('body', t('SIGUIENTE PASO', 'NEXT STEP'));
      title(t('Preparar la conversación.', 'Prepare the conversation.'), t('Continuación de los pasos propuestos.', 'Suggested steps, continued.'));
      cursor = 272;
    }
    line(42, cursor, 553, cursor);
    text(`0${index + 1}`, 42, cursor + 13, 36, 12, 'accent', true);
    cursor = text(action[locale], 92, cursor + 12, 461, 11) + 20;
  });
  if (result.clarify.length) {
    if (cursor > 620) {
      page('body', t('CUESTIONES POR CONCRETAR', 'QUESTIONS TO CLARIFY'));
      title(t('Qué falta\npor concretar.', 'What remains\nto be clarified.'), t('Información útil para definir el alcance.', 'Useful information for defining scope.'));
      cursor = 272;
    } else cursor = text(t('Cuestiones por concretar', 'Questions to clarify'), 42, cursor + 10, 511, 15, 'accent', true) + 16;
    for (const item of result.clarify) {
      const height = lines(item[locale], 491, 10).length * 14.5 + 13;
      if (cursor + height > 755) {
        page('body', t('CUESTIONES POR CONCRETAR', 'QUESTIONS TO CLARIFY'));
        title(t('Qué falta por concretar.', 'What remains to be clarified.'), t('Continuación.', 'Continued.'));
        cursor = 272;
      }
      text('—', 42, cursor, 18, 10, 'accent');
      cursor = text(item[locale], 62, cursor, 491, 10, 'muted') + 13;
    }
  }

  page('body', t('HOJA DE TRABAJO', 'TEAM WORKSHEET'));
  title(t('Acordad el primer\npaso en equipo.', 'Agree the first\nstep as a team.'), t('Completad esta hoja al revisar el proceso.', 'Complete this worksheet when reviewing the workflow.'));
  const worksheet = en ? ['Task and expected result', 'Person responsible for the workflow', 'Representative examples available', 'Tools, access and information to review', 'How we will assess the result', 'Next meeting and participants'] : ['Tarea y resultado esperado', 'Persona responsable del proceso', 'Ejemplos representativos disponibles', 'Herramientas, accesos e información por revisar', 'Cómo comprobaremos el resultado', 'Próxima revisión y participantes'];
  worksheet.forEach((label, index) => {
    const top = 272 + index * 76;
    text(label, 42, top, 511, 10, 'accent', true);
    line(42, top + 51, 553, top + 51);
  });

  function answerPage() {
    page('body', t('REGISTRO DE RESPUESTAS', 'ANSWER RECORD'));
    title(t('Vuestras respuestas,\na la vista.', 'Your answers,\nin one place.'), t('Información declarada al completar la orientación de procesos.', 'Information provided when completing the workflow orientation.'));
    cursor = 272;
  }
  answerPage();
  questions.forEach((question, index) => {
    const label = question.label[locale];
    const answer = answerLabel(question, answers[index], locale).replace(/\s+/g, ' ');
    const height = lines(label, 461, 10.5, true).length * 10.5 * 1.45 + lines(answer, 461, 10).length * 14.5 + 33;
    if (cursor + height > 755) answerPage();
    line(42, cursor, 553, cursor);
    text(String(index + 1).padStart(2, '0'), 42, cursor + 14, 36, 11, 'accent', true);
    const labelEnd = text(label, 92, cursor + 13, 461, 10.5, 'ink', true);
    cursor = text(answer, 92, labelEnd + 9, 461, 10, 'muted') + 20;
  });

  page('closing', t('ALCANCE Y CONTACTO', 'SCOPE AND CONTACT'));
  text(t('Una necesidad clara.\nUn siguiente paso\nacordado contigo.', 'A clear need.\nA next step\nagreed with you.'), 42, 137, 511, 32, 'white', true, 300);
  text(t('Cómo utilizar este resumen', 'How to use this summary'), 42, 323, 511, 16, 'petal', true);
  text(t('Revisad las respuestas con quien conoce el proceso. Reunid ejemplos y utilizad la hoja de trabajo para concretar la tarea, las herramientas y las personas implicadas.', 'Review the answers with the people who know the workflow. Gather examples and use the worksheet to clarify the task, tools and people involved.'), 42, 365, 511, 11, 'white');
  text(t('Orientación para preparar una conversación', 'Guidance for preparing a conversation'), 42, 467, 511, 16, 'petal', true);
  text(t('Este documento organiza lo que habéis indicado. No hemos inspeccionado los sistemas ni verificado el proceso. El diagnóstico de consultoría estudia las oportunidades y sus requisitos con un alcance acordado. La viabilidad, el presupuesto y los resultados se valoran en ese contexto.', 'This document organises what you shared. We have not inspected your systems or verified the workflow. A consulting diagnosis reviews opportunities and requirements within an agreed scope. Viability, budget and outcomes are assessed in that context.'), 42, 509, 511, 11, 'white');
  line(42, 632, 553, 632, 'muted');
  text(t('Hablemos de tu empresa.', 'Let’s talk about your business.'), 42, 654, 511, 21, 'white', true);
  text(t('Una llamada telefónica de 15 minutos para conocer la necesidad y acordar el siguiente paso.', 'A 15-minute phone call to understand the need and agree on a next step.'), 42, 695, 511, 11, 'petal');
  text('hello@tenbeltz.com   /   tenbeltz.com', 42, 744, 511, 12, 'white', true);
  doc.link(42, 742, 165, 21, { url: 'mailto:hello@tenbeltz.com' });
  doc.link(227, 742, 180, 21, { url: en ? 'https://tenbeltz.com/en#contact-section' : 'https://tenbeltz.com/#contact-section' });
  return doc;
}
