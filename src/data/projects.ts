import type { Lang } from '@/i18n/ui';
export interface Project {
  id: string; client: string; clientUrl?: string; sector: string; title: string;
  summary: string; context: string; built: string; close: string;
  publicReference?: { label: string; url: string }; cover?: string; coverNote?: string; evidence?: string; comparison?: { method: string; top1: string; top5: string }[]; comparisonCaption?: string; details?: { title: string; text: string }[];
  flow: string[]; result?: { figure: string; text: string }; kind: string;
}
const es: Project[] = [
  {
    "id": "irontec",
    "publicReference": {
      "label": "Konect · información pública del producto",
      "url": "https://faktoria.es/konect-ia-conversacional-automatizacion-chatbot-voicebot/"
    },
    "client": "Irontec",
    "clientUrl": "https://www.irontec.com/",
    "sector": "Telecomunicaciones",
    "kind": "Colaboración técnica",
    "title": "Konect: convertir llamadas en información útil",
    "summary": "Transcripción, análisis LLM y métricas de calidad, con una adaptación a IA local para RETA.",
    "context": "Konect convierte conversaciones de contact center en información para evaluar la atención, extraer datos y consultar métricas sobre las llamadas.",
    "built": "Transcripción con motores de voz como Deepgram y Whisper, extracción de datos y análisis de conversaciones con modelos de lenguaje. Búsqueda sobre las llamadas y procesamiento asíncrono, con selección de modelos según los requisitos de privacidad y rendimiento.",
    "close": "Aritz contribuye al diseño de arquitectura, la selección de modelos y la integración del procesamiento de voz y análisis LLM. Este caso de IA forma parte de una colaboración con Irontec iniciada en 2025 que también incluye desarrollo de software.",
    "flow": [
      "Audio",
      "Transcripción",
      "Análisis"
    ],
    "cover": "/images/projects/irontec.svg",
    "coverNote": "Ilustración del sistema",
    "details": [
      {
        "title": "Adaptación a IA local para RETA",
        "text": "El proyecto se adaptó para trabajar con IA local sobre una NVIDIA DGX Spark, para una carga de 500 llamadas diarias. Esta variante lleva el procesamiento a la infraestructura del cliente."
      }
    ]
  },
  {
    "id": "qamarero",
    "client": "Qamarero",
    "clientUrl": "https://qamarero.com/",
    "sector": "Hostelería · SaaS",
    "kind": "Proyecto de cliente",
    "title": "Reservas por teléfono, integradas en el producto",
    "summary": "Agentes de voz conectados al CRM, las mesas y los horarios del restaurante.",
    "context": "Qamarero quería incorporar agentes telefónicos a su SaaS de hostelería, conectados con la operativa diaria de los restaurantes.",
    "built": "Aritz implementó el sistema de agentes telefónicos y las herramientas que consultan disponibilidad y conectan las reservas con el CRM, las mesas y los horarios del SaaS. Varios meses de colaboración con el equipo de Qamarero hasta su puesta en producción.",
    "close": "Un flujo completo de atención y reserva conectado al software que utiliza el restaurante.",
    "flow": [
      "Llamada",
      "Agente",
      "Reserva"
    ],
    "cover": "/images/projects/qamarero.svg",
    "coverNote": "Ilustración del sistema"
  },
  {
    "id": "clasificacion-documental",
    "client": "Comunidades de propietarios",
    "sector": "Gestión documental",
    "kind": "Proyecto aplicado",
    "cover": "/images/projects/clasificacion-documental.svg",
    "coverNote": "Ilustración del sistema",
    "evidence": "Informe de iteraciones, resultados guardados e implementación de LAE_CATEGORIZACION (lae-parser). Son resultados de evaluación del desarrollo; el volumen operativo mensual es distinto de la muestra de test.",
    "comparison": [
      {
        "method": "CSLS histórico",
        "top1": "56,44 %",
        "top5": "83,66 %"
      },
      {
        "method": "Cabeza supervisada · 154 similitudes",
        "top1": "66,48 %",
        "top5": "89,25 %"
      },
      {
        "method": "Ensemble final · similitudes + embedding",
        "top1": "72,35 %",
        "top5": "91,51 %"
      }
    ],
    "title": "Clasificación documental: geometría y aprendizaje supervisado",
    "summary": "De una clasificación 100% LLM a señales semánticas y un ensemble supervisado ligero, para un flujo de cientos de miles de documentos al mes.",
    "context": "Un flujo de administración de comunidades con cientos de miles de documentos al mes necesitaba clasificar en 15 categorías y 77 subcategorías. A ese volumen, el coste por documento, la latencia y la calidad del ranking condicionan la arquitectura.",
    "built": "Evaluamos LLMs generativos, centroides, routing híbrido y corrección de hubness con CSLS. El análisis geométrico mostró que las similitudes con centroides comprimían información útil. La última solución evaluada combina cuatro variantes de regresión logística con bagging sobre 154 similitudes semánticas y un clasificador sobre el embedding completo de 1.024 dimensiones. Una media geométrica fusiona sus probabilidades para ordenar las 77 subcategorías. La clasificación se ejecuta en CPU, sin llamadas a un LLM generativo ni un embedding adicional por documento.",
    "result": {
      "figure": "72,35 %",
      "text": "de acierto Top-1 de subcategoría con el ensemble final en el test de 1.414 documentos. Top-5: 91,51 %; F1 macro: 69,15 %. Frente al CSLS histórico sobre ese test, el Top-1 mejora 15,91 puntos porcentuales y el Top-5, 7,85 puntos, con el mismo coste estimado de inferencia por documento."
    },
    "close": "La evolución redujo costes y mejoró la clasificación respecto al planteamiento inicial 100% LLM. El asesoramiento matemático ayudó a orientar el análisis geométrico. El ensemble elegido también superó a los rerankers generativos probados, manteniendo una clasificación local y reproducible tras la extracción documental y el embedding.",
    "flow": [
      "Embedding documental",
      "Ensemble supervisado",
      "Ranking de subcategorías"
    ],
    "comparisonCaption": "Clasificación de subcategoría, 77 etiquetas. Mismo test de 1.414 documentos. Top-1 = primera propuesta; Top-5 = entre cinco propuestas."
  },
  {
    "id": "biiak",
    "client": "Biiak",
    "clientUrl": "https://biiak.com",
    "sector": "Servicios sociales · IA privada",
    "kind": "Producto cofundado",
    "title": "Una plataforma para protección a la infancia, con IA privada",
    "summary": "Expedientes, documentación e informes en una plataforma con IA local, permisos y trazabilidad.",
    "context": "Los equipos de protección a la infancia necesitan coordinar expedientes, notas de intervención, documentos y seguimiento diario sobre información especialmente sensible. La IA debe trabajar dentro de ese contexto profesional y respetar los permisos de cada usuario.",
    "built": "Arquitectura y desarrollo de la plataforma: expedientes, notas, documentos, actividades, calendario e informes, con roles y registros de seguridad. Backend FastAPI, PostgreSQL y tareas asíncronas con ARQ/Redis. El asistente combina búsqueda híbrida en Typesense y modelos locales con Ollama, cita las notas originales y controla el presupuesto de contexto. La generación de borradores incorpora síntesis iterativa, verificación de fuentes y fallbacks.",
    "close": "Como cofundador y CTO, Aritz dirige la arquitectura y el desarrollo y lideró e implementó la adecuación al ENS de categoría Media hasta conseguirla. La revisión de respuestas e informes corresponde al equipo profesional.",
    "evidence": "Plataforma cofundada. Adecuación al ENS de categoría Media confirmada en septiembre de 2026.",
    "flow": [
      "Expedientes y documentos",
      "IA local con fuentes",
      "Revisión profesional"
    ],
    "cover": "/images/projects/biiak.svg",
    "coverNote": "Ilustración del sistema"
  },
  {
    "id": "informes-periciales",
    "client": "Informes periciales",
    "sector": "Legal · Cliente confidencial",
    "kind": "Proyecto de cliente",
    "title": "Informes periciales con evaluación por sección",
    "summary": "Extracción estructurada, borradores y comprobaciones de calidad sobre documentación clínica.",
    "context": "Preparar un informe pericial exige mantener fechas, lesiones y valoraciones consistentes. La documentación original y el criterio del profesional deben guiar cada sección.",
    "built": "Un flujo LangGraph de 12 nodos por sección, con extracción a JSON validado y lectura de la documentación completa. Combina comprobaciones deterministas de fechas y coherencia con un juez LLM que evalúa cada sección contra un informe de referencia. Las trazas de Langfuse permiten seguir el procesamiento; la selección de modelos por tarea se apoya en esa evaluación.",
    "result": {
      "figure": "−42 %",
      "text": "de coste aproximado en las fases evaluadas de extracción y redacción: de 0,93 a 0,54 dólares por informe. Comparativa interna con evaluación y revisión manual; las cifras materiales se mantuvieron en las pruebas documentadas."
    },
    "close": "La evaluación permitió ajustar el coste de los modelos conservando la calidad medida. El profesional mantiene la revisión del informe final.",
    "flow": [
      "Documentación",
      "Extracción",
      "Informe revisable"
    ]
  },
  {
    "id": "gestion-despachos",
    "client": "Gestión de despachos",
    "sector": "Legal · Cliente confidencial",
    "kind": "Proyecto de cliente",
    "title": "Expedientes y herramientas de trabajo conectados",
    "summary": "Gestión interna con propuestas de tareas y clasificación de adjuntos bajo revisión humana.",
    "context": "La información de un despacho se reparte entre expedientes, correo, documentos y agenda. El trabajo requiere conectar estas herramientas y mantener el control del profesional.",
    "built": "Plataforma de gestión con clientes, expedientes, Gmail, Drive, Calendar, tareas y generación documental. La IA propone tareas y clasificación de adjuntos; el abogado revisa y acepta antes de ejecutar.",
    "close": "Integración del flujo de trabajo y asistencia de IA con un punto explícito de aprobación humana.",
    "flow": [
      "Correo y documentos",
      "Propuesta",
      "Revisión"
    ]
  },
  {
    "id": "resoluciones",
    "client": "Resoluciones judiciales",
    "sector": "Legal · Cliente confidencial",
    "kind": "Proyecto de cliente",
    "title": "Análisis de resoluciones con salida validada",
    "summary": "Extracción de PDFs, clasificación jurídica y evaluación de precisión y consumo.",
    "context": "Analizar resoluciones judiciales exige convertir PDFs en datos consistentes y tratar los casos ambiguos de forma explícita.",
    "built": "Extracción de documentos, clasificación en categorías legales y una segunda pasada para los casos ambiguos. Salida JSON validada con esquemas de datos e informes de precisión y consumo.",
    "close": "Un sistema documentado en código que combina procesamiento documental, validación estructural y evaluación.",
    "flow": [
      "PDF",
      "Clasificación",
      "Datos validados"
    ]
  },
  {
    "id": "automatizacion-expedientes",
    "client": "Automatización de expedientes",
    "sector": "Legal · Cliente confidencial",
    "kind": "Proyecto de cliente",
    "title": "Seguimiento de expedientes y prescripciones",
    "summary": "Extracción de estados y fechas, revisión humana y justificantes auditables.",
    "context": "El seguimiento de expedientes necesita reunir información de sistemas jurídicos y comprobar los datos relevantes antes de actuar.",
    "built": "Integración con software jurídico, extracción estructurada de estado, fecha y matrícula, un panel de revisión humana, notificaciones controladas y justificantes PDF auditables.",
    "close": "Automatización con trazabilidad y revisión de los datos que intervienen en cada actuación.",
    "flow": [
      "Expediente",
      "Validación",
      "Seguimiento"
    ]
  },
  {
    "id": "informes-tecnicos",
    "client": "Informes técnicos",
    "sector": "Documentación · Modelos locales",
    "kind": "Desarrollo técnico",
    "title": "Del documento al informe, con citas revisables",
    "summary": "Recuperación de citas, curación de duplicados y redacción secuencial con modelos locales.",
    "context": "Un informe extenso necesita fuentes pertinentes en cada sección y un relato coherente entre apartados.",
    "built": "Pipeline de kompletai-rag-langgraph: recuperación de citas, curación para resolver duplicados, redacción secuencial y una pasada de corrección para detectar inconsistencias y posibles alucinaciones. Modelos locales con Ollama y configuración por tarea.",
    "close": "Un desarrollo técnico que hace explícitas las fases de recuperación, redacción y revisión; el informe requiere validación profesional.",
    "evidence": "Desarrollo técnico: kompletai-rag-langgraph.",
    "flow": [
      "Fuentes y citas",
      "Redacción por sección",
      "Corrección"
    ]
  }
];
const en: Project[] = [
  {
    "id": "irontec",
    "publicReference": {
      "label": "Konect · public product information",
      "url": "https://faktoria.es/konect-ia-conversacional-automatizacion-chatbot-voicebot/"
    },
    "client": "Irontec",
    "clientUrl": "https://www.irontec.com/",
    "sector": "Telecommunications",
    "kind": "Technical collaboration",
    "title": "Konect: turning calls into useful information",
    "summary": "Transcription, LLM analysis and quality metrics, with a local AI adaptation for RETA.",
    "context": "Konect turns contact centre conversations into information for service quality assessment, structured extraction and call metrics.",
    "built": "Transcription with speech engines such as Deepgram and Whisper, structured extraction and conversation analysis with language models. Search over calls and asynchronous processing, with model selection informed by privacy and performance requirements.",
    "close": "Aritz contributes to architecture, model selection and the integration of speech processing and LLM analysis. This AI project is part of a collaboration with Irontec since 2025 that also includes software development.",
    "flow": [
      "Audio",
      "Transcription",
      "Analysis"
    ],
    "cover": "/images/projects/irontec-en.svg",
    "coverNote": "System illustration",
    "details": [
      {
        "title": "Local AI adaptation for RETA",
        "text": "The project was adapted for local AI on an NVIDIA DGX Spark, for a workload of 500 calls per day. This variant brings processing to the customer’s own infrastructure."
      }
    ]
  },
  {
    "id": "qamarero",
    "client": "Qamarero",
    "clientUrl": "https://qamarero.com/",
    "sector": "Hospitality · SaaS",
    "kind": "Client project",
    "title": "Phone bookings integrated into the product",
    "summary": "Voice agents connected to the restaurant’s CRM, tables and opening hours.",
    "context": "Qamarero wanted to introduce phone agents into its hospitality SaaS, connected to restaurants’ daily operations.",
    "built": "Aritz implemented the phone agents and integration tools that check availability and connect bookings with the SaaS CRM, tables and opening hours. Several months of collaboration with Qamarero’s team through production delivery.",
    "close": "A complete conversation and booking flow connected to the software the restaurant uses.",
    "flow": [
      "Call",
      "Agent",
      "Booking"
    ],
    "cover": "/images/projects/qamarero-en.svg",
    "coverNote": "System illustration"
  },
  {
    "id": "clasificacion-documental",
    "client": "Property management",
    "sector": "Document management",
    "kind": "Applied project",
    "cover": "/images/projects/clasificacion-documental-en.svg",
    "coverNote": "System illustration",
    "evidence": "Final experiment report, stored results and implementation in LAE_CATEGORIZACION (lae-parser). These are development evaluation results; the monthly operational volume is separate from the test sample.",
    "comparison": [
      {
        "method": "Historical CSLS",
        "top1": "56.44%",
        "top5": "83.66%"
      },
      {
        "method": "Supervised head · 154 similarities",
        "top1": "66.48%",
        "top5": "89.25%"
      },
      {
        "method": "Final ensemble · similarities + embedding",
        "top1": "72.35%",
        "top5": "91.51%"
      }
    ],
    "title": "Document classification: geometry and supervised learning",
    "summary": "From all-LLM classification to semantic features and a lightweight supervised ensemble, for hundreds of thousands of documents per month.",
    "context": "A property management workflow with hundreds of thousands of documents per month needed classification into 15 categories and 77 subcategories. At this volume, per-document cost, latency and ranking quality guided the architecture.",
    "built": "We evaluated generative LLMs, centroid methods, hybrid routing and CSLS hubness correction. Geometric analysis showed that centroid similarities compressed useful information. The final evaluated design combines four bagged logistic-regression variants over 154 semantic similarities with a classifier over the complete 1,024-dimensional embedding. A geometric mean merges their probabilities to rank 77 subcategories. Classification runs on CPU, without generative LLM calls or an extra embedding per document.",
    "result": {
      "figure": "72.35%",
      "text": "Top-1 subcategory accuracy for the final ensemble on the 1,414-document test set. Top-5: 91.51%; macro F1: 69.15%. Compared with historical CSLS on that test set, Top-1 increased by 15.91 percentage points and Top-5 by 7.85 points, with the same estimated per-document inference cost."
    },
    "close": "The evolution reduced cost and improved classification compared with the initial all-LLM approach. Mathematical advice helped guide the geometric analysis. The selected ensemble also exceeded the tested generative rerankers, retaining local, reproducible classification after document extraction and embedding.",
    "flow": [
      "Document embedding",
      "Supervised ensemble",
      "Subcategory ranking"
    ],
    "comparisonCaption": "Subcategory classification, 77 labels. Same 1,414-document test set. Top-1 = first suggestion; Top-5 = among five suggestions."
  },
  {
    "id": "biiak",
    "client": "Biiak",
    "clientUrl": "https://biiak.com",
    "sector": "Social services · Private AI",
    "kind": "Co-founded product",
    "title": "A child protection platform with private AI",
    "summary": "Case files, documents and reports in a platform with local AI, access controls and traceability.",
    "context": "Child protection teams need to coordinate case files, intervention notes, documents and daily follow-up over highly sensitive information. AI must fit the professional workflow and respect each user’s permissions.",
    "built": "Platform architecture and development: case files, notes, documents, activities, calendars and reports, with roles and security logs. FastAPI, PostgreSQL and asynchronous ARQ/Redis jobs. The assistant combines Typesense hybrid search and local Ollama models, cites original notes and manages a limited context budget. Draft generation includes iterative synthesis, grounding checks and fallbacks.",
    "close": "As co-founder and CTO, Aritz leads architecture and development and led and implemented compliance with the Spanish ENS at Medium category. The professional team reviews answers and reports.",
    "evidence": "Co-founded platform. ENS Medium compliance confirmed in September 2026.",
    "flow": [
      "Case files and documents",
      "Local AI with sources",
      "Professional review"
    ],
    "cover": "/images/projects/biiak-en.svg",
    "coverNote": "System illustration"
  },
  {
    "id": "informes-periciales",
    "client": "Expert reports",
    "sector": "Legal · Confidential client",
    "kind": "Client project",
    "title": "Expert reports with evaluation by section",
    "summary": "Structured extraction, drafts and quality checks over clinical documentation.",
    "context": "An expert report needs consistent dates, injuries and assessments. Source documents and professional judgment must guide every section.",
    "built": "A 12-node LangGraph workflow organised by section, extracting validated JSON from complete source documents. Deterministic date and consistency checks work alongside an LLM judge evaluating each section against a reference report. Langfuse traces support diagnosis; model routing by task is guided by evaluation.",
    "result": {
      "figure": "−42%",
      "text": "approximate cost across the evaluated extraction and drafting phases: $0.93 to $0.54 per report. Internal comparison with evaluation and manual review; material figures remained unchanged in the documented tests."
    },
    "close": "Evaluation enabled model cost adjustments while preserving measured quality. The professional reviews the final report.",
    "flow": [
      "Documents",
      "Extraction",
      "Reviewable report"
    ]
  },
  {
    "id": "gestion-despachos",
    "client": "Law firm operations",
    "sector": "Legal · Confidential client",
    "kind": "Client project",
    "title": "Connecting case files and working tools",
    "summary": "Internal management with task suggestions and attachment classification under human review.",
    "context": "A law firm’s information is spread across case files, email, documents and calendars. These tools need connecting while preserving professional control.",
    "built": "A management platform covering clients, case files, Gmail, Drive, Calendar, tasks and document generation. AI suggests tasks and attachment classification; a lawyer reviews and accepts before execution.",
    "close": "Workflow integration and AI assistance with an explicit human approval step.",
    "flow": [
      "Email and documents",
      "Suggestion",
      "Review"
    ]
  },
  {
    "id": "resoluciones",
    "client": "Court decisions",
    "sector": "Legal · Confidential client",
    "kind": "Client project",
    "title": "Court decision analysis with validated output",
    "summary": "PDF extraction, legal classification and accuracy and usage evaluation.",
    "context": "Analysing court decisions means converting PDFs into consistent data and handling ambiguous cases explicitly.",
    "built": "Document extraction, classification into legal categories and a second pass for ambiguous cases. JSON output validated against data schemas, with accuracy and consumption reports.",
    "close": "A system documented in code combining document processing, structural validation and evaluation.",
    "flow": [
      "PDF",
      "Classification",
      "Validated data"
    ]
  },
  {
    "id": "automatizacion-expedientes",
    "client": "Case file automation",
    "sector": "Legal · Confidential client",
    "kind": "Client project",
    "title": "Tracking case files and limitation periods",
    "summary": "Status and date extraction, human review and auditable records.",
    "context": "Case tracking needs to gather information from legal software and check relevant data before taking action.",
    "built": "Integration with legal software, structured extraction of status, dates and registration numbers, a human review panel, controlled notifications and auditable PDF records.",
    "close": "Automation with traceability and review of the data involved in each action.",
    "flow": [
      "Case file",
      "Validation",
      "Tracking"
    ]
  },
  {
    "id": "informes-tecnicos",
    "client": "Technical reports",
    "sector": "Documentation · Local models",
    "kind": "Technical development",
    "title": "From documents to reports with reviewable citations",
    "summary": "Citation retrieval, deduplication and sequential drafting with local models.",
    "context": "A long report needs relevant sources for each section and consistency across its narrative.",
    "built": "The kompletai-rag-langgraph pipeline retrieves citations, curates duplicates, drafts sequentially and runs a correction pass to flag inconsistencies and potential hallucinations. Local Ollama models are configured by task.",
    "close": "Technical development with explicit retrieval, drafting and review stages. Reports require professional validation.",
    "evidence": "Technical development: kompletai-rag-langgraph.",
    "flow": [
      "Sources and citations",
      "Section drafting",
      "Correction"
    ]
  }
];
export const getProjects = (lang: Lang): Project[] => lang === 'en' ? en : es;
