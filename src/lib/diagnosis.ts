export type DiagnosisLocale = 'es' | 'en';
type Copy = { es: string; en: string };
type Option = { id: string; label: Copy };
type ChoiceQuestion = { id: string; label: Copy; help: Copy; type: 'choice'; options: Option[] };
type TextQuestion = { id: string; label: Copy; help: Copy; type: 'text'; maxLength: number };
export type DiagnosisQuestion = ChoiceQuestion | TextQuestion;
export type DiagnosisLead = { name: string; company: string; email: string };
const copy = (es: string, en: string): Copy => ({ es, en });
const option = (id: string, es: string, en: string): Option => ({ id, label: copy(es, en) });

export const questions: DiagnosisQuestion[] = [
  { id: 'area', type: 'choice', label: copy('¿Qué trabajo te gustaría mejorar?', 'What work would you like to improve?'), help: copy('Elige por dónde empezar. Más adelante podremos revisar otras tareas.', 'Choose a starting point. We can review other tasks later.'), options: [option('documents', 'Documentos e informes', 'Documents and reports'), option('administration', 'Tareas administrativas', 'Administrative tasks'), option('service', 'Atención y consultas', 'Customer service and enquiries'), option('knowledge', 'Encontrar información interna', 'Finding internal information'), option('training', 'Formar a mi equipo', 'Training my team'), option('unknown', 'Necesito orientación', 'I need guidance')] },
  { id: 'process', type: 'text', label: copy('¿Cómo hacéis ese trabajo ahora?', 'How do you do this work today?'), help: copy('Por ejemplo: recibimos documentos por correo, extraemos datos y preparamos un informe. Es opcional; no incluyas información confidencial ni datos de terceros.', 'For example: we receive documents by email, extract information and prepare a report. Optional; do not include confidential information or other people’s personal data.'), maxLength: 400 },
  { id: 'frequency', type: 'choice', label: copy('¿Con qué frecuencia se repite?', 'How often does it happen?'), help: copy('Piensa en el proceso del equipo, aunque participen varias personas.', 'Think of the team’s workflow, even if several people are involved.'), options: [option('daily', 'Todos los días', 'Every day'), option('weekly', 'Cada semana', 'Every week'), option('monthly', 'Cada mes', 'Every month'), option('variable', 'La frecuencia varía', 'It varies'), option('unknown', 'No lo sé todavía', 'I do not know yet')] },
  { id: 'time', type: 'choice', label: copy('¿Cuánto tiempo dedica el equipo en total?', 'How much time does the team spend in total?'), help: copy('Estimación semanal del trabajo actual. Sirve para describir la carga; no es una estimación de ahorro.', 'An estimate of current work per week. This describes the workload; it is not an estimate of savings.'), options: [option('under-two', 'Menos de 2 horas por semana', 'Less than 2 hours per week'), option('two-ten', 'Entre 2 y 10 horas por semana', 'Between 2 and 10 hours per week'), option('over-ten', 'Más de 10 horas por semana', 'More than 10 hours per week'), option('variable', 'Depende de la semana', 'It depends on the week'), option('unknown', 'No lo sé todavía', 'I do not know yet')] },
  { id: 'tools', type: 'text', label: copy('¿Qué herramientas utilizáis?', 'Which tools do you use?'), help: copy('Correo, hojas de cálculo, un programa de gestión, carpetas compartidas… Es opcional; basta con sus nombres.', 'Email, spreadsheets, a business application, shared folders… Optional; their names are enough.'), maxLength: 240 },
  { id: 'sources', type: 'choice', label: copy('¿Dónde está la información que necesitáis?', 'Where is the information you need?'), help: copy('Elige la situación que mejor describe el proceso.', 'Choose the situation that best describes the workflow.'), options: [option('documents', 'En documentos y archivos', 'In documents and files'), option('email', 'En el correo y las conversaciones', 'In email and conversations'), option('systems', 'En nuestras herramientas de gestión', 'In our business tools'), option('scattered', 'Repartida entre varios sitios', 'Spread across several places'), option('unknown', 'Tenemos que revisarlo', 'We need to review this')] },
  { id: 'sensitivity', type: 'choice', label: copy('¿Hay información sensible o accesos restringidos?', 'Is any information sensitive or access restricted?'), help: copy('Por ejemplo: datos de clientes, expedientes o información reservada de la empresa.', 'For example: customer details, case files or confidential business information.'), options: [option('yes', 'Sí, hay información que debemos proteger', 'Yes, some information needs protection'), option('no', 'Trabajamos con información pública o no sensible', 'We work with public or non-sensitive information'), option('unknown', 'Tenemos que revisarlo', 'We need to review this')] },
  { id: 'owner', type: 'choice', label: copy('¿Quién revisaría los resultados y las excepciones?', 'Who would review results and exceptions?'), help: copy('Nos interesa el papel de esa persona, no su nombre.', 'We need the person’s role, not their name.'), options: [option('team', 'El equipo que hace la tarea', 'The team doing the task'), option('lead', 'La persona responsable del proceso', 'The workflow owner'), option('manager', 'Dirección o gerencia', 'Management'), option('unknown', 'Aún tenemos que decidirlo', 'We still need to decide')] },
  { id: 'goal', type: 'choice', label: copy('¿Qué os gustaría mejorar primero?', 'What would you like to improve first?'), help: copy('Elegir una prioridad nos ayudará a definir cómo comprobar el resultado.', 'One priority will help us define how to assess the result.'), options: [option('time', 'Dedicar menos tiempo a tareas repetitivas', 'Spend less time on repetitive tasks'), option('errors', 'Reducir errores y revisar mejor', 'Reduce errors and improve review'), option('service', 'Atender mejor las consultas', 'Handle enquiries better'), option('knowledge', 'Encontrar información con más facilidad', 'Find information more easily'), option('learning', 'Aprender a utilizar IA en el equipo', 'Learn to use AI as a team'), option('unknown', 'Necesitamos concretarlo', 'We need to define this')] },
  { id: 'stage', type: 'choice', label: copy('¿En qué punto estáis?', 'Where are you now?'), help: copy('No hace falta tener un proyecto de IA para empezar.', 'You do not need an existing AI project to start.'), options: [option('exploring', 'Explorando por dónde empezar', 'Exploring where to start'), option('defining', 'Eligiendo o definiendo un proceso', 'Choosing or defining a workflow'), option('implementation', 'Tenemos un proceso y buscamos implementarlo', 'We have a workflow and want to implement it'), option('improving', 'Queremos mejorar una solución existente', 'We want to improve an existing solution'), option('training', 'Buscamos formación para el equipo', 'We need training for the team'), option('unknown', 'No lo sé todavía', 'I do not know yet')] },
];

export function isValidAnswer(question: DiagnosisQuestion, value: string): boolean {
  return question.type === 'text' ? value.length <= question.maxLength : question.options.some(item => item.id === value);
}

export function answerLabel(question: DiagnosisQuestion, value: string, lang: DiagnosisLocale): string {
  if (question.type === 'text') return value.trim() || (lang === 'en' ? 'To discuss together' : 'Para comentar juntos');
  return question.options.find(item => item.id === value)?.label[lang] ?? (lang === 'en' ? 'Not answered' : 'Sin responder');
}

export type DiagnosisResult = {
  nextStep: 'diagnosis' | 'implementation' | 'training';
  title: Copy;
  description: Copy;
  recommendation: Copy;
  actions: Copy[];
  clarify: Copy[];
};

export function evaluate(answers: string[]): DiagnosisResult {
  if (answers.length !== questions.length || answers.some((answer, index) => typeof answer !== 'string' || !isValidAnswer(questions[index], answer))) throw new Error('Incomplete process orientation');
  const training = answers[0] === 'training' || answers[8] === 'learning' || answers[9] === 'training';
  const implementation = !training && ['implementation', 'improving'].includes(answers[9]) && answers[0] !== 'unknown' && answers[8] !== 'unknown' && answers[7] !== 'unknown';
  const nextStep = training ? 'training' : implementation ? 'implementation' : 'diagnosis';
  const clarify: Copy[] = [];
  if (answers[0] === 'unknown' || !answers[1].trim()) clarify.push(copy('Elegir y describir una tarea concreta del equipo.', 'Choose and describe one specific team task.'));
  if (['unknown', 'variable'].includes(answers[2]) || ['unknown', 'variable'].includes(answers[3])) clarify.push(copy('Estimar frecuencia y tiempo actual con ejemplos de una semana habitual.', 'Estimate frequency and current effort using examples from a typical week.'));
  if (!answers[4].trim() || answers[5] === 'unknown') clarify.push(copy('Identificar herramientas, fuentes de información y posibilidades de acceso.', 'Identify tools, information sources and access options.'));
  if (answers[6] !== 'no') clarify.push(copy('Revisar qué información se puede utilizar, dónde se procesará y quién tendrá acceso.', 'Review which information can be used, where it will be processed and who can access it.'));
  if (answers[7] === 'unknown') clarify.push(copy('Acordar quién conoce el proceso y revisará los resultados.', 'Agree who knows the workflow and will review results.'));
  if (answers[8] === 'unknown') clarify.push(copy('Elegir una prioridad y una forma de comprobar la mejora.', 'Choose a priority and a way to assess improvement.'));
  if (training) return {
    nextStep, title: copy('Preparar formación para vuestro trabajo.', 'Prepare training around your work.'),
    description: copy('El aprendizaje del equipo aparece como una prioridad. Una conversación sobre roles, herramientas y tareas permite definir una formación aplicada.', 'Team learning is a priority. A conversation about roles, tools and tasks will help define practical training.'),
    recommendation: copy('Formación aplicada', 'Practical training'),
    actions: [copy('Reunid los perfiles del equipo y las tareas en las que queréis utilizar IA.', 'List the team’s roles and the tasks where you want to use AI.'), copy('Elegid ejemplos de trabajo que se puedan utilizar durante los ejercicios.', 'Choose work examples that can be used in exercises.'), copy('Acordad objetivos de aprendizaje y criterios para revisar el uso de las herramientas.', 'Agree learning objectives and criteria for reviewing tool use.')], clarify,
  };
  if (implementation) return {
    nextStep, title: copy('Revisar el alcance de una implementación.', 'Review the scope of an implementation.'),
    description: copy('Habéis identificado una necesidad, una prioridad y quién revisaría los resultados. El siguiente paso es revisar herramientas, datos y alcance para preparar una implementación.', 'You have identified a need, a priority and someone to review results. The next step is to review tools, data and scope before preparing an implementation.'),
    recommendation: copy('Revisión de implementación', 'Implementation review'),
    actions: [copy('Describid el inicio, el resultado esperado y las excepciones del proceso.', 'Describe the start, expected output and exceptions in the workflow.'), copy('Preparad ejemplos representativos y revisad los accesos con quien gestiona las herramientas.', 'Prepare representative examples and review access with whoever manages the tools.'), copy('Acordad criterios de aceptación, costes de uso y responsabilidades después de la entrega.', 'Agree acceptance criteria, running costs and responsibilities after delivery.')], clarify,
  };
  return {
    nextStep, title: copy('Elegir un primer proceso con criterio.', 'Choose a first workflow with a clear purpose.'),
    description: copy('Conviene revisar las tareas del equipo y sus condiciones antes de decidir una solución. El diagnóstico de oportunidades ayuda a priorizar un primer proceso y definir qué necesita.', 'Review the team’s tasks and their conditions before choosing a solution. An opportunity diagnosis helps prioritise a first workflow and define what it needs.'),
    recommendation: copy('Diagnóstico de oportunidades', 'Opportunity diagnosis'),
    actions: [copy('Reunid ejemplos de las tareas que se repiten y de sus principales dificultades.', 'Gather examples of recurring tasks and their main difficulties.'), copy('Contrastad la información disponible, las herramientas y la persona responsable del proceso.', 'Review available information, tools and the person responsible for the workflow.'), copy('Priorizad una oportunidad y acordad cómo comprobar si la solución mejora el trabajo.', 'Prioritise one opportunity and agree how to assess whether a solution improves the work.')], clarify,
  };
}

export function diagnosisMessage(answers: string[], lang: DiagnosisLocale): string {
  const result = evaluate(answers);
  return [lang === 'en' ? 'Business process orientation — shared for follow-up' : 'Orientación de procesos de empresa — compartida para seguimiento', ...questions.map((question, index) => `${index + 1}. ${question.label[lang]}: ${answerLabel(question, answers[index], lang)}`), `${lang === 'en' ? 'Suggested next step' : 'Siguiente paso sugerido'}: ${result.recommendation[lang]}`, lang === 'en' ? 'The person requested sharing their details and answers with TenBeltz for follow-up. No newsletter subscription. This orientation does not establish viability or savings.' : 'La persona solicita compartir sus datos y respuestas con TenBeltz para contacto sobre el resultado. Sin suscripción a newsletter. La orientación no determina viabilidad ni ahorro.'].join('\n');
}
