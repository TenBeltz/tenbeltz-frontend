export type SolutionId = 'documents' | 'administration' | 'voice' | 'private-ai' | 'evaluation';
export const businessSolutionIds: SolutionId[] = ['documents', 'administration', 'voice', 'private-ai'];
export interface SolutionCopy {
  path: string; title: string; metaTitle: string; description: string; eyebrow: string; lead: string;
  problemTitle: string; problems: { title: string; text: string }[];
  methodTitle: string; method: { title: string; text: string }[];
  proofTitle: string; proofText: string; proofScope: string; caseHref: string;
  serviceTitle: string; serviceHref: string;
  flow: string[]; examples: string[]; requirements: string[]; review: string;
}

export const solutions: Record<SolutionId, Record<'es' | 'en', SolutionCopy>> = {
  "documents": {
    "es": {
      "path": "/documentos-e-informes",
      "title": "IA para documentos e informes",
      "metaTitle": "IA para documentos e informes | TenBeltz",
      "description": "Clasificación de documentos, extracción de datos y borradores de informes conectados con el trabajo de tu empresa.",
      "eyebrow": "IA en el trabajo diario",
      "lead": "Convierte documentación dispersa en información que tu equipo pueda utilizar. Diseñamos el flujo de lectura, extracción y preparación de borradores, con las comprobaciones que necesita cada tarea.",
      "problemTitle": "Un proceso que merece revisión",
      "problems": [
        {
          "title": "Muchos documentos por revisar",
          "text": "Leer archivos, localizar datos y trasladarlos a otro sistema ocupa tiempo y obliga a repetir comprobaciones."
        },
        {
          "title": "Informes que empiezan de cero",
          "text": "La información está repartida entre documentos y el equipo vuelve a reunirla cada vez que prepara un informe."
        },
        {
          "title": "Resultados difíciles de comprobar",
          "text": "Una cifra sin origen o un borrador sin referencias aumenta el trabajo de revisión. Definimos qué debe poder comprobarse."
        }
      ],
      "methodTitle": "De la tarea actual al uso diario",
      "method": [
        {
          "title": "Elegir una familia de documentos",
          "text": "Reunimos ejemplos representativos y acordamos qué datos, categorías o secciones necesitamos obtener."
        },
        {
          "title": "Construir y contrastar",
          "text": "Preparamos el procesamiento y comparamos sus resultados con referencias revisadas por el equipo."
        },
        {
          "title": "Integrar la revisión",
          "text": "Conectamos las salidas acordadas y dejamos un recorrido para corregir excepciones antes de utilizar el resultado."
        }
      ],
      "proofTitle": "Clasificación para administración de comunidades",
      "proofText": "Se evaluaron varios enfoques y se construyó un sistema que propone las categorías más probables para cada documento.",
      "proofScope": "En el test de 1.414 documentos, la clasificación final obtuvo 72,35 % de acierto en la primera propuesta y 91,51 % entre las cinco primeras. Son resultados de ese test.",
      "caseHref": "/casos#clasificacion-documental",
      "serviceTitle": "Elegir juntos un primer alcance",
      "serviceHref": "/services#service-gap-analysis",
      "flow": [
        "Documentos de entrada",
        "Datos o borrador",
        "Revisión y uso"
      ],
      "examples": [
        "Clasificar documentación entrante.",
        "Extraer datos y validar campos.",
        "Preparar informes por secciones con sus fuentes."
      ],
      "requirements": [
        "Ejemplos que representen las variantes y excepciones.",
        "Criterio del equipo sobre qué resultado es correcto.",
        "Acceso acordado al origen y al destino de la información."
      ],
      "review": "Los borradores requieren revisión profesional. Acordamos qué comprobaciones automatizar y cuándo debe intervenir una persona."
    },
    "en": {
      "path": "/documents-and-reports",
      "title": "AI for documents and reports",
      "metaTitle": "AI for documents and reports | TenBeltz",
      "description": "Document classification, data extraction and report drafts connected to the way your business works.",
      "eyebrow": "AI in daily work",
      "lead": "Turn scattered documents into information your team can use. We design reading, extraction and drafting workflows with the checks each task needs.",
      "problemTitle": "A process worth reviewing",
      "problems": [
        {
          "title": "Many documents to review",
          "text": "Reading files, finding information and entering it into another system takes time and repeats the same checks."
        },
        {
          "title": "Reports started from scratch",
          "text": "Information sits across documents and the team collects it again each time a report is prepared."
        },
        {
          "title": "Outputs that are hard to check",
          "text": "A figure without a source or a draft without references adds review work. We define what must remain checkable."
        }
      ],
      "methodTitle": "From the current task to daily use",
      "method": [
        {
          "title": "Choose a document family",
          "text": "Collect representative examples and agree which fields, categories or sections the task needs."
        },
        {
          "title": "Build and compare",
          "text": "Develop the processing workflow and compare its results with references reviewed by your team."
        },
        {
          "title": "Integrate review",
          "text": "Connect agreed outputs and provide a way to correct exceptions before the result is used."
        }
      ],
      "proofTitle": "Classification for property management",
      "proofText": "Several approaches were evaluated and a system was built to suggest the most likely categories for each document.",
      "proofScope": "On a 1,414-document test set, the final classifier achieved 72.35% accuracy for the first suggestion and 91.51% within the first five. These figures apply to that test.",
      "caseHref": "/case-studies#clasificacion-documental",
      "serviceTitle": "Choose a first scope together",
      "serviceHref": "/services#service-gap-analysis",
      "flow": [
        "Incoming documents",
        "Data or draft",
        "Review and use"
      ],
      "examples": [
        "Classify incoming documents.",
        "Extract data and validate fields.",
        "Prepare section-by-section reports with sources."
      ],
      "requirements": [
        "Examples covering variants and exceptions.",
        "Your team’s criteria for an acceptable result.",
        "Agreed access to the information source and destination."
      ],
      "review": "Drafts require professional review. We agree which checks to automate and when a person must intervene."
    }
  },
  "administration": {
    "es": {
      "path": "/automatizacion-administrativa",
      "title": "IA para procesos administrativos",
      "metaTitle": "IA para procesos administrativos | TenBeltz",
      "description": "Conecta correo, documentos y herramientas de gestión para organizar información y preparar tareas con revisión.",
      "eyebrow": "IA en el trabajo diario",
      "lead": "Revisa el recorrido que hace la información entre tus herramientas. Conectamos los pasos acordados y utilizamos IA cuando ayuda a interpretar, clasificar o preparar el siguiente trabajo.",
      "problemTitle": "Un proceso que merece revisión",
      "problems": [
        {
          "title": "Datos copiados varias veces",
          "text": "Un mismo correo o documento obliga a completar información en distintos programas."
        },
        {
          "title": "Tareas entre varias herramientas",
          "text": "El equipo revisa correo, adjuntos, expedientes y agenda para saber qué debe hacer después."
        },
        {
          "title": "Excepciones que se pierden",
          "text": "Cuando falta un dato o algo no encaja, el flujo necesita una persona responsable y un estado visible."
        }
      ],
      "methodTitle": "De la tarea actual al uso diario",
      "method": [
        {
          "title": "Dibujar el proceso real",
          "text": "Identificamos entrada, pasos, herramientas, permisos y decisiones que necesitan una persona."
        },
        {
          "title": "Conectar una primera tarea",
          "text": "Integramos el alcance acordado, combinando reglas y automatización con IA según la necesidad."
        },
        {
          "title": "Probar y documentar",
          "text": "Revisamos casos habituales y excepciones, y acordamos cómo corregir, mantener y supervisar el flujo."
        }
      ],
      "proofTitle": "Correo, expedientes y tareas en un despacho",
      "proofText": "Se conectaron herramientas de gestión y la IA propone tareas y clasificación de adjuntos. El profesional revisa y acepta antes de ejecutar.",
      "proofScope": "Proyecto de cliente confidencial en el sector jurídico. El caso describe las integraciones realizadas; cada nuevo proyecto requiere revisar sus herramientas y accesos.",
      "caseHref": "/casos#gestion-despachos",
      "serviceTitle": "Elegir juntos un primer alcance",
      "serviceHref": "/services#service-gap-analysis",
      "flow": [
        "Correo o documento",
        "Información organizada",
        "Tarea revisada"
      ],
      "examples": [
        "Organizar adjuntos y proponer su clasificación.",
        "Preparar tareas desde comunicaciones entrantes.",
        "Reunir datos para el seguimiento de expedientes."
      ],
      "requirements": [
        "Una persona que conozca el proceso de principio a fin.",
        "Acceso autorizado a las herramientas implicadas.",
        "Reglas de aprobación y tratamiento de errores."
      ],
      "review": "Las actuaciones sensibles mantienen aprobación humana. El alcance define qué puede ejecutarse automáticamente y qué debe quedar pendiente de revisión."
    },
    "en": {
      "path": "/administrative-automation",
      "title": "AI for administrative workflows",
      "metaTitle": "AI for administrative workflows | TenBeltz",
      "description": "Connect email, documents and management tools to organise information and prepare tasks for review.",
      "eyebrow": "AI in daily work",
      "lead": "Review how information moves between your tools. We connect agreed steps and use AI where it helps interpret, classify or prepare the next task.",
      "problemTitle": "A process worth reviewing",
      "problems": [
        {
          "title": "Data entered several times",
          "text": "One email or document triggers the same information entry across different applications."
        },
        {
          "title": "Work spread across tools",
          "text": "The team checks email, attachments, case files and calendars to work out what should happen next."
        },
        {
          "title": "Exceptions left unresolved",
          "text": "Missing information and unexpected cases need a named owner and a visible status."
        }
      ],
      "methodTitle": "From the current task to daily use",
      "method": [
        {
          "title": "Map the actual process",
          "text": "Identify inputs, steps, tools, permissions and decisions that need a person."
        },
        {
          "title": "Connect a first task",
          "text": "Integrate the agreed scope using rules, automation and AI according to the task."
        },
        {
          "title": "Test and document",
          "text": "Review usual cases and exceptions, and agree how to correct, maintain and supervise the workflow."
        }
      ],
      "proofTitle": "Email, case files and tasks in a law firm",
      "proofText": "Management tools were connected so AI can suggest tasks and attachment categories. A professional reviews and approves before execution.",
      "proofScope": "A confidential legal-sector client project. The case describes the implemented integrations; every new project requires its own tools and access review.",
      "caseHref": "/case-studies#gestion-despachos",
      "serviceTitle": "Choose a first scope together",
      "serviceHref": "/services#service-gap-analysis",
      "flow": [
        "Email or document",
        "Organised information",
        "Reviewed task"
      ],
      "examples": [
        "Organise attachments and suggest categories.",
        "Prepare tasks from incoming communications.",
        "Gather data for case-file follow-up."
      ],
      "requirements": [
        "Someone who knows the process end to end.",
        "Authorised access to the relevant tools.",
        "Approval rules and a way to handle errors."
      ],
      "review": "Sensitive actions keep human approval. The scope defines what may run automatically and what must wait for review."
    }
  },
  "voice": {
    "es": {
      "path": "/agentes-voz-saas",
      "title": "IA para atención y consultas",
      "metaTitle": "IA para atención y consultas | TenBeltz",
      "description": "Asistentes de voz y consulta conectados con los datos y herramientas del negocio, con límites y derivación a personas.",
      "eyebrow": "IA en el trabajo diario",
      "lead": "Conecta una consulta con información actualizada y una tarea concreta. Diseñamos asistentes que pueden consultar disponibilidad, gestionar solicitudes o preparar una derivación con su contexto.",
      "problemTitle": "Un proceso que merece revisión",
      "problems": [
        {
          "title": "Consultas que se repiten",
          "text": "El equipo atiende preguntas habituales mientras también necesita resolver situaciones que exigen criterio."
        },
        {
          "title": "Información fuera de la conversación",
          "text": "La disponibilidad, los horarios o los datos de la solicitud están en otra herramienta."
        },
        {
          "title": "Una llamada que necesita continuidad",
          "text": "Una reserva o una incidencia debe terminar con una confirmación o una derivación comprensible para el equipo."
        }
      ],
      "methodTitle": "De la tarea actual al uso diario",
      "method": [
        {
          "title": "Delimitar la atención",
          "text": "Definimos qué consultas puede resolver, qué información necesita y cuándo debe derivar."
        },
        {
          "title": "Conectar los sistemas",
          "text": "Revisamos APIs, permisos y reglas para consultar datos y ejecutar únicamente acciones autorizadas."
        },
        {
          "title": "Ensayar conversaciones",
          "text": "Probamos peticiones habituales, datos incompletos, fallos y transferencia antes de la puesta en uso."
        }
      ],
      "proofTitle": "Reservas telefónicas a través de Qamarero",
      "proofText": "Se desarrollaron agentes de voz que consultan disponibilidad y conectan reservas con el CRM, las mesas y los horarios del software de hostelería.",
      "proofScope": "Proyecto de cliente realizado para Qamarero, proveedor del software. Esta experiencia no implica contratación directa de cada restaurante ni una cifra de conversión garantizada.",
      "caseHref": "/casos#qamarero",
      "serviceTitle": "Elegir juntos un primer alcance",
      "serviceHref": "/services#service-gap-analysis",
      "flow": [
        "Consulta o llamada",
        "Datos del negocio",
        "Respuesta o derivación"
      ],
      "examples": [
        "Responder consultas con información de la empresa.",
        "Consultar disponibilidad y conectar reservas.",
        "Reunir datos antes de pasar una solicitud al equipo."
      ],
      "requirements": [
        "Consultas habituales y criterios de respuesta.",
        "Fuente de información accesible y actualizada.",
        "Reglas de confirmación y canal de derivación."
      ],
      "review": "El asistente tiene límites y un modo de derivar. Las acciones disponibles y su confirmación se acuerdan para cada servicio."
    },
    "en": {
      "path": "/voice-agents-for-saas",
      "title": "AI for customer service and enquiries",
      "metaTitle": "AI for customer service and enquiries | TenBeltz",
      "description": "Voice and enquiry assistants connected to business tools and data, with clear limits and human handover.",
      "eyebrow": "AI in daily work",
      "lead": "Connect an enquiry with current information and a specific task. We design assistants that can check availability, handle requests or prepare a handover with useful context.",
      "problemTitle": "A process worth reviewing",
      "problems": [
        {
          "title": "Repeated enquiries",
          "text": "The team answers routine questions while also handling situations that need professional judgment."
        },
        {
          "title": "Information outside the conversation",
          "text": "Availability, opening hours and request details sit in another tool."
        },
        {
          "title": "Calls that need a next step",
          "text": "A booking or incident should end in a confirmation or a clear handover to the team."
        }
      ],
      "methodTitle": "From the current task to daily use",
      "method": [
        {
          "title": "Define the service scope",
          "text": "Agree which enquiries it can resolve, what information it needs and when it must hand over."
        },
        {
          "title": "Connect the systems",
          "text": "Review APIs, permissions and rules to read information and perform authorised actions only."
        },
        {
          "title": "Rehearse conversations",
          "text": "Test common requests, missing details, failures and handovers before daily use."
        }
      ],
      "proofTitle": "Phone bookings through Qamarero",
      "proofText": "Voice agents were developed to check availability and connect bookings with the CRM, tables and opening hours in the hospitality software.",
      "proofScope": "A client project for Qamarero, the software provider. This experience does not imply a direct engagement with every restaurant or a guaranteed conversion rate.",
      "caseHref": "/case-studies#qamarero",
      "serviceTitle": "Choose a first scope together",
      "serviceHref": "/services#service-gap-analysis",
      "flow": [
        "Enquiry or call",
        "Business information",
        "Answer or handover"
      ],
      "examples": [
        "Answer enquiries using business information.",
        "Check availability and connect bookings.",
        "Gather details before passing a request to the team."
      ],
      "requirements": [
        "Typical enquiries and response criteria.",
        "An accessible, up-to-date information source.",
        "Confirmation rules and a handover channel."
      ],
      "review": "The assistant has limits and a handover path. Available actions and their confirmation are agreed for each service."
    }
  },
  "private-ai": {
    "es": {
      "path": "/ia-privada-productos",
      "title": "IA para consultar conocimiento interno",
      "metaTitle": "IA para consultar conocimiento interno | TenBeltz",
      "description": "Consulta documentación e información interna con fuentes comprobables, permisos y opciones de despliegue según tus requisitos.",
      "eyebrow": "IA en el trabajo diario",
      "lead": "Ayuda al equipo a encontrar la información que necesita entre documentos y sistemas. Diseñamos consultas con fuentes visibles y acceso acorde con el trabajo de cada persona.",
      "problemTitle": "Un proceso que merece revisión",
      "problems": [
        {
          "title": "Buscar en muchos sitios",
          "text": "La respuesta puede estar en un documento, un expediente o una nota que cuesta localizar."
        },
        {
          "title": "Respuestas que necesitan respaldo",
          "text": "El equipo debe poder comprobar de dónde procede la información y reconocer lo que falta."
        },
        {
          "title": "Accesos diferentes",
          "text": "Cada persona necesita consultar las fuentes para las que tiene permiso, también cuando interviene un asistente."
        }
      ],
      "methodTitle": "De la tarea actual al uso diario",
      "method": [
        {
          "title": "Seleccionar fuentes",
          "text": "Revisamos documentos, calidad, actualización y permisos de consulta."
        },
        {
          "title": "Preparar la búsqueda",
          "text": "Conectamos las fuentes acordadas y comprobamos recuperación, referencias y respuestas con casos reales."
        },
        {
          "title": "Acordar uso y operación",
          "text": "Definimos acceso, límites, revisión y mantenimiento; evaluamos servicios externos o modelos locales según los requisitos."
        }
      ],
      "proofTitle": "Biiak y la consulta de expedientes con fuentes",
      "proofText": "La plataforma reúne expedientes, documentos y notas. Su asistente utiliza IA local, respeta permisos y muestra fuentes para la revisión del equipo profesional.",
      "proofScope": "Biiak es un producto cofundado por Aritz. La experiencia descrita pertenece a ese producto y no garantiza la misma solución para cualquier sistema documental.",
      "caseHref": "/casos#biiak",
      "serviceTitle": "Elegir juntos un primer alcance",
      "serviceHref": "/services#service-gap-analysis",
      "flow": [
        "Fuentes autorizadas",
        "Consulta con contexto",
        "Respuesta con referencias"
      ],
      "examples": [
        "Localizar documentación y consultar su contenido.",
        "Encontrar antecedentes en expedientes autorizados.",
        "Preparar borradores a partir de fuentes seleccionadas."
      ],
      "requirements": [
        "Fuentes documentales seleccionadas y responsables de actualización.",
        "Mapa de permisos y usuarios.",
        "Ejemplos de consultas y respuestas que el equipo pueda revisar."
      ],
      "review": "Se diseña qué hacer cuando las fuentes no permiten responder. El profesional conserva la revisión de respuestas e informes."
    },
    "en": {
      "path": "/private-ai-products",
      "title": "AI for internal knowledge",
      "metaTitle": "AI for internal knowledge | TenBeltz",
      "description": "Query internal documents and information with checkable sources, permissions and deployment options suited to your requirements.",
      "eyebrow": "AI in daily work",
      "lead": "Help the team find information across documents and systems. We design queries with visible sources and access matched to each person’s work.",
      "problemTitle": "A process worth reviewing",
      "problems": [
        {
          "title": "Searching in many places",
          "text": "The answer may be in a document, case file or note that is difficult to find."
        },
        {
          "title": "Answers that need support",
          "text": "The team must be able to check where information comes from and recognise what is missing."
        },
        {
          "title": "Different access rights",
          "text": "Each person should only query sources they are permitted to access, including through an assistant."
        }
      ],
      "methodTitle": "From the current task to daily use",
      "method": [
        {
          "title": "Select the sources",
          "text": "Review documents, quality, freshness and access permissions."
        },
        {
          "title": "Prepare retrieval",
          "text": "Connect agreed sources and assess retrieval, references and answers on real examples."
        },
        {
          "title": "Agree use and operation",
          "text": "Define access, limits, review and maintenance; assess external services or local models according to requirements."
        }
      ],
      "proofTitle": "Biiak and source-backed case-file queries",
      "proofText": "The platform brings together case files, documents and notes. Its assistant uses local AI, respects permissions and shows sources for professional review.",
      "proofScope": "Biiak is a product co-founded by Aritz. The experience described belongs to that product and does not guarantee the same approach for every document system.",
      "caseHref": "/case-studies#biiak",
      "serviceTitle": "Choose a first scope together",
      "serviceHref": "/services#service-gap-analysis",
      "flow": [
        "Authorised sources",
        "Query with context",
        "Referenced answer"
      ],
      "examples": [
        "Find documents and query their contents.",
        "Locate information in authorised case files.",
        "Prepare drafts from selected sources."
      ],
      "requirements": [
        "Selected document sources and an owner for updates.",
        "An access and user map.",
        "Example queries and answers your team can review."
      ],
      "review": "We define what happens when sources cannot support an answer. Professionals retain review of answers and reports."
    }
  },
  "evaluation": {
    "es": {
      "path": "/evaluacion-ia-saas",
      "title": "Evaluación de sistemas de IA",
      "metaTitle": "Evaluación de sistemas de IA | TenBeltz",
      "description": "Comprueba respuestas, clasificación, coste y tiempos de un sistema de IA con ejemplos representativos del trabajo.",
      "eyebrow": "IA en el trabajo diario",
      "lead": "Cuando ya utilizas una solución con IA, necesitas comprobar qué hace bien, dónde falla y qué cambia al actualizarla. Construimos una referencia que permita tomar esas decisiones.",
      "problemTitle": "Un proceso que merece revisión",
      "problems": [
        {
          "title": "Resultados juzgados caso a caso",
          "text": "Necesitas criterios compartidos para distinguir un resultado aceptable de un error."
        },
        {
          "title": "Cambios difíciles de comparar",
          "text": "Una nueva configuración puede mejorar algunos ejemplos y empeorar otros."
        },
        {
          "title": "Costes fuera de contexto",
          "text": "El volumen y el tipo de tarea condicionan el coste y los tiempos de respuesta."
        }
      ],
      "methodTitle": "De la tarea actual al uso diario",
      "method": [
        {
          "title": "Definir ejemplos y criterios",
          "text": "Reunimos situaciones representativas, excepciones y resultados revisados."
        },
        {
          "title": "Comparar versiones",
          "text": "Probamos modelos y configuraciones sobre los mismos ejemplos."
        },
        {
          "title": "Preparar revisiones",
          "text": "Documentamos resultados y cómo repetir la comprobación después de un cambio."
        }
      ],
      "proofTitle": "Clasificación documental comparada",
      "proofText": "El clasificador final alcanzó 72,35 % Top-1 y 91,51 % Top-5 frente a 56,44 % y 83,66 % del CSLS histórico en el mismo test.",
      "proofScope": "Evaluación de 1.414 documentos y 77 subcategorías. Estas cifras describen ese conjunto de test; no son una garantía para datos distintos.",
      "caseHref": "/casos#clasificacion-documental",
      "serviceTitle": "Elegir juntos un primer alcance",
      "serviceHref": "/services#service-gap-analysis",
      "flow": [
        "Casos representativos",
        "Comparación",
        "Decisión documentada"
      ],
      "examples": [
        "Revisar una solución que ya está en uso.",
        "Comparar una actualización antes de publicarla.",
        "Localizar errores y decidir qué corregir."
      ],
      "requirements": [
        "Acceso acordado a la solución.",
        "Casos representativos y criterio de revisión.",
        "Coste, tiempos y restricciones relevantes."
      ],
      "review": "Las pruebas orientan las decisiones dentro del alcance evaluado. Se documentan casos que necesitan revisión profesional."
    },
    "en": {
      "path": "/ai-evaluation-for-saas",
      "title": "AI system evaluation",
      "metaTitle": "AI system evaluation | TenBeltz",
      "description": "Assess answers, classification, cost and response times using representative examples from your work.",
      "eyebrow": "AI in daily work",
      "lead": "When you already use AI, you need to know what it handles well, where it fails and what changes after an update. We build a reference for those decisions.",
      "problemTitle": "A process worth reviewing",
      "problems": [
        {
          "title": "Results judged one at a time",
          "text": "Shared criteria help distinguish an acceptable result from an error."
        },
        {
          "title": "Changes that are hard to compare",
          "text": "A new configuration can improve some examples and make others worse."
        },
        {
          "title": "Costs without context",
          "text": "Volume and task type influence cost and response times."
        }
      ],
      "methodTitle": "From the current task to daily use",
      "method": [
        {
          "title": "Define examples and criteria",
          "text": "Gather representative situations, exceptions and reviewed outcomes."
        },
        {
          "title": "Compare versions",
          "text": "Test models and configurations on the same examples."
        },
        {
          "title": "Prepare ongoing reviews",
          "text": "Document results and how to repeat checks after a change."
        }
      ],
      "proofTitle": "Document classification compared",
      "proofText": "The final classifier reached 72.35% Top-1 and 91.51% Top-5, against 56.44% and 83.66% for historical CSLS on the same test.",
      "proofScope": "Evaluation on 1,414 documents across 77 subcategories. These figures describe that test set; they do not guarantee performance on different data.",
      "caseHref": "/case-studies#clasificacion-documental",
      "serviceTitle": "Choose a first scope together",
      "serviceHref": "/services#service-gap-analysis",
      "flow": [
        "Representative cases",
        "Comparison",
        "Documented decision"
      ],
      "examples": [
        "Review a solution already in use.",
        "Compare an update before release.",
        "Locate errors and decide what to address."
      ],
      "requirements": [
        "Agreed access to the solution.",
        "Representative cases and review criteria.",
        "Relevant cost, timing and operational constraints."
      ],
      "review": "Tests guide decisions within the evaluated scope. Cases requiring professional review are documented."
    }
  }
};
