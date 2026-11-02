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

const audiences: Record<Lang, Record<AudienceId, AudienceCopy>> = {
  "es": {
    "business": {
      "id": "business",
      "path": "/ia-para-empresas",
      "seoTitle": "Soluciones de IA para empresas | TenBeltz",
      "seoDescription": "Implementa IA en documentos, administración, atención y conocimiento interno. Soluciones conectadas con tus procesos y herramientas.",
      "eyebrow": "Soluciones / IA para empresas",
      "title": "La IA empieza por el trabajo que quieres mejorar.",
      "intro": "Cada empresa trabaja de una forma distinta. Revisamos tus tareas, datos y herramientas para elegir un proceso, construir una solución útil y acompañar su puesta en uso.",
      "primaryCta": "Hablemos de tu empresa",
      "secondaryCta": "Explorar soluciones",
      "problemTitle": "Un punto de partida que el equipo reconoce.",
      "problems": [
        {
          "title": "Documentos que se acumulan",
          "text": "Hay que leer, clasificar y trasladar información antes de poder utilizarla."
        },
        {
          "title": "Tareas repartidas entre herramientas",
          "text": "Correo, documentos y gestión obligan a repetir pasos y comprobar lo mismo."
        },
        {
          "title": "Una oportunidad por concretar",
          "text": "Quieres aplicar IA y necesitas elegir dónde empezar y qué implicaría."
        }
      ],
      "applicationsTitle": "Cuatro formas de aplicar IA a tu trabajo.",
      "applications": [],
      "offerTitle": "Del primer análisis al uso diario.",
      "offerIntro": "Acordamos un punto de entrada según lo que necesita tu empresa. Si el proceso ya está definido, revisamos directamente cómo implementarlo.",
      "offers": [
        {
          "title": "Diagnóstico",
          "text": "Oportunidades priorizadas, requisitos y un primer alcance que podamos comprobar.",
          "serviceId": "gap-analysis"
        },
        {
          "title": "Implementación",
          "text": "Solución conectada, pruebas con ejemplos de vuestro trabajo y una entrega documentada.",
          "serviceId": "implementation"
        },
        {
          "title": "Adopción",
          "text": "Formación y seguimiento acordado para incorporar la solución a la rutina del equipo.",
          "serviceId": "adoption"
        }
      ],
      "proofTitle": "Experiencia explicada a través de procesos.",
      "proofIntro": "Cada proyecto identifica la situación, la intervención y nuestra relación: cliente, colaboración o producto cofundado.",
      "proofIds": [
        "clasificacion-documental",
        "gestion-despachos",
        "qamarero",
        "biiak"
      ],
      "faqTitle": "Antes de empezar.",
      "faqs": [
        {
          "question": "¿Trabajáis con empresas de cualquier sector?",
          "answer": "Sí. El punto de partida es el trabajo que quieres mejorar, las herramientas y la información disponible. Revisamos el encaje y los requisitos de cada proceso."
        },
        {
          "question": "¿Necesito saber qué solución quiero?",
          "answer": "Puedes traer un proceso definido o pedir orientación. El diagnóstico ayuda a elegir una oportunidad y a concretar qué haría falta para abordarla."
        },
        {
          "question": "¿Cómo decidimos si merece la pena?",
          "answer": "Revisamos frecuencia, esfuerzo actual, datos, integración y riesgos. Acordamos cómo comprobar el resultado antes de implementar."
        },
        {
          "question": "¿La formación se puede contratar por separado?",
          "answer": "Sí. Preparamos el programa según los perfiles, las tareas y los conocimientos del equipo. La formación también puede acompañar una implementación."
        }
      ],
      "contactTitle": "Cuéntanos cómo trabajáis.",
      "contactText": "Un proceso concreto o una necesidad de orientación. Revisaremos contigo el contexto y el siguiente paso.",
      "otherAudienceLabel": "",
      "otherAudienceCta": ""
    },
    "software": {
      "id": "software",
      "path": "/ia-para-software",
      "seoTitle": "Integración de IA en herramientas y software | TenBeltz",
      "seoDescription": "Conecta IA con las herramientas que utiliza tu empresa. Integración, datos, evaluación y entrega según el proceso.",
      "eyebrow": "Integración / herramientas y software",
      "title": "Conecta la IA con las herramientas de tu empresa.",
      "intro": "La información y las tareas ya viven en tus sistemas. Revisamos cómo integrar una solución de IA con esos datos, permisos y reglas, coordinándonos con tu equipo técnico o proveedor.",
      "primaryCta": "Hablemos de tu empresa",
      "secondaryCta": "Explorar soluciones",
      "problemTitle": "La integración forma parte del proceso.",
      "problems": [
        {
          "title": "Una herramienta que ya utilizáis",
          "text": "Estudiamos sus posibilidades de acceso y conexión antes de definir la solución."
        },
        {
          "title": "Datos y permisos por coordinar",
          "text": "Acordamos qué información necesita la tarea y qué acciones se pueden autorizar."
        },
        {
          "title": "Una solución que debe mantenerse",
          "text": "Definimos pruebas, documentación, responsabilidades y acompañamiento después de la entrega."
        }
      ],
      "applicationsTitle": "Cuatro formas de aplicar IA a tu trabajo.",
      "applications": [],
      "offerTitle": "Del primer análisis al uso diario.",
      "offerIntro": "Acordamos un punto de entrada según lo que necesita tu empresa. Si el proceso ya está definido, revisamos directamente cómo implementarlo.",
      "offers": [
        {
          "title": "Diagnóstico",
          "text": "Oportunidades priorizadas, requisitos y un primer alcance que podamos comprobar.",
          "serviceId": "gap-analysis"
        },
        {
          "title": "Implementación",
          "text": "Solución conectada, pruebas con ejemplos de vuestro trabajo y una entrega documentada.",
          "serviceId": "implementation"
        },
        {
          "title": "Adopción",
          "text": "Formación y seguimiento acordado para incorporar la solución a la rutina del equipo.",
          "serviceId": "adoption"
        }
      ],
      "proofTitle": "Experiencia explicada a través de procesos.",
      "proofIntro": "Cada proyecto identifica la situación, la intervención y nuestra relación: cliente, colaboración o producto cofundado.",
      "proofIds": [
        "clasificacion-documental",
        "gestion-despachos",
        "qamarero",
        "biiak"
      ],
      "faqTitle": "Antes de empezar.",
      "faqs": [
        {
          "question": "¿Trabajáis con empresas de cualquier sector?",
          "answer": "Sí. El punto de partida es el trabajo que quieres mejorar, las herramientas y la información disponible. Revisamos el encaje y los requisitos de cada proceso."
        },
        {
          "question": "¿Necesito saber qué solución quiero?",
          "answer": "Puedes traer un proceso definido o pedir orientación. El diagnóstico ayuda a elegir una oportunidad y a concretar qué haría falta para abordarla."
        },
        {
          "question": "¿Cómo decidimos si merece la pena?",
          "answer": "Revisamos frecuencia, esfuerzo actual, datos, integración y riesgos. Acordamos cómo comprobar el resultado antes de implementar."
        },
        {
          "question": "¿La formación se puede contratar por separado?",
          "answer": "Sí. Preparamos el programa según los perfiles, las tareas y los conocimientos del equipo. La formación también puede acompañar una implementación."
        }
      ],
      "contactTitle": "Cuéntanos cómo trabajáis.",
      "contactText": "Un proceso concreto o una necesidad de orientación. Revisaremos contigo el contexto y el siguiente paso.",
      "otherAudienceLabel": "",
      "otherAudienceCta": ""
    }
  },
  "en": {
    "business": {
      "id": "business",
      "path": "/en/ai-for-business",
      "seoTitle": "AI solutions for businesses | TenBeltz",
      "seoDescription": "Implement AI in documents, administration, customer service and internal knowledge. Solutions connected to your processes and tools.",
      "eyebrow": "Solutions / AI for businesses",
      "title": "AI starts with the work you want to improve.",
      "intro": "Every business works differently. We review your tasks, data and tools to select a process, build a useful solution and support daily adoption.",
      "primaryCta": "Discuss your business",
      "secondaryCta": "Explore solutions",
      "problemTitle": "A starting point your team recognises.",
      "problems": [
        {
          "title": "Documents that build up",
          "text": "Information needs reading, sorting and transferring before it can be used."
        },
        {
          "title": "Tasks spread across tools",
          "text": "Email, documents and management software trigger repeated steps and checks."
        },
        {
          "title": "An opportunity to define",
          "text": "You want to introduce AI and need to choose where to start and what it involves."
        }
      ],
      "applicationsTitle": "Four ways to apply AI to your work.",
      "applications": [],
      "offerTitle": "From the first review to daily use.",
      "offerIntro": "Agree a starting point that fits your business. If the process is already defined, we can review its implementation directly.",
      "offers": [
        {
          "title": "Diagnosis",
          "text": "Prioritised opportunities, requirements and a first scope we can assess.",
          "serviceId": "gap-analysis"
        },
        {
          "title": "Implementation",
          "text": "A connected solution, tests using examples from your work and documented handover.",
          "serviceId": "implementation"
        },
        {
          "title": "Adoption",
          "text": "Training and agreed follow-up to make the solution part of the team’s routine.",
          "serviceId": "adoption"
        }
      ],
      "proofTitle": "Experience explained through processes.",
      "proofIntro": "Each project explains the situation, the work and our relationship: client, collaboration or co-founded product.",
      "proofIds": [
        "clasificacion-documental",
        "gestion-despachos",
        "qamarero",
        "biiak"
      ],
      "faqTitle": "Before you start.",
      "faqs": [
        {
          "question": "Do you work with businesses across sectors?",
          "answer": "Yes. We start with the work you want to improve, your tools and available information. Each process has its own fit and requirements review."
        },
        {
          "question": "Do I need to know which solution I want?",
          "answer": "You can bring a defined process or ask for guidance. Diagnosis helps select an opportunity and clarify what would be needed to address it."
        },
        {
          "question": "How do we decide whether it is worthwhile?",
          "answer": "We review frequency, current effort, data, integration and risks. Before implementation, we agree how to assess the result."
        },
        {
          "question": "Can we book training separately?",
          "answer": "Yes. The programme is adapted to the team’s roles, tasks and experience. Training can also accompany an implementation."
        }
      ],
      "contactTitle": "Tell us how your team works.",
      "contactText": "A specific process or a need for guidance. We will review the context and next step with you.",
      "otherAudienceLabel": "",
      "otherAudienceCta": ""
    },
    "software": {
      "id": "software",
      "path": "/en/ai-for-software",
      "seoTitle": "AI integration with business tools and software | TenBeltz",
      "seoDescription": "Connect AI to your business tools. Integration, data, evaluation and delivery based on the process.",
      "eyebrow": "Integration / tools and software",
      "title": "Connect AI with your business tools.",
      "intro": "Your information and tasks already live in business systems. We review how AI can connect to those data, permissions and rules, coordinating with your technical team or provider.",
      "primaryCta": "Discuss your business",
      "secondaryCta": "Explore solutions",
      "problemTitle": "Integration is part of the process.",
      "problems": [
        {
          "title": "A tool you already use",
          "text": "Assess its access and integration options before defining the solution."
        },
        {
          "title": "Data and permissions to coordinate",
          "text": "Agree which information the task needs and which actions may be authorised."
        },
        {
          "title": "A solution that needs maintenance",
          "text": "Define tests, documentation, responsibilities and support after delivery."
        }
      ],
      "applicationsTitle": "Four ways to apply AI to your work.",
      "applications": [],
      "offerTitle": "From the first review to daily use.",
      "offerIntro": "Agree a starting point that fits your business. If the process is already defined, we can review its implementation directly.",
      "offers": [
        {
          "title": "Diagnosis",
          "text": "Prioritised opportunities, requirements and a first scope we can assess.",
          "serviceId": "gap-analysis"
        },
        {
          "title": "Implementation",
          "text": "A connected solution, tests using examples from your work and documented handover.",
          "serviceId": "implementation"
        },
        {
          "title": "Adoption",
          "text": "Training and agreed follow-up to make the solution part of the team’s routine.",
          "serviceId": "adoption"
        }
      ],
      "proofTitle": "Experience explained through processes.",
      "proofIntro": "Each project explains the situation, the work and our relationship: client, collaboration or co-founded product.",
      "proofIds": [
        "clasificacion-documental",
        "gestion-despachos",
        "qamarero",
        "biiak"
      ],
      "faqTitle": "Before you start.",
      "faqs": [
        {
          "question": "Do you work with businesses across sectors?",
          "answer": "Yes. We start with the work you want to improve, your tools and available information. Each process has its own fit and requirements review."
        },
        {
          "question": "Do I need to know which solution I want?",
          "answer": "You can bring a defined process or ask for guidance. Diagnosis helps select an opportunity and clarify what would be needed to address it."
        },
        {
          "question": "How do we decide whether it is worthwhile?",
          "answer": "We review frequency, current effort, data, integration and risks. Before implementation, we agree how to assess the result."
        },
        {
          "question": "Can we book training separately?",
          "answer": "Yes. The programme is adapted to the team’s roles, tasks and experience. Training can also accompany an implementation."
        }
      ],
      "contactTitle": "Tell us how your team works.",
      "contactText": "A specific process or a need for guidance. We will review the context and next step with you.",
      "otherAudienceLabel": "",
      "otherAudienceCta": ""
    }
  }
};
const home: Record<Lang, HomeAudienceCopy> = {
  "es": {
    "title": "Implementamos IA en el trabajo diario de tu empresa.",
    "intro": "Cada empresa trabaja de una forma distinta. Revisamos tus tareas, datos y herramientas para elegir un proceso, construir una solución útil y acompañar su puesta en uso.",
    "paths": [
      {
        "id": "business",
        "title": "Soluciones de IA",
        "text": "Cada empresa trabaja de una forma distinta. Revisamos tus tareas, datos y herramientas para elegir un proceso, construir una solución útil y acompañar su puesta en uso.",
        "cta": "Explorar soluciones",
        "path": "/ia-para-empresas"
      }
    ]
  },
  "en": {
    "title": "Implement AI in your daily work.",
    "intro": "Every business works differently. We review your tasks, data and tools to select a process, build a useful solution and support daily adoption.",
    "paths": [
      {
        "id": "business",
        "title": "AI solutions",
        "text": "Every business works differently. We review your tasks, data and tools to select a process, build a useful solution and support daily adoption.",
        "cta": "Explore solutions",
        "path": "/en/ai-for-business"
      }
    ]
  }
};
export const getAudienceCopy = (lang: Lang, id: AudienceId): AudienceCopy => audiences[lang][id];
export const getHomeAudienceCopy = (lang: Lang): HomeAudienceCopy => home[lang];
