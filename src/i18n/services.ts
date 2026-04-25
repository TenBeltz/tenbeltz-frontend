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
    title: 'Cuatro formas de trabajar',
    intro: 'Cada modalidad corresponde a un momento distinto del proyecto. Aquí tienes la versión corta; en servicios está el detalle completo.',
    cards: [
      {
        serviceId: 'gap-analysis',
        tag: 'Entrada',
        title: 'AI Gap Analysis',
        description: 'Diagnóstico para decidir si merece la pena construirlo y salir con un roadmap claro para llevarlo a cabo.',
        bullets: [
          'Claridad técnica',
          'Roadmap del proyecto',
        ],
      },
      {
        serviceId: 'foundations',
        tag: 'Base',
        title: 'AI Project Foundations',
        description: 'Base técnica para que una consultora pueda definir, vender y arrancar proyectos de IA con más criterio.',
        bullets: [
          'Criterios reutilizables',
          'Soporte en preventa',
        ],
      },
      {
        serviceId: 'agent-mvp',
        tag: 'MVP',
        title: 'Agent MVP',
        description: 'Primera versión funcional de un agente o sistema de IA, con una forma clara de medir si responde bien.',
        bullets: [
          'MVP funcional',
          'Criterios de validación',
        ],
      },
      {
        serviceId: 'production-delivery',
        tag: 'Delivery',
        title: 'Production Delivery',
        description: 'Implementación completa hasta producción, integrada en tu producto y preparada para operar.',
        bullets: [
          'Integración en producto',
          'Entrega operable',
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
      description: 'Para proyectos concretos donde queremos que arranques con criterio y tu equipo termine. Montamos la primera versión del agente, las pruebas de calidad y la guía explícita de lo que falta para producción.',
      fitTitle: 'Encaja para',
      fit: 'Equipos con un proyecto definido que quieren arrancar bien y asumir el tramo final ellos mismos.',
      bullets: [
        'Golden set y dataset de referencia',
        'Pruebas de calidad y monitorización',
        'Primera versión del agente o sistema',
        'Bases técnicas del proyecto',
        'Guía explícita de lo que falta para producción',
      ],
    },
    {
      id: 'production-delivery',
      tag: 'Delivery',
      title: 'Production Delivery',
      description: 'Lo mismo que Agent MVP, pero llevado hasta el final: sistema listo para producción e integrado en tu producto, sobre las mismas bases de pruebas, monitorización y criterios de entrega.',
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
    title: 'Four ways to work',
    intro: 'Each mode fits a different project stage. This is the short version; the services page has the full detail.',
    cards: [
      {
        serviceId: 'gap-analysis',
        tag: 'Entry',
        title: 'AI Gap Analysis',
        description: 'Diagnosis to decide whether it is worth building and leave with a clear roadmap to deliver it.',
        bullets: [
          'Technical clarity',
          'Project roadmap',
        ],
      },
      {
        serviceId: 'foundations',
        tag: 'Foundation',
        title: 'AI Project Foundations',
        description: 'Technical foundation for consultancies to scope, sell, and start AI projects with better criteria.',
        bullets: [
          'Reusable criteria',
          'Pre-sales support',
        ],
      },
      {
        serviceId: 'agent-mvp',
        tag: 'MVP',
        title: 'Agent MVP',
        description: 'First working version of an agent or AI system, with a clear way to validate quality.',
        bullets: [
          'Functional MVP',
          'Validation criteria',
        ],
      },
      {
        serviceId: 'production-delivery',
        tag: 'Delivery',
        title: 'Production Delivery',
        description: 'Full implementation through production, integrated with your product and ready to operate.',
        bullets: [
          'Product integration',
          'Operable delivery',
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
        'Recommended technology choices',
        'Data and datasets you will need',
        'Predictable risks and how to avoid them',
        'Step-by-step guide for the next steps',
      ],
    },
    {
      id: 'foundations',
      tag: 'Foundation',
      title: 'AI Project Foundations',
      description: 'For software consultancies that deliver custom projects. We leave a reusable technical base, planning guides, and delivery criteria for AI projects.',
      fitTitle: 'Best for',
      fit: 'Consultancies that want to raise the technical bar on AI work without relying on individual judgment call by call.',
      bullets: [
        'Standard technical base',
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
      description: 'For concrete projects where we get you started with the right foundations and your team takes it over the finish line. We set up the first agent version, quality checks, monitoring, and an explicit guide to what is left for production.',
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
