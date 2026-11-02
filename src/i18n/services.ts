import type { Lang } from './ui';

export type ServiceId = 'gap-analysis' | 'implementation' | 'adoption' | 'training' | 'foundations' | 'agent-mvp' | 'production-delivery';
export interface ServiceProof { label: string; href: string; }
export interface Service {
  id: ServiceId; tag: string; title: string; duration: string; description: string;
  fitTitle: string; fit: string; bullets: string[]; proof?: ServiceProof;
  needs: string[];
}
export interface HomeCard { serviceId: ServiceId; tag: string; title: string; description: string; bullets: string[]; }
export interface ServicesCopy {
  intro: { tag: string; title: string; text: string };
  home: { title: string; intro: string; cards: HomeCard[] };
  services: Service[]; path: { title: string; items: string[] };
  cta: { title: string; text: string; button: string };
}

const copies: Record<Lang, ServicesCopy> = {
  "es": {
    "intro": {
      "tag": "Cómo trabajamos",
      "title": "De la primera decisión al uso diario.",
      "text": "Empezamos con un alcance acordado. Elegimos el proceso, implementamos la solución y preparamos al equipo para utilizarla."
    },
    "home": {
      "title": "Una forma de avanzar con tu equipo",
      "intro": "Diagnóstico, implementación y adopción, con formación también independiente.",
      "cards": [
        {
          "serviceId": "gap-analysis",
          "tag": "Elegir",
          "title": "Diagnóstico de oportunidades",
          "description": "Revisamos cómo trabaja tu equipo para elegir dónde puede aportar valor la IA y qué hace falta para empezar.",
          "bullets": [
            "Mapa de oportunidades y prioridades.",
            "Proceso recomendado, requisitos y riesgos."
          ]
        },
        {
          "serviceId": "implementation",
          "tag": "Construir",
          "title": "Implementación e integración",
          "description": "Desarrollamos o configuramos una solución para un proceso definido y la conectamos con los sistemas acordados.",
          "bullets": [
            "Solución conectada con las herramientas del alcance.",
            "Pruebas con ejemplos representativos y tratamiento de excepciones."
          ]
        },
        {
          "serviceId": "adoption",
          "tag": "Poner en uso",
          "title": "Adopción y continuidad",
          "description": "Preparamos al equipo para trabajar con la solución y acordamos cómo mantenerla, revisarla y hacerla evolucionar.",
          "bullets": [
            "Guía de uso y responsabilidades.",
            "Formación sobre el proceso implementado."
          ]
        },
        {
          "serviceId": "training",
          "tag": "Aprender",
          "title": "Formación aplicada al equipo",
          "description": "Sesiones y ejercicios adaptados a los perfiles, las herramientas y las tareas que necesita resolver tu equipo.",
          "bullets": [
            "Programa según necesidades y nivel.",
            "Ejercicios sobre tareas del equipo."
          ]
        }
      ]
    },
    "services": [
      {
        "id": "gap-analysis",
        "tag": "Elegir",
        "title": "Diagnóstico de oportunidades",
        "duration": "Alcance acordado",
        "description": "Revisamos cómo trabaja tu equipo para elegir dónde puede aportar valor la IA y qué hace falta para empezar.",
        "fitTitle": "Un punto de entrada si",
        "fit": "quieres incorporar IA y necesitas priorizar, o tienes una idea que todavía debe concretarse.",
        "bullets": [
          "Mapa de oportunidades y prioridades.",
          "Proceso recomendado, requisitos y riesgos.",
          "Alcance de la primera implementación y forma de evaluar el resultado."
        ],
        "needs": [
          "Contexto de las tareas y herramientas.",
          "Una persona que conozca el trabajo diario.",
          "Ejemplos iniciales sin datos innecesarios."
        ],
        "proof": {
          "label": "Ver clasificación documental",
          "href": "/casos#clasificacion-documental"
        }
      },
      {
        "id": "implementation",
        "tag": "Construir",
        "title": "Implementación e integración",
        "duration": "Alcance acordado",
        "description": "Desarrollamos o configuramos una solución para un proceso definido y la conectamos con los sistemas acordados.",
        "fitTitle": "Un punto de entrada si",
        "fit": "ya sabemos qué proceso abordar y necesitamos construir, comprobar y poner la solución en uso.",
        "bullets": [
          "Solución conectada con las herramientas del alcance.",
          "Pruebas con ejemplos representativos y tratamiento de excepciones.",
          "Documentación y entrega con criterios de aceptación."
        ],
        "needs": [
          "Alcance y resultado esperado.",
          "Accesos autorizados e integración disponible.",
          "Responsables de pruebas y revisión."
        ],
        "proof": {
          "label": "Ver reservas de Qamarero",
          "href": "/casos#qamarero"
        }
      },
      {
        "id": "adoption",
        "tag": "Poner en uso",
        "title": "Adopción y continuidad",
        "duration": "Alcance acordado",
        "description": "Preparamos al equipo para trabajar con la solución y acordamos cómo mantenerla, revisarla y hacerla evolucionar.",
        "fitTitle": "Un punto de entrada si",
        "fit": "la solución debe formar parte de la rutina del equipo o una implementación existente necesita seguimiento.",
        "bullets": [
          "Guía de uso y responsabilidades.",
          "Formación sobre el proceso implementado.",
          "Plan acordado de revisión, soporte y mantenimiento."
        ],
        "needs": [
          "Personas que van a utilizar la solución.",
          "Responsable de operación y de las excepciones.",
          "Necesidades de seguimiento después de la entrega."
        ],
        "proof": {
          "label": "Ver gestión de despachos",
          "href": "/casos#gestion-despachos"
        }
      },
      {
        "id": "training",
        "tag": "Aprender",
        "title": "Formación aplicada al equipo",
        "duration": "Alcance acordado",
        "description": "Sesiones y ejercicios adaptados a los perfiles, las herramientas y las tareas que necesita resolver tu equipo.",
        "fitTitle": "Un punto de entrada si",
        "fit": "quieres preparar al equipo para utilizar IA, con ejemplos y criterios de revisión. También se contrata por separado.",
        "bullets": [
          "Programa según necesidades y nivel.",
          "Ejercicios sobre tareas del equipo.",
          "Material de apoyo y pautas para revisar resultados."
        ],
        "needs": [
          "Objetivos de aprendizaje.",
          "Perfiles y conocimientos del equipo.",
          "Herramientas y ejemplos que se pueden utilizar."
        ],
        "proof": {
          "label": "Conocer la experiencia de Aritz",
          "href": "/aritz"
        }
      }
    ],
    "path": {
      "title": "Qué acordamos antes de empezar",
      "items": [
        "Alcance y entregables",
        "Accesos y responsabilidades",
        "Criterios de aceptación",
        "Presupuesto y costes de uso"
      ]
    },
    "cta": {
      "title": "Cuéntanos qué te gustaría mejorar.",
      "text": "Un proceso concreto o una necesidad de orientación. Acordaremos juntos el siguiente paso.",
      "button": "Hablemos de tu empresa"
    }
  },
  "en": {
    "intro": {
      "tag": "How we work",
      "title": "From the first decision to daily use.",
      "text": "Start with an agreed scope. We choose the process, implement the solution and prepare the team to use it."
    },
    "home": {
      "title": "A way forward for your team",
      "intro": "Diagnosis, implementation and adoption, with training also available separately.",
      "cards": [
        {
          "serviceId": "gap-analysis",
          "tag": "Choose",
          "title": "Opportunity diagnosis",
          "description": "Review how your team works to choose where AI could help and what is needed to get started.",
          "bullets": [
            "Prioritised opportunities.",
            "Recommended process, requirements and risks."
          ]
        },
        {
          "serviceId": "implementation",
          "tag": "Build",
          "title": "Implementation and integration",
          "description": "Develop or configure a solution for a defined process and connect it to the agreed systems.",
          "bullets": [
            "A solution connected to the tools in scope.",
            "Representative tests and exception handling."
          ]
        },
        {
          "serviceId": "adoption",
          "tag": "Put to use",
          "title": "Adoption and continuity",
          "description": "Prepare the team to work with the solution and agree how to maintain, review and develop it.",
          "bullets": [
            "Usage guidance and responsibilities.",
            "Training on the implemented process."
          ]
        },
        {
          "serviceId": "training",
          "tag": "Learn",
          "title": "Applied team training",
          "description": "Sessions and exercises adapted to the roles, tools and tasks your team needs to work on.",
          "bullets": [
            "A programme based on needs and experience.",
            "Exercises using the team’s tasks."
          ]
        }
      ]
    },
    "services": [
      {
        "id": "gap-analysis",
        "tag": "Choose",
        "title": "Opportunity diagnosis",
        "duration": "Scope agreed together",
        "description": "Review how your team works to choose where AI could help and what is needed to get started.",
        "fitTitle": "A useful starting point when",
        "fit": "you want to introduce AI and need priorities, or have an idea that still needs a defined scope.",
        "bullets": [
          "Prioritised opportunities.",
          "Recommended process, requirements and risks.",
          "First implementation scope and a way to evaluate the result."
        ],
        "needs": [
          "Context about tasks and tools.",
          "Someone who knows daily operations.",
          "Initial examples without unnecessary data."
        ],
        "proof": {
          "label": "See document classification",
          "href": "/case-studies#clasificacion-documental"
        }
      },
      {
        "id": "implementation",
        "tag": "Build",
        "title": "Implementation and integration",
        "duration": "Scope agreed together",
        "description": "Develop or configure a solution for a defined process and connect it to the agreed systems.",
        "fitTitle": "A useful starting point when",
        "fit": "the process is selected and you need to build, assess and put the solution into daily use.",
        "bullets": [
          "A solution connected to the tools in scope.",
          "Representative tests and exception handling.",
          "Documentation and handover against acceptance criteria."
        ],
        "needs": [
          "Scope and expected outcome.",
          "Authorised access and available integration.",
          "People responsible for testing and review."
        ],
        "proof": {
          "label": "See Qamarero bookings",
          "href": "/case-studies#qamarero"
        }
      },
      {
        "id": "adoption",
        "tag": "Put to use",
        "title": "Adoption and continuity",
        "duration": "Scope agreed together",
        "description": "Prepare the team to work with the solution and agree how to maintain, review and develop it.",
        "fitTitle": "A useful starting point when",
        "fit": "the solution needs to become part of the team’s routine, or an existing implementation needs ongoing attention.",
        "bullets": [
          "Usage guidance and responsibilities.",
          "Training on the implemented process.",
          "An agreed review, support and maintenance plan."
        ],
        "needs": [
          "The people who will use the solution.",
          "Owners for operation and exceptions.",
          "Support needs after handover."
        ],
        "proof": {
          "label": "See law firm workflows",
          "href": "/case-studies#gestion-despachos"
        }
      },
      {
        "id": "training",
        "tag": "Learn",
        "title": "Applied team training",
        "duration": "Scope agreed together",
        "description": "Sessions and exercises adapted to the roles, tools and tasks your team needs to work on.",
        "fitTitle": "A useful starting point when",
        "fit": "you want to prepare your team to use AI with relevant examples and review criteria. Available as a separate engagement.",
        "bullets": [
          "A programme based on needs and experience.",
          "Exercises using the team’s tasks.",
          "Reference material and guidance for reviewing results."
        ],
        "needs": [
          "Learning objectives.",
          "Team roles and current knowledge.",
          "Tools and examples available for practice."
        ],
        "proof": {
          "label": "Explore Aritz’s experience",
          "href": "/aritz"
        }
      }
    ],
    "path": {
      "title": "What we agree before starting",
      "items": [
        "Scope and deliverables",
        "Access and responsibilities",
        "Acceptance criteria",
        "Budget and operating costs"
      ]
    },
    "cta": {
      "title": "Tell us what you would like to improve.",
      "text": "A specific process or a need for guidance. We will agree the next step together.",
      "button": "Discuss your business"
    }
  }
};

export const getServicesCopy = (lang: Lang): ServicesCopy => copies[lang];
