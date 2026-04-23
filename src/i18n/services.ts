import type { Lang } from './ui';

export type ServiceId =
  | 'gap-analysis'
  | 'foundations'
  | 'agent-mvp'
  | 'production-delivery'
  | 'partner';

export interface Service {
  id: ServiceId;
  tag: string;
  title: string;
  description: string;
  fitTitle: string;
  fit: string;
  bullets: string[];
}

export interface HomeCardVariant {
  serviceId: ServiceId;
  tag: string;
  title: string;
  description: string;
}

export interface HomeCard {
  tag: string;
  title: string;
  description: string;
  bullets?: string[];
  variants?: HomeCardVariant[];
  serviceId?: ServiceId;
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
    variantsLabel: string;
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
    title: 'Cinco formas de trabajar con TenBeltz',
    text: 'La oferta se organiza según la madurez del proyecto: desde diagnosticar si merece la pena construirlo hasta acompañarte a largo plazo. La idea es entrar con el nivel correcto de implicación, no forzar a todos los clientes por el mismo camino.',
  },
  home: {
    title: 'Cinco formas de trabajar, cuatro puntos de entrada',
    intro: 'La oferta se organiza por madurez del proyecto. Elige dónde quieres entrar; en la página de servicios tienes el detalle completo.',
    variantsLabel: 'Dos modos',
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
        tag: 'Build',
        title: 'Construir el sistema',
        description: 'Para proyectos concretos. Dos modos según hasta dónde quieras que lleguemos.',
        variants: [
          {
            serviceId: 'agent-mvp',
            tag: 'MVP',
            title: 'Agent MVP',
            description: 'Montamos golden set, evals y primera versión del agente. Tu equipo termina el camino a producción.',
          },
          {
            serviceId: 'production-delivery',
            tag: 'Delivery',
            title: 'Production Delivery',
            description: 'Lo mismo, pero llevado end-to-end hasta producción e integrado en tu producto.',
          },
        ],
      },
      {
        serviceId: 'partner',
        tag: 'Partner',
        title: 'AI Partner',
        description: 'Para relaciones más largas donde acompañamos roadmap, mantenimiento, optimización de costes y decisiones técnicas.',
        bullets: [
          'Acompañamiento continuo',
          'Optimización y mantenimiento',
          'Presente en tus reuniones',
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
    {
      id: 'partner',
      tag: 'Partner',
      title: 'AI Partner',
      description: 'Relación continua para empresas con varias iniciativas de IA o consultoras que quieren a TenBeltz cerca del roadmap, del mantenimiento y de las conversaciones técnicas con sus clientes.',
      fitTitle: 'Encaja para',
      fit: 'SaaS con varias features de IA en marcha o consultoras que necesitan soporte senior en preventa y delivery con sus propios clientes.',
      bullets: [
        'Acompañamiento técnico continuo',
        'Optimización de costes y fiabilidad',
        'Apoyo en reuniones con tus clientes',
        'Mantenimiento y roadmap de IA',
        'Disponibilidad para decisiones técnicas',
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
      'Si IA pasa a ser una capacidad continua, evoluciona a AI Partner.',
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
    title: 'Five ways to work with TenBeltz',
    text: 'The offer is organized around project maturity: from diagnosing whether a case is worth building to supporting you long-term. The point is to enter with the right level of involvement, not to force every client through the same path.',
  },
  home: {
    title: 'Five ways to work, four entry points',
    intro: 'The offer is organized around project maturity. Pick where you want to enter; the services page has the full detail.',
    variantsLabel: 'Two modes',
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
        tag: 'Build',
        title: 'Build the system',
        description: 'For concrete projects. Two modes depending on how far you want us to go.',
        variants: [
          {
            serviceId: 'agent-mvp',
            tag: 'MVP',
            title: 'Agent MVP',
            description: 'We set up the golden set, evals, and first agent version. Your team carries it to production.',
          },
          {
            serviceId: 'production-delivery',
            tag: 'Delivery',
            title: 'Production Delivery',
            description: 'Same engagement, taken end-to-end through production and integrated with your product.',
          },
        ],
      },
      {
        serviceId: 'partner',
        tag: 'Partner',
        title: 'AI Partner',
        description: 'For longer relationships where we support roadmap, maintenance, cost optimization, and technical decision-making.',
        bullets: [
          'Continuous support',
          'Optimization and maintenance',
          'Present in your meetings',
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
    {
      id: 'partner',
      tag: 'Partner',
      title: 'AI Partner',
      description: 'Ongoing relationship for companies with multiple AI initiatives or consultancies that want TenBeltz close to the roadmap, the maintenance, and the technical conversations with their clients.',
      fitTitle: 'Best for',
      fit: 'SaaS teams with multiple AI features in play or consultancies that need senior support in pre-sales and delivery with their own clients.',
      bullets: [
        'Continuous technical support',
        'Cost and reliability optimization',
        'Support in meetings with your clients',
        'AI maintenance and roadmap',
        'Availability for technical decisions',
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
      'If AI becomes a continuous capability, move to AI Partner.',
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
  'partner',
];
