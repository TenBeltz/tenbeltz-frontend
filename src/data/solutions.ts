export type SolutionId = 'evaluation' | 'voice' | 'private-ai';

type SolutionCopy = {
  path: string;
  title: string;
  metaTitle: string;
  description: string;
  eyebrow: string;
  lead: string;
  problemTitle: string;
  problems: { title: string; text: string }[];
  methodTitle: string;
  method: { title: string; text: string }[];
  proofTitle: string;
  proofText: string;
  proofScope: string;
  caseHref: string;
  serviceTitle: string;
  serviceHref: string;
};

export const solutions: Record<SolutionId, Record<'es' | 'en', SolutionCopy>> = {
  evaluation: {
    es: {
      path: '/evaluacion-ia-saas',
      title: 'Evaluación de IA para productos SaaS',
      metaTitle: 'Evaluación de IA para productos SaaS | TenBeltz',
      description: 'Mide calidad, regresiones, latencia y coste de un sistema de IA antes de ampliarlo dentro de tu producto SaaS.',
      eyebrow: 'Evaluación de sistemas de IA',
      lead: 'Comprueba cómo responde el sistema en casos reales antes de elegir un modelo, ampliar usuarios o publicar un cambio.',
      problemTitle: 'Una demo no demuestra que el sistema esté listo',
      problems: [
        { title: 'Calidad sin una referencia común', text: 'Sin casos representativos y criterios de aceptación, cada cambio de modelo o instrucciones se juzga a ojo.' },
        { title: 'Regresiones difíciles de detectar', text: 'Una respuesta mejor en un ejemplo puede empeorar otras tareas. Compara versiones sobre el mismo conjunto de casos.' },
        { title: 'Coste y latencia fuera de contexto', text: 'El consumo medio no explica qué tareas son caras o lentas. Mide por tarea, incluidos los casos más exigentes.' },
      ],
      methodTitle: 'Qué medimos antes de ampliar',
      method: [
        { title: 'Casos de referencia', text: 'Reunimos ejemplos representativos, errores conocidos y el resultado aceptable para cada tarea.' },
        { title: 'Comparación reproducible', text: 'Evaluamos modelos, instrucciones y arquitecturas sobre los mismos casos para detectar mejoras y regresiones.' },
        { title: 'Criterios de operación', text: 'Documentamos calidad, latencia y coste con umbrales que el equipo pueda volver a comprobar.' },
      ],
      proofTitle: 'Clasificación documental comparada sobre datos de test',
      proofText: 'El ensemble final alcanzó 72,35 % Top-1 y 91,51 % Top-5; el baseline CSLS del mismo test obtuvo 56,44 % y 83,66 %.',
      proofScope: 'Evaluación de 1.414 documentos reservados y 77 subcategorías. Son métricas de clasificación del conjunto de test, no una garantía para otros datos ni una medida de throughput.',
      caseHref: '/casos#clasificacion-documental',
      serviceTitle: 'Diagnóstico técnico o Agent MVP',
      serviceHref: '/services#service-gap-analysis',
    },
    en: {
      path: '/ai-evaluation-for-saas',
      title: 'AI evaluation for SaaS products',
      metaTitle: 'AI evaluation for SaaS products | TenBeltz',
      description: 'Measure quality, regressions, latency and cost before expanding an AI system inside your SaaS product.',
      eyebrow: 'AI system evaluation',
      lead: 'See how a system performs on real cases before choosing a model, expanding access or shipping a change.',
      problemTitle: 'A demo does not prove a system is ready',
      problems: [
        { title: 'Quality without a shared baseline', text: 'Without representative cases and acceptance criteria, model and prompt changes are judged by feel.' },
        { title: 'Regressions that are easy to miss', text: 'A better answer on one example can make other tasks worse. Compare versions on the same test set.' },
        { title: 'Cost and latency without context', text: 'Average usage does not show which tasks are expensive or slow. Measure per task, including demanding cases.' },
      ],
      methodTitle: 'What we measure before expansion',
      method: [
        { title: 'Reference cases', text: 'Collect representative examples, known failures and an acceptable outcome for each task.' },
        { title: 'Reproducible comparison', text: 'Evaluate models, prompts and architectures on the same cases to find improvements and regressions.' },
        { title: 'Operating criteria', text: 'Document quality, latency and cost with thresholds your team can check again.' },
      ],
      proofTitle: 'Document classification compared on held-out data',
      proofText: 'The final ensemble reached 72.35% Top-1 and 91.51% Top-5; the CSLS baseline on the same test reached 56.44% and 83.66%.',
      proofScope: 'Evaluation on 1,414 held-out documents across 77 subcategories. These are classification metrics on that test set, not a guarantee on other data or a throughput measure.',
      caseHref: '/case-studies#clasificacion-documental',
      serviceTitle: 'Technical diagnosis or Agent MVP',
      serviceHref: '/services#service-gap-analysis',
    },
  },
  voice: {
    es: {
      path: '/agentes-voz-saas',
      title: 'Agentes de voz integrados en productos SaaS',
      metaTitle: 'Agentes de voz para productos SaaS | TenBeltz',
      description: 'Diseña e integra agentes de voz conectados a los datos y acciones de tu SaaS, con límites claros y transferencia a una persona.',
      eyebrow: 'Agentes de voz para software',
      lead: 'Un agente de voz útil necesita consultar el estado real del producto y completar una tarea, no limitarse a mantener una conversación.',
      problemTitle: 'La voz es una interfaz; la integración hace el trabajo',
      problems: [
        { title: 'Información desactualizada', text: 'Sin conexión con el producto, el agente no conoce disponibilidad, horarios, pedidos o el contexto del cliente.' },
        { title: 'Conversación sin acción', text: 'La llamada debe terminar en una operación confirmada o en un traspaso claro, no en una promesa del agente.' },
        { title: 'Fallos difíciles de revisar', text: 'Transcripción, herramientas y respuesta necesitan trazabilidad para entender qué pasó y corregirlo.' },
      ],
      methodTitle: 'Diseño de extremo a extremo',
      method: [
        { title: 'Delimitamos tareas', text: 'Definimos qué puede resolver el agente, qué datos consulta y cuándo debe detenerse.' },
        { title: 'Conectamos el producto', text: 'Integramos herramientas con las APIs y reglas existentes para leer y ejecutar acciones autorizadas.' },
        { title: 'Evaluamos y desplegamos', text: 'Probamos conversaciones representativas, fallos y transferencias antes de operar con usuarios.' },
      ],
      proofTitle: 'Reservas telefónicas conectadas al SaaS de Qamarero',
      proofText: 'El agente consulta disponibilidad y conecta las reservas con el CRM, las mesas y los horarios del restaurante.',
      proofScope: 'Proyecto de cliente de TenBeltz; la página del caso describe la integración y su operación, sin publicar métricas de volumen o conversión.',
      caseHref: '/casos#qamarero',
      serviceTitle: 'Agent MVP o entrega en producción',
      serviceHref: '/services#service-agent-mvp',
    },
    en: {
      path: '/voice-agents-for-saas',
      title: 'Voice agents integrated into SaaS products',
      metaTitle: 'Voice agents for SaaS products | TenBeltz',
      description: 'Design and integrate voice agents connected to your SaaS data and actions, with clear limits and human handover.',
      eyebrow: 'Voice agents for software',
      lead: 'A useful voice agent needs to read the product’s live state and complete a task, not just hold a conversation.',
      problemTitle: 'Voice is an interface; integration does the work',
      problems: [
        { title: 'Out-of-date information', text: 'Without a product connection, an agent cannot check availability, opening hours, orders or customer context.' },
        { title: 'Conversation without action', text: 'A call should end in a confirmed operation or a clear handover, not an agent’s promise.' },
        { title: 'Failures that are hard to review', text: 'Transcription, tools and answers need traceability so the team can understand and fix what happened.' },
      ],
      methodTitle: 'End-to-end design',
      method: [
        { title: 'Scope the tasks', text: 'Define what the agent can resolve, which data it can access and when it must stop.' },
        { title: 'Connect the product', text: 'Integrate tools with existing APIs and rules to read and perform authorised actions.' },
        { title: 'Evaluate and deploy', text: 'Test representative conversations, failures and handovers before serving users.' },
      ],
      proofTitle: 'Phone bookings connected to Qamarero’s SaaS',
      proofText: 'The agent checks availability and connects bookings with the restaurant’s CRM, tables and opening hours.',
      proofScope: 'A TenBeltz client project. The case page describes the integration and operation; volume and conversion metrics are not published.',
      caseHref: '/case-studies#qamarero',
      serviceTitle: 'Agent MVP or production delivery',
      serviceHref: '/services#service-agent-mvp',
    },
  },
  'private-ai': {
    es: {
      path: '/ia-privada-productos',
      title: 'IA privada para productos de software',
      metaTitle: 'IA privada y local para productos de software | TenBeltz',
      description: 'Evalúa modelos locales y despliegues privados para integrar IA en productos con requisitos de privacidad, control e infraestructura propios.',
      eyebrow: 'Modelos locales y despliegue privado',
      lead: 'Cuando los datos, la latencia o el control de infraestructura importan, la arquitectura debe decidir qué se procesa localmente y cómo se opera.',
      problemTitle: 'Privacidad y operación se diseñan juntas',
      problems: [
        { title: 'Datos que no deben salir del entorno', text: 'Identifica qué información se procesa, qué servicios intervienen y dónde se ejecuta cada parte.' },
        { title: 'Modelos locales con límites reales', text: 'Evalúa calidad, hardware, latencia y mantenimiento para las tareas concretas del producto.' },
        { title: 'Control y revisión', text: 'Define permisos, trazas y puntos de revisión humana en vez de asumir que el despliegue privado resuelve todo por sí solo.' },
      ],
      methodTitle: 'Decisiones técnicas que acotamos',
      method: [
        { title: 'Requisitos de datos', text: 'Mapeamos sensibilidad, residencia, accesos y límites de terceros.' },
        { title: 'Prueba sobre la tarea', text: 'Comparamos alternativas locales y externas con los mismos criterios de calidad, latencia y coste.' },
        { title: 'Operación y transferencia', text: 'Documentamos el despliegue, los controles y lo que el equipo necesitará para mantenerlo.' },
      ],
      proofTitle: 'Dos experiencias distintas con IA local',
      proofText: 'En la colaboración con Irontec se adaptó Konect para procesar localmente una carga prevista de 500 llamadas al día. Biiak es un producto cofundado por Aritz con IA local para información sensible.',
      proofScope: 'La cifra de llamadas describe la carga contemplada para la adaptación, no una prueba de rendimiento. Biiak se presenta como producto cofundado, no como cliente de TenBeltz.',
      caseHref: '/casos#irontec',
      serviceTitle: 'Diagnóstico técnico o bases de arquitectura',
      serviceHref: '/services#service-gap-analysis',
    },
    en: {
      path: '/private-ai-products',
      title: 'Private AI for software products',
      metaTitle: 'Private and local AI for software products | TenBeltz',
      description: 'Assess local models and private deployments for products with data privacy, control and infrastructure requirements.',
      eyebrow: 'Local models and private deployment',
      lead: 'When data, latency or infrastructure control matter, the architecture must decide what runs locally and how it will be operated.',
      problemTitle: 'Privacy and operations belong in the same design',
      problems: [
        { title: 'Data that must stay in its environment', text: 'Identify what is processed, which services are involved and where each part runs.' },
        { title: 'Local models with real constraints', text: 'Evaluate quality, hardware, latency and maintenance for the product’s actual tasks.' },
        { title: 'Control and review', text: 'Define permissions, traces and human review points instead of assuming private deployment solves everything.' },
      ],
      methodTitle: 'Technical decisions we scope',
      method: [
        { title: 'Data requirements', text: 'Map sensitivity, residency, access and third-party boundaries.' },
        { title: 'Test against the task', text: 'Compare local and hosted options against the same quality, latency and cost criteria.' },
        { title: 'Operations and handover', text: 'Document deployment, controls and what the team needs to maintain it.' },
      ],
      proofTitle: 'Two distinct experiences with local AI',
      proofText: 'In the Irontec collaboration, Konect was adapted to process locally a planned workload of 500 calls per day. Biiak is a product co-founded by Aritz, using local AI for sensitive information.',
      proofScope: 'The call count describes the workload considered for the adaptation, not a performance benchmark. Biiak is identified as a co-founded product, not a TenBeltz client.',
      caseHref: '/case-studies#irontec',
      serviceTitle: 'Technical diagnosis or architecture foundations',
      serviceHref: '/services#service-gap-analysis',
    },
  },
};
