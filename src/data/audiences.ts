import type { Lang } from '@/i18n/ui';

export type AudienceId = 'business' | 'software';
export interface AudienceCopy {
  id: AudienceId; path: string; seoTitle: string; seoDescription: string;
  eyebrow: string; title: string; intro: string; primaryCta: string; secondaryCta: string;
  problemTitle: string; problems: { title: string; text: string }[];
  applicationsTitle: string; applications: { title: string; text: string; evidenceIds: string[] }[];
  offerTitle: string; offerIntro: string; offers: { title: string; text: string; serviceId?: string }[];
  proofTitle: string; proofIntro: string; proofIds: string[];
  faqTitle: string; faqs: { question: string; answer: string }[];
  contactTitle: string; contactText: string; otherAudienceLabel: string; otherAudienceCta: string;
}
export interface HomeAudienceCopy {
  title: string; intro: string;
  paths: { id: AudienceId; title: string; text: string; cta: string; path: string }[];
}
const esBusiness: AudienceCopy = {
  id: 'business', path: '/ia-para-empresas',
  seoTitle: 'IA para empresas y pymes · Automatización | TenBeltz',
  seoDescription: 'Automatización de documentos, informes y tareas para empresas y pymes. Estudiamos tu proceso, integramos tus herramientas y definimos la revisión humana.',
  eyebrow: 'IA para empresas y pymes',
  title: 'Menos trabajo repetitivo. Más tiempo para tu negocio.',
  intro: 'Documentos que hay que ordenar, datos que se copian entre herramientas e informes que vuelven a empezar de cero. Estudiamos tu proceso y desarrollamos una solución conectada a la forma en que trabaja tu equipo.',
  primaryCta: 'Hablemos de tu proceso', secondaryCta: 'Ver aplicaciones',
  problemTitle: 'Empieza por el trabajo que se repite',
  problems: [
    { title: 'Información dispersa', text: 'Tu equipo busca los mismos datos en correos, documentos y programas distintos para completar una tarea.' },
    { title: 'Trabajo manual acumulado', text: 'Clasificar archivos, copiar información o preparar un primer borrador ocupa tiempo cada semana.' },
    { title: 'Dudas sobre dónde empezar', text: 'Quieres aplicar IA, pero necesitas saber qué proceso tiene sentido abordar y cómo comprobar el resultado.' },
  ],
  applicationsTitle: 'Procesos en los que podemos ayudarte',
  applications: [
    { title: 'Ordenar y extraer información', text: 'Clasificar documentos y convertir PDFs en datos que tu equipo pueda revisar y utilizar.', evidenceIds: ['clasificacion-documental', 'resoluciones'] },
    { title: 'Preparar informes con sus fuentes', text: 'Generar borradores a partir de documentación, conservar las referencias y revisar la información antes de cerrar el informe.', evidenceIds: ['informes-periciales', 'informes-tecnicos', 'biiak'] },
    { title: 'Conectar expedientes y herramientas', text: 'Reunir correo, documentos, agenda y tareas en un flujo con aprobaciones y trazabilidad.', evidenceIds: ['gestion-despachos', 'automatizacion-expedientes'] },
    { title: 'Atender y gestionar por voz', text: 'Conectar una conversación telefónica con disponibilidad, reservas y datos del negocio. Experiencia aplicada a través del software de hostelería Qamarero.', evidenceIds: ['qamarero'] },
  ],
  offerTitle: 'Del proceso a una solución que tu equipo pueda usar',
  offerIntro: 'Acordamos el punto de entrada según tu situación. El alcance, el presupuesto y los criterios de aceptación se definen antes de desarrollar.',
  offers: [
    { title: 'Elegir el proceso', text: 'Revisamos tareas, frecuencia, herramientas y datos. Definimos qué merece la pena abordar y cómo mediremos el resultado.' },
    { title: 'Construir y comprobar', text: 'Desarrollamos una primera versión, la probamos con casos representativos y acordamos cómo tratar los errores y las revisiones.' },
    { title: 'Integrar y acompañar', text: 'Conectamos la solución con el trabajo diario, documentamos su uso y acordamos responsables, mantenimiento y soporte.' },
  ],
  proofTitle: 'Experiencia aplicada a procesos reales',
  proofIntro: 'Proyectos de cliente, colaboraciones y un producto cofundado. Cada caso explica el contexto, nuestra contribución y sus límites.',
  proofIds: ['clasificacion-documental', 'gestion-despachos', 'informes-periciales'],
  faqTitle: 'Antes de empezar',
  faqs: [
    { question: '¿Tengo que saber de IA?', answer: 'No. Necesitamos entender la tarea, las herramientas que usáis y cómo reconocéis un buen resultado. Nosotros traducimos ese contexto a requisitos técnicos.' },
    { question: '¿Puede trabajar con mis programas?', answer: 'Estudiamos las opciones de integración de cada herramienta. El acceso disponible, las APIs y los permisos determinan qué podemos conectar y cómo.' },
    { question: '¿Qué pasa con la información confidencial?', answer: 'Revisamos qué datos son necesarios, quién puede acceder y dónde se procesan. Según el caso, planteamos modelos locales o servicios externos con condiciones acordadas.' },
    { question: '¿La IA tomará decisiones por mi equipo?', answer: 'Definimos qué puede automatizarse y qué necesita aprobación. Los informes, las propuestas y las actuaciones sensibles incorporan puntos de revisión.' },
    { question: '¿Cuánto cuesta y cuánto tarda?', answer: 'Depende del proceso, los datos y las integraciones. Tras revisar el contexto, proponemos un alcance con presupuesto, calendario y criterios de aceptación.' },
  ],
  contactTitle: 'Empecemos por una tarea concreta.',
  contactText: 'Cuéntanos qué hace hoy tu equipo, con qué frecuencia y qué te gustaría cambiar. No incluyas datos personales de terceros ni documentación confidencial.',
  otherAudienceLabel: '¿Desarrollas software para tus clientes?', otherAudienceCta: 'IA para equipos de software',
};
const esSoftware: AudienceCopy = {
  id: 'software', path: '/ia-para-software',
  seoTitle: 'Ingeniería de IA para SaaS y consultoras | TenBeltz',
  seoDescription: 'Equipo externo de ingeniería de IA para SaaS y consultoras de software. Arquitectura, agentes, evaluación, integración en producción y formación técnica.',
  eyebrow: 'IA para empresas de software',
  title: 'Incorpora IA a tu producto con un equipo de ingeniería a tu lado.',
  intro: 'Ayudamos a SaaS y consultoras a definir, desarrollar e integrar sistemas de IA. Arquitectura, evaluación y entrega coordinadas con tu equipo y con las restricciones de tu producto.',
  primaryCta: 'Hablemos de tu proyecto', secondaryCta: 'Ver formas de colaborar',
  problemTitle: 'Apoyo técnico en el momento que lo necesitas',
  problems: [
    { title: 'Una funcionalidad por definir', text: 'Tienes una idea en el roadmap y necesitas concretar datos, arquitectura, costes y criterios de calidad antes de construir.' },
    { title: 'Un proyecto que debe avanzar', text: 'Necesitas capacidad de implementación e integración, con responsabilidades claras y una entrega que tu equipo pueda mantener.' },
    { title: 'Criterio para tu consultora', text: 'Quieres preparar propuestas, arrancar proyectos y formar al equipo con una base técnica reutilizable.' },
  ],
  applicationsTitle: 'Sistemas conectados a tu producto',
  applications: [
    { title: 'Agentes de voz y herramientas', text: 'Conversaciones que consultan disponibilidad y ejecutan acciones mediante integraciones con tu software.', evidenceIds: ['qamarero'] },
    { title: 'Procesamiento documental', text: 'Extracción estructurada, clasificación y validación, con evaluación sobre documentos representativos.', evidenceIds: ['clasificacion-documental', 'resoluciones'] },
    { title: 'Búsqueda y generación con fuentes', text: 'Asistentes e informes que recuperan documentación, respetan permisos y permiten revisar las referencias.', evidenceIds: ['biiak', 'informes-tecnicos'] },
    { title: 'IA local y análisis de conversaciones', text: 'Selección de modelos e infraestructura según privacidad, carga de trabajo y necesidades de operación.', evidenceIds: ['irontec', 'biiak'] },
  ],
  offerTitle: 'Cinco formas de trabajar con TenBeltz',
  offerIntro: 'Puedes empezar con una decisión técnica, incorporar apoyo de desarrollo o preparar a tu equipo. Cada modalidad tiene un alcance propio.',
  offers: [
    { title: 'AI Gap Analysis · Diagnóstico', text: 'Reunión de contexto, informe técnico y presentación de un plan para decidir cómo abordar tu funcionalidad de IA.', serviceId: 'gap-analysis' },
    { title: 'AI Project Foundations · Bases técnicas', text: 'Stack, guías de planificación y criterios de preventa reutilizables para los proyectos de IA de tu consultora.', serviceId: 'foundations' },
    { title: 'Agent MVP · Primera versión', text: 'Sistema funcional con datos de referencia, pruebas de calidad y una guía de lo que falta para producción.', serviceId: 'agent-mvp' },
    { title: 'Production Delivery · Integración', text: 'Implementación, integración, controles operativos y documentación de entrega para tu equipo.', serviceId: 'production-delivery' },
    { title: 'Formación en IA aplicada', text: 'Sesiones prácticas sobre modelos locales, RAG, agentes y evaluación, adaptadas al nivel y al trabajo de tu equipo.', serviceId: 'training' },
  ],
  proofTitle: 'Ingeniería explicada a través de proyectos',
  proofIntro: 'Desde agentes telefónicos integrados en un SaaS hasta análisis de conversaciones e IA privada. Consulta la contribución y la relación en cada caso.',
  proofIds: ['qamarero', 'irontec', 'biiak'],
  faqTitle: 'Cómo encajamos con tu equipo',
  faqs: [
    { question: '¿Podéis colaborar con nuestro equipo de desarrollo?', answer: 'Sí. Acordamos responsabilidades, interfaces, revisión y documentación desde el inicio. El trabajo se adapta a tu producto y a la capacidad de tu equipo.' },
    { question: '¿Podemos asumir nosotros la entrega final?', answer: 'Sí. Agent MVP plantea una primera versión con pruebas y una guía de lo pendiente para que tu equipo continúe. Production Delivery cubre también la integración hasta producción.' },
    { question: '¿Trabajáis con consultoras de software?', answer: 'Sí. Podemos ayudarte con criterios técnicos de preventa, bases reutilizables, desarrollo y formación para los proyectos de tus clientes.' },
    { question: '¿Cómo comprobáis la calidad?', answer: 'Definimos casos de referencia y criterios de aceptación según la tarea. Evaluamos respuestas, errores, latencia y consumo cuando corresponde, y acordamos controles de operación.' },
    { question: '¿Quién dirige el trabajo?', answer: 'Aritz lidera las primeras reuniones, la consultoría y la definición técnica. El equipo desarrolla e integra bajo su dirección técnica, con responsabilidades acordadas para cada proyecto.' },
  ],
  contactTitle: 'Cuéntanos qué quieres incorporar a tu software.',
  contactText: 'Comparte el contexto, la fase del proyecto y el apoyo que necesitas. Acordaremos un punto de entrada y un alcance concreto.',
  otherAudienceLabel: '¿Buscas automatizar el trabajo de tu empresa?', otherAudienceCta: 'IA para empresas y pymes',
};
const enBusiness: AudienceCopy = {
  id: 'business', path: '/en/ai-for-business',
  seoTitle: 'AI for Businesses · Workflow Automation | TenBeltz',
  seoDescription: 'Document, report and workflow automation for businesses. We assess your process, integrate your tools and define where human review is needed.',
  eyebrow: 'AI for businesses and SMEs',
  title: 'Less repetitive work. More time for your business.',
  intro: 'Documents to organise, data copied between tools and reports started from scratch. We assess your process and build a solution around the way your team works.',
  primaryCta: 'Discuss your workflow', secondaryCta: 'Explore applications',
  problemTitle: 'Start with the work that keeps repeating',
  problems: [
    { title: 'Scattered information', text: 'Your team searches for the same information across emails, documents and different applications to complete a task.' },
    { title: 'Manual work that adds up', text: 'Sorting files, copying information and preparing first drafts take time every week.' },
    { title: 'Uncertainty about where to start', text: 'You want to use AI, but need to identify a worthwhile process and a way to assess the result.' },
  ],
  applicationsTitle: 'Processes we can help with',
  applications: [
    { title: 'Organise and extract information', text: 'Classify documents and turn PDFs into data your team can review and use.', evidenceIds: ['clasificacion-documental', 'resoluciones'] },
    { title: 'Prepare reports with their sources', text: 'Create drafts from documents, preserve references and review the information before finalising a report.', evidenceIds: ['informes-periciales', 'informes-tecnicos', 'biiak'] },
    { title: 'Connect case files and tools', text: 'Bring email, documents, calendars and tasks into a workflow with approvals and traceability.', evidenceIds: ['gestion-despachos', 'automatizacion-expedientes'] },
    { title: 'Handle enquiries and actions by voice', text: 'Connect a phone conversation with availability, bookings and business data. Experience delivered through Qamarero’s hospitality software.', evidenceIds: ['qamarero'] },
  ],
  offerTitle: 'From a workflow to a solution your team can use',
  offerIntro: 'We agree the right starting point for your situation. Scope, budget and acceptance criteria are defined before development begins.',
  offers: [
    { title: 'Choose the process', text: 'We review tasks, frequency, tools and data. We define what is worth tackling and how to measure the result.' },
    { title: 'Build and assess', text: 'We develop a first version, test representative cases and agree how errors and reviews will be handled.' },
    { title: 'Integrate and support', text: 'We connect the solution with daily work, document its use and agree responsibilities, maintenance and support.' },
  ],
  proofTitle: 'Experience with real business processes',
  proofIntro: 'Client projects, collaborations and a co-founded product. Each case explains the context, our contribution and its limits.',
  proofIds: ['clasificacion-documental', 'gestion-despachos', 'informes-periciales'],
  faqTitle: 'Before we start',
  faqs: [
    { question: 'Do I need to understand AI?', answer: 'No. We need to understand the task, the tools you use and what a good result looks like. We turn that context into technical requirements.' },
    { question: 'Can it work with my existing software?', answer: 'We assess the integration options for each tool. Available access, APIs and permissions determine what we can connect and how.' },
    { question: 'What happens to confidential information?', answer: 'We review which data is needed, who can access it and where it is processed. Depending on the case, we propose local models or external services under agreed conditions.' },
    { question: 'Will AI make decisions for my team?', answer: 'We define what can be automated and what requires approval. Reports, proposals and sensitive actions include review points.' },
    { question: 'How much does it cost and how long does it take?', answer: 'That depends on the process, data and integrations. After reviewing the context, we propose a scope with a budget, timeline and acceptance criteria.' },
  ],
  contactTitle: 'Let’s start with a specific task.',
  contactText: 'Tell us what your team does today, how often and what you would like to change. Please leave out third-party personal data and confidential documents.',
  otherAudienceLabel: 'Do you develop software for your customers?', otherAudienceCta: 'AI for software teams',
};
const enSoftware: AudienceCopy = {
  id: 'software', path: '/en/ai-for-software',
  seoTitle: 'AI Engineering for SaaS and Consultancies | TenBeltz',
  seoDescription: 'An external AI engineering team for SaaS and software consultancies. Architecture, agents, evaluation, production integration and technical training.',
  eyebrow: 'AI for software companies',
  title: 'Bring AI into your product with an engineering team alongside you.',
  intro: 'We help SaaS companies and consultancies define, build and integrate AI systems. Architecture, evaluation and delivery coordinated with your team and your product’s constraints.',
  primaryCta: 'Discuss your project', secondaryCta: 'Explore ways to work together',
  problemTitle: 'Technical support when you need it',
  problems: [
    { title: 'A feature to define', text: 'You have an idea on the roadmap and need to clarify data, architecture, costs and quality criteria before building.' },
    { title: 'A project that needs to move forward', text: 'You need implementation and integration capacity, with clear responsibilities and a handover your team can maintain.' },
    { title: 'A foundation for your consultancy', text: 'You want to prepare proposals, start projects and train your team with a reusable technical foundation.' },
  ],
  applicationsTitle: 'Systems connected to your product',
  applications: [
    { title: 'Voice agents and tools', text: 'Conversations that check availability and carry out actions through integrations with your software.', evidenceIds: ['qamarero'] },
    { title: 'Document processing', text: 'Structured extraction, classification and validation, evaluated against representative documents.', evidenceIds: ['clasificacion-documental', 'resoluciones'] },
    { title: 'Search and generation with sources', text: 'Assistants and reports that retrieve documents, respect permissions and provide references for review.', evidenceIds: ['biiak', 'informes-tecnicos'] },
    { title: 'Local AI and conversation analysis', text: 'Model and infrastructure choices guided by privacy, workload and operational needs.', evidenceIds: ['irontec', 'biiak'] },
  ],
  offerTitle: 'Five ways to work with TenBeltz',
  offerIntro: 'Start with a technical decision, add development support or prepare your team. Each engagement has its own scope.',
  offers: [
    { title: 'AI Gap Analysis · Assessment', text: 'A context meeting, technical report and roadmap presentation to decide how to approach your AI feature.', serviceId: 'gap-analysis' },
    { title: 'AI Project Foundations', text: 'Reusable technology choices, planning guides and technical pre-sales criteria for your consultancy’s AI projects.', serviceId: 'foundations' },
    { title: 'Agent MVP · First version', text: 'A working system with reference data, quality checks and a guide to what remains before production.', serviceId: 'agent-mvp' },
    { title: 'Production Delivery · Integration', text: 'Implementation, integration, operational controls and handover documentation for your team.', serviceId: 'production-delivery' },
    { title: 'Applied AI Training', text: 'Practical sessions on local models, RAG, agents and evaluation, adapted to your team’s skills and work.', serviceId: 'training' },
  ],
  proofTitle: 'Engineering explained through projects',
  proofIntro: 'From phone agents integrated into a SaaS product to conversation analysis and private AI. Each case describes the contribution and working relationship.',
  proofIds: ['qamarero', 'irontec', 'biiak'],
  faqTitle: 'Working alongside your team',
  faqs: [
    { question: 'Can you collaborate with our development team?', answer: 'Yes. We agree responsibilities, interfaces, review and documentation from the start. The work fits your product and your team’s capacity.' },
    { question: 'Can we handle the final delivery ourselves?', answer: 'Yes. Agent MVP provides a first version with tests and a guide to what remains, so your team can continue. Production Delivery also covers integration through production.' },
    { question: 'Do you work with software consultancies?', answer: 'Yes. We can support technical pre-sales, reusable foundations, development and training for your customers’ projects.' },
    { question: 'How do you assess quality?', answer: 'We define reference cases and acceptance criteria for the task. We assess responses, errors, latency and consumption where relevant, and agree operational controls.' },
    { question: 'Who leads the work?', answer: 'Aritz leads the initial meetings, consulting and technical definition. The team develops and integrates under his technical direction, with responsibilities agreed for each project.' },
  ],
  contactTitle: 'Tell us what you want to add to your software.',
  contactText: 'Share the context, project stage and support you need. We will agree a starting point and a concrete scope.',
  otherAudienceLabel: 'Looking to automate work in your business?', otherAudienceCta: 'AI for businesses and SMEs',
};
const audiences: Record<Lang, Record<AudienceId, AudienceCopy>> = {
  es: { business: esBusiness, software: esSoftware },
  en: { business: enBusiness, software: enSoftware },
};
const home: Record<Lang, HomeAudienceCopy> = {
  es: {
    title: 'IA aplicada a tu negocio y a tu producto.',
    intro: 'Ayudamos a empresas a automatizar procesos y a equipos de software a desarrollar e integrar IA. Partimos de un problema concreto y definimos cómo medir el resultado.',
    paths: [
      { id: 'business', title: 'Para empresas', text: 'Automatiza documentos, informes y tareas conectando la IA con el trabajo de tu equipo.', cta: 'Quiero automatizar un proceso', path: esBusiness.path },
      { id: 'software', title: 'Para equipos de software', text: 'Incorpora IA a tu producto o a los proyectos de tus clientes con apoyo de ingeniería.', cta: 'Quiero desarrollar IA en mi producto', path: esSoftware.path },
    ],
  },
  en: {
    title: 'AI for your business and your product.',
    intro: 'We help businesses automate workflows and software teams build and integrate AI. We start with a specific problem and define how to measure the result.',
    paths: [
      { id: 'business', title: 'For businesses', text: 'Automate documents, reports and tasks by connecting AI with your team’s work.', cta: 'I want to automate a workflow', path: enBusiness.path },
      { id: 'software', title: 'For software teams', text: 'Bring AI into your product or your customers’ projects with engineering support.', cta: 'I want to build AI into my product', path: enSoftware.path },
    ],
  },
};
export function getAudienceCopy(lang: Lang, id: AudienceId): AudienceCopy { return audiences[lang][id]; }
export function getHomeAudienceCopy(lang: Lang): HomeAudienceCopy { return home[lang]; }
