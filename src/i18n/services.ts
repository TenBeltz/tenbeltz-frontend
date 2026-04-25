import type { Lang } from './ui';

export type ServiceId =
  | 'gap-analysis'
  | 'foundations'
  | 'agent-mvp'
  | 'production-delivery';

export interface Service {
  id: ServiceId;
  tag: string;
  title: string;
  description: string;
  fitTitle: string;
  fit: string;
  bullets: string[];
}

export interface HomeCard {
  serviceId: ServiceId;
  tag: string;
  title: string;
  description: string;
  bullets: string[];
}

export interface ServicesCopy {
  intro: {
    tag: string;
    title: string;
    text: string;
  };
  home: {
    title: string;
    intro: string;
    cards: HomeCard[];
  };
  services: Service[];
  path: {
    title: string;
    items: string[];
  };
  cta: {
    title: string;
    text: string;
    button: string;
  };
}

const es: ServicesCopy = {
  intro: {
    tag: 'Estructura de servicios',
    title: 'Cuatro formas de trabajar con TenBeltz',
    text: 'La oferta se organiza según la madurez del proyecto: desde diagnosticar si merece la pena construirlo hasta entregarlo en producción. La idea es entrar con el nivel correcto de implicación, no forzar a todos los clientes por el mismo camino.',
  },
  home: {
    title: 'Cuatro formas de trabajar, cuatro puntos de entrada',
    intro: 'La oferta se organiza por madurez del proyecto. Elige dónde quieres entrar; en la página de servicios tienes el detalle completo.',
    cards: [
      {
        serviceId: 'gap-analysis',
        tag: 'Entrada',
        title: 'AI Gap Analysis',
        description: 'Para equipos SaaS que no saben por dónde empezar o que ya probaron algo y no salió bien.',
        bullets: [
          'Reunión de contexto + informe',
          'Stack, datos y riesgos',
          'Guía paso a paso',
        ],
      },
      {
        serviceId: 'foundations',
        tag: 'Base',
        title: 'AI Project Foundations',
        description: 'Para consultoras que quieren una base técnica reutilizable para todos los proyectos de IA que les pidan sus clientes.',
        bullets: [
          'Stack técnico reutilizable',
          'Plantillas y criterios',
          'Soporte en preventa',
        ],
      },
      {
        serviceId: 'agent-mvp',
        tag: 'MVP',
        title: 'Agent MVP',
        description: 'Montamos golden set, evals y primera versión del agente. Tu equipo termina el camino a producción.',
        bullets: [
          'Golden set, evals y observabilidad',
          'Primera versión funcional',
          'Guía clara del tramo final a producción',
        ],
      },
      {
        serviceId: 'production-delivery',
        tag: 'Delivery',
        title: 'Production Delivery',
        description: 'Mismas bases técnicas, llevado end-to-end hasta producción e integrado en tu producto.',
        bullets: [
          'Implementación completa',
          'Integración en producto',
          'Entrega lista para producción',
        ],
      },
    ],
  },
  services: [
    {
      id: 'gap-analysis',
      tag: 'Entrada',
      title: 'AI Gap Analysis',
      description: 'Servicio compacto para equipos SaaS que no saben por dónde empezar o ya intentaron algo que no acabó de cuajar. Una reunión para recoger contexto, un informe escrito y una segunda reunión para presentarlo.',
      fitTitle: 'Encaja para',
      fit: 'SaaS con una feature de IA en el roadmap o un intento previo que quieres entender antes de invertir más.',
      bullets: [
        'Reunión de contexto sobre la feature objetivo',
        'Stack y herramientas recomendadas',
        'Datasets y datos que necesitarás',
        'Problemas previsibles y cómo evitarlos',
        'Guía paso a paso para los siguientes pasos',
      ],
    },
    {
      id: 'foundations',
      tag: 'Base',
      title: 'AI Project Foundations',
      description: 'Para consultoras de software que ejecutan proyectos a medida. Te dejamos una base reutilizable —stack, guías de planificación y herramientas— que sirve para cualquier proyecto de IA que te pidan tus clientes.',
      fitTitle: 'Encaja para',
      fit: 'Consultoras que quieren subir el nivel técnico de sus proyectos de IA sin depender del criterio puntual de cada persona del equipo.',
      bullets: [
        'Stack de herramientas estándar',
        'Guía de planificación de proyecto de IA',
        'Criterios técnicos para preventa',
        'Plantillas y entregables reutilizables',
        'Onboarding del equipo',
      ],
    },
    {
      id: 'agent-mvp',
      tag: 'MVP',
      title: 'Agent MVP',
      description: 'Para proyectos concretos donde queremos que arranques con criterio y tu equipo termine. Montamos el sistema de evaluación, observabilidad, golden set y la primera versión del agente, más la guía explícita de lo que falta para producción.',
      fitTitle: 'Encaja para',
      fit: 'Equipos con un proyecto definido que quieren arrancar bien y asumir el tramo final ellos mismos.',
      bullets: [
        'Golden set y dataset de referencia',
        'Sistema de evals y observabilidad',
        'Primera versión del agente o sistema',
        'Bases técnicas del proyecto',
        'Guía explícita de lo que falta para producción',
      ],
    },
    {
      id: 'production-delivery',
      tag: 'Delivery',
      title: 'Production Delivery',
      description: 'Lo mismo que Agent MVP, pero llevado hasta el final: sistema listo para producción e integrado en tu producto, sobre las mismas bases de evals, observabilidad y criterios de entrega.',
      fitTitle: 'Encaja para',
      fit: 'Equipos que quieren que TenBeltz asuma implementación, integración y entrega a producción de punta a punta.',
      bullets: [
        'Implementación completa del sistema',
        'Integración con tu producto existente',
        'Guardrails y controles operativos',
        'Entrega lista para producción',
        'Handover técnico al equipo',
      ],
    },
  ],
  path: {
    title: 'Cómo elegir el punto de entrada',
    items: [
      'Si primero necesitas claridad, empieza por AI Gap Analysis.',
      'Si eres consultora y quieres una base técnica reutilizable, elige AI Project Foundations.',
      'Si el proyecto ya es real y quieres arrancar con criterio pero asumir tú la entrega, Agent MVP.',
      'Si el alcance está claro y quieres que lleguemos hasta producción, Production Delivery.',
    ],
  },
  cta: {
    title: '¿Necesitas ayuda para elegir el camino?',
    text: 'Comparte el contexto y te diremos qué nivel de implicación tiene sentido.',
    button: 'Solicitar propuesta',
  },
};

const en: ServicesCopy = {
  intro: {
    tag: 'Service structure',
    title: 'Four ways to work with TenBeltz',
    text: 'The offer is organized around project maturity: from diagnosing whether a case is worth building to shipping it in production. The point is to enter with the right level of involvement, not to force every client through the same path.',
  },
  home: {
    title: 'Four ways to work, four entry points',
    intro: 'The offer is organized around project maturity. Pick where you want to enter; the services page has the full detail.',
    cards: [
      {
        serviceId: 'gap-analysis',
        tag: 'Entry',
        title: 'AI Gap Analysis',
        description: 'For SaaS teams that do not know where to start or already tried something that did not go well.',
        bullets: [
          'Context meeting + report',
          'Stack, data, and risks',
          'Step-by-step guide',
        ],
      },
      {
        serviceId: 'foundations',
        tag: 'Foundation',
        title: 'AI Project Foundations',
        description: 'For consultancies that want a reusable technical base for every AI project their clients bring them.',
        bullets: [
          'Reusable technical stack',
          'Templates and criteria',
          'Pre-sales support',
        ],
      },
      {
        serviceId: 'agent-mvp',
        tag: 'MVP',
        title: 'Agent MVP',
        description: 'We set up the golden set, evals, and first agent version. Your team carries it to production.',
        bullets: [
          'Golden set, evals, and observability',
          'First working version',
          'Clear guide for the final production stretch',
        ],
      },
      {
        serviceId: 'production-delivery',
        tag: 'Delivery',
        title: 'Production Delivery',
        description: 'Same technical foundations, taken end-to-end through production and integrated with your product.',
        bullets: [
          'Full implementation',
          'Product integration',
          'Production-ready delivery',
        ],
      },
    ],
  },
  services: [
    {
      id: 'gap-analysis',
      tag: 'Entry',
      title: 'AI Gap Analysis',
      description: 'A compact engagement for SaaS teams that do not know where to start or already tried something that did not land. One context meeting, a written report, and a second meeting to walk through it.',
      fitTitle: 'Best for',
      fit: 'SaaS teams with an AI feature on the roadmap or an earlier attempt they want to understand before investing more.',
      bullets: [
        'Context meeting on the target feature',
        'Recommended stack and tooling',
        'Data and datasets you will need',
        'Predictable risks and how to avoid them',
        'Step-by-step guide for the next steps',
      ],
    },
    {
      id: 'foundations',
      tag: 'Foundation',
      title: 'AI Project Foundations',
      description: 'For software consultancies that deliver custom projects. We leave a reusable base —stack, planning guides, and tooling— that works for any AI project their clients request.',
      fitTitle: 'Best for',
      fit: 'Consultancies that want to raise the technical bar on AI work without relying on individual judgment call by call.',
      bullets: [
        'Standard tooling stack',
        'AI project planning playbook',
        'Technical criteria for pre-sales',
        'Reusable templates and deliverables',
        'Team onboarding',
      ],
    },
    {
      id: 'agent-mvp',
      tag: 'MVP',
      title: 'Agent MVP',
      description: 'For concrete projects where we get you started with the right foundations and your team takes it over the finish line. We set up evaluation, observability, the golden set, and the first agent version, plus an explicit guide to what is left for production.',
      fitTitle: 'Best for',
      fit: 'Teams with a defined project that want to start well and own the last mile themselves.',
      bullets: [
        'Golden set and reference dataset',
        'Evaluation and observability system',
        'First version of the agent or system',
        'Technical foundations for the project',
        'Explicit guide on what is left for production',
      ],
    },
    {
      id: 'production-delivery',
      tag: 'Delivery',
      title: 'Production Delivery',
      description: 'Same as Agent MVP, taken to the finish line: system ready for production and integrated with your product, on the same evaluation, observability, and delivery foundations.',
      fitTitle: 'Best for',
      fit: 'Teams that want TenBeltz to own implementation, integration, and production delivery end to end.',
      bullets: [
        'Full system implementation',
        'Integration with your existing product',
        'Guardrails and operational controls',
        'Production-ready delivery',
        'Technical handover to the team',
      ],
    },
  ],
  path: {
    title: 'How to choose the right entry point',
    items: [
      'If you need clarity first, start with AI Gap Analysis.',
      'If you are a consultancy that wants a reusable technical base, choose AI Project Foundations.',
      'If the project is real and you want to kick off well but own delivery yourself, go with Agent MVP.',
      'If the scope is clear and you want us to take it to production, go with Production Delivery.',
    ],
  },
  cta: {
    title: 'Need help choosing the right path?',
    text: 'Share the context and we will tell you what level of engagement makes sense.',
    button: 'Request proposal',
  },
};

const copies: Record<Lang, ServicesCopy> = { es, en };

export function getServicesCopy(lang: Lang): ServicesCopy {
  return copies[lang] ?? copies.es;
}

export const serviceIds: ServiceId[] = [
  'gap-analysis',
  'foundations',
  'agent-mvp',
  'production-delivery',
];
