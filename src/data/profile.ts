import type { Lang } from '@/i18n/ui';
export const getProfile = (lang: Lang) => {
  const en = lang === 'en';
  return {
    experience: en ? [
      { company: 'Irontec', period: 'Since June 2025', role: 'Software engineering & applied AI', text: 'Software development and technical contributions to AI projects. Architecture, model selection and integration for Konect call analysis, including a local AI adaptation for RETA on NVIDIA DGX Spark.' },
      { company: 'Biiak', period: 'Since July 2025', role: 'Co-founder & CTO', text: 'Architecture and development of a child protection platform. Backend, private infrastructure, local AI and access controls. Led and implemented ENS Medium compliance.' },
      { company: 'TenBeltz', period: 'Since August 2024', role: 'Co-founder & technical lead', text: 'Consulting, technical definition and delivery criteria for SaaS teams and software consultancies. Voice agents, document processing, report generation and product integration, coordinating the team’s development work.' },
      { company: 'Hardis Group', period: 'June 2024 — June 2025', role: 'R&D · Dual vocational training', text: 'Interfaces and software components for SISLOG warehouse management. Spring and TypeScript development, Python REST integration with AI services and a Java connectivity library.' },
      { company: 'Independent development', period: 'February 2023 — August 2024', role: 'Software development & automation', text: 'Python and Django applications, process automation, web scraping and bots for international clients.' },
    ] : [
      { company: 'Irontec', period: 'Desde junio de 2025', role: 'Ingeniería de software e IA aplicada', text: 'Desarrollo de software y aportación técnica a proyectos de IA. Arquitectura, selección de modelos e integración para el análisis de llamadas de Konect, incluida una adaptación a IA local para RETA sobre NVIDIA DGX Spark.' },
      { company: 'Biiak', period: 'Desde julio de 2025', role: 'Cofundador y CTO', text: 'Arquitectura y desarrollo de una plataforma para protección a la infancia. Backend, infraestructura privada, IA local y control de acceso. Dirección e implementación de la adecuación al ENS de categoría Media.' },
      { company: 'TenBeltz', period: 'Desde agosto de 2024', role: 'Cofundador y líder técnico', text: 'Consultoría, definición técnica y criterios de entrega para equipos SaaS y consultoras de software. Agentes de voz, procesamiento documental, generación de informes e integración en producto, coordinando el desarrollo del equipo.' },
      { company: 'Hardis Group', period: 'Junio de 2024 — junio de 2025', role: 'I+D · FP Dual', text: 'Interfaces y componentes de software para SISLOG, gestión de almacenes. Desarrollo con Spring y TypeScript, integración REST con servicios de IA mediante Python y una librería Java de conectividad.' },
      { company: 'Desarrollo independiente', period: 'Febrero de 2023 — agosto de 2024', role: 'Desarrollo de software y automatización', text: 'Aplicaciones con Python y Django, automatización de procesos, web scraping y bots para clientes internacionales.' },
    ],
    principles: en ? [
      ['Systems ready to operate', 'I account for integration, errors and maintenance from the design stage. Delivery includes the information your team needs to operate the system.'],
      ['Measurable quality', 'I define representative cases and acceptance criteria to assess results and detect regressions.'],
      ['Traceability', 'Logs, traces and monitoring help explain what happened and support diagnosis when something fails.'],
      ['Cost in context', 'I evaluate model choices, architecture and cost per task alongside quality and performance.'],
    ] : [
      ['Sistemas preparados para operar', 'Integro las necesidades de producto, errores y mantenimiento desde el diseño. La entrega incluye lo que tu equipo necesita para operar el sistema.'],
      ['Calidad medible', 'Defino casos representativos y criterios de aceptación para evaluar resultados y detectar regresiones.'],
      ['Trazabilidad', 'Los registros, las trazas y la monitorización permiten entender qué ha ocurrido y diagnosticar los fallos.'],
      ['Coste en contexto', 'Evalúo selección de modelos, arquitectura y coste por tarea junto a la calidad y el rendimiento.'],
    ],
    stack: [
      { title: en ? 'AI systems' : 'Sistemas de IA', text: 'RAG · LangGraph · Typesense · Qdrant · vLLM · Ollama' },
      { title: en ? 'Software & data' : 'Software y datos', text: 'Python · FastAPI · Django · TypeScript · React / Next.js · PostgreSQL' },
      { title: en ? 'Operation & evaluation' : 'Operación y evaluación', text: 'Docker · Redis / ARQ · Langfuse · LLM-as-judge · Grounding' },
    ],
  };
};
