import type { Lang } from '@/i18n/ui';
export interface Project {
  id: string; client: string; clientUrl?: string; sector: string; title: string;
  summary: string; context: string; built: string; close: string;
  flow: string[]; result?: { figure: string; text: string }; kind: string;
}
const es: Project[] = [
  {
    id: 'irontec', client: 'Irontec', clientUrl: 'https://www.irontec.com/', sector: 'Telecomunicaciones', kind: 'Colaboración técnica',
    title: 'Análisis de llamadas con IA',
    summary: 'Transcripción y análisis de conversaciones para una plataforma de contact center.',
    context: 'Una plataforma empresarial necesita convertir conversaciones en información útil para evaluar la atención y consultar el contenido de las llamadas.',
    built: 'Transcripción con motores de voz como Deepgram y Whisper, extracción de datos y análisis de conversaciones con modelos de lenguaje. Búsqueda sobre las llamadas y procesamiento asíncrono, con selección de modelos según los requisitos de privacidad y rendimiento.',
    close: 'Colaboración de ingeniería con Irontec iniciada en 2025. El análisis de llamadas es uno de los proyectos de IA dentro de una colaboración que también incluye desarrollo de software.',
    flow: ['Audio', 'Transcripción', 'Análisis'],
  },
  {
    id: 'qamarero', client: 'Qamarero', clientUrl: 'https://qamarero.com/', sector: 'Hostelería · SaaS', kind: 'Proyecto de cliente',
    title: 'Reservas por teléfono, integradas en el producto',
    summary: 'Agentes de voz conectados al CRM, las mesas y los horarios del restaurante.',
    context: 'Qamarero quería incorporar agentes telefónicos a su SaaS de hostelería, conectados con la operativa diaria de los restaurantes.',
    built: 'Un sistema de agentes que atiende llamadas y gestiona reservas, integrado con el CRM y la gestión de mesas y horarios del SaaS. Desarrollo de herramientas de integración y varios meses de trabajo conjunto hasta su puesta en producción.',
    close: 'Un flujo completo de atención y reserva conectado al software que utiliza el restaurante.',
    flow: ['Llamada', 'Agente', 'Reserva'],
  },
  {
    id: 'biiak', client: 'Biiak', clientUrl: 'https://biiak.com', sector: 'Servicios sociales · IA privada', kind: 'Producto cofundado',
    title: 'Un asistente privado para expedientes complejos',
    summary: 'Consulta de notas y preparación de borradores con modelos locales y fuentes trazables.',
    context: 'Los equipos de protección a la infancia trabajan con información sensible y expedientes extensos. El asistente debe encontrar información relevante dentro de un presupuesto de contexto limitado.',
    built: 'Arquitectura local con búsqueda híbrida de texto y vectores, selección de hechos relevantes y respuestas con referencias a las notas. Para los borradores, síntesis iterativa y comprobaciones de grounding. Backend, procesamiento asíncrono y controles de acceso integrados en la plataforma.',
    close: 'Aritz es cofundador y CTO de Biiak. Se presenta como experiencia de producto propia, con privacidad, trazabilidad y revisión profesional como requisitos de diseño.',
    flow: ['Notas', 'Búsqueda', 'Respuesta con fuentes'],
  },
  {
    id: 'informes-periciales', client: 'Informes periciales', sector: 'Legal · Cliente confidencial', kind: 'Proyecto de cliente',
    title: 'Informes periciales con evaluación por sección',
    summary: 'Extracción estructurada, borradores y comprobaciones de calidad sobre documentación clínica.',
    context: 'Preparar un informe pericial exige mantener fechas, lesiones y valoraciones consistentes. La documentación original y el criterio del profesional deben guiar cada sección.',
    built: 'Un flujo de extracción por secciones con esquemas de datos estrictos, lectura de documentos y reglas para detectar inconsistencias. Evaluación automática contra informes de referencia y selección de modelos por tarea, con trazabilidad del procesamiento.',
    result: { figure: '−42 %', text: 'de coste aproximado en las fases evaluadas de extracción y redacción: de 0,93 a 0,54 dólares por informe. Comparativa interna con evaluación y revisión manual; las cifras materiales se mantuvieron en las pruebas documentadas.' },
    close: 'La evaluación permitió ajustar el coste de los modelos conservando la calidad medida. El profesional mantiene la revisión del informe final.',
    flow: ['Documentación', 'Extracción', 'Informe revisable'],
  },
  {
    id: 'clasificacion-documental', client: 'Clasificación documental', sector: 'Gestión documental · Cliente confidencial', kind: 'Proyecto de cliente',
    title: 'Elegir el método antes de escalar',
    summary: 'Comparación de embeddings, modelos de lenguaje y enfoques híbridos para clasificar documentos.',
    context: 'Un flujo documental debía organizar información en 15 categorías y 77 subcategorías. Había que medir qué enfoque ofrecía el equilibrio adecuado entre calidad y coste.',
    built: 'Comparación de clasificación semántica con embeddings, clasificación con modelos de lenguaje y un enfoque híbrido. Evaluación de las alternativas sobre documentos reales para fundamentar la elección técnica.',
    result: { figure: '94,6 %', text: 'de acierto top-5 del enfoque semántico en la evaluación publicada: la categoría correcta figura entre las cinco propuestas. Top-1: 72,8 %. Son resultados de esa muestra, sin extrapolarlos a toda la documentación.' },
    close: 'Las métricas se presentan con el criterio y la muestra de evaluación, diferenciando top-1 de top-5.',
    flow: ['Documentos', 'Comparación', 'Clasificación'],
  },
  {
    id: 'gestion-despachos', client: 'Gestión de despachos', sector: 'Legal · Cliente confidencial', kind: 'Proyecto de cliente',
    title: 'Expedientes y herramientas de trabajo conectados',
    summary: 'Gestión interna con propuestas de tareas y clasificación de adjuntos bajo revisión humana.',
    context: 'La información de un despacho se reparte entre expedientes, correo, documentos y agenda. El trabajo requiere conectar estas herramientas y mantener el control del profesional.',
    built: 'Plataforma de gestión con clientes, expedientes, Gmail, Drive, Calendar, tareas y generación documental. La IA propone tareas y clasificación de adjuntos; el abogado revisa y acepta antes de ejecutar.',
    close: 'Integración del flujo de trabajo y asistencia de IA con un punto explícito de aprobación humana.',
    flow: ['Correo y documentos', 'Propuesta', 'Revisión'],
  },
  {
    id: 'resoluciones', client: 'Resoluciones judiciales', sector: 'Legal · Cliente confidencial', kind: 'Proyecto de cliente',
    title: 'Análisis de resoluciones con salida validada',
    summary: 'Extracción de PDFs, clasificación jurídica y evaluación de precisión y consumo.',
    context: 'Analizar resoluciones judiciales exige convertir PDFs en datos consistentes y tratar los casos ambiguos de forma explícita.',
    built: 'Extracción de documentos, clasificación en categorías legales y una segunda pasada para los casos ambiguos. Salida JSON validada con esquemas de datos e informes de precisión y consumo.',
    close: 'Un sistema documentado en código que combina procesamiento documental, validación estructural y evaluación.',
    flow: ['PDF', 'Clasificación', 'Datos validados'],
  },
  {
    id: 'automatizacion-expedientes', client: 'Automatización de expedientes', sector: 'Legal · Cliente confidencial', kind: 'Proyecto de cliente',
    title: 'Seguimiento de expedientes y prescripciones',
    summary: 'Extracción de estados y fechas, revisión humana y justificantes auditables.',
    context: 'El seguimiento de expedientes necesita reunir información de sistemas jurídicos y comprobar los datos relevantes antes de actuar.',
    built: 'Integración con software jurídico, extracción estructurada de estado, fecha y matrícula, un panel de revisión humana, notificaciones controladas y justificantes PDF auditables.',
    close: 'Automatización con trazabilidad y revisión de los datos que intervienen en cada actuación.',
    flow: ['Expediente', 'Validación', 'Seguimiento'],
  },
];
const en: Project[] = [
  { id:'irontec', client:'Irontec', clientUrl:'https://www.irontec.com/', sector:'Telecommunications', kind:'Technical collaboration', title:'AI-powered call analysis', summary:'Conversation transcription and analysis for a contact centre platform.', context:'An enterprise platform needs to turn conversations into useful information for service quality assessment and searching call content.', built:'Transcription with speech engines such as Deepgram and Whisper, structured extraction and conversation analysis with language models. Search over calls and asynchronous processing, with model selection informed by privacy and performance requirements.', close:'Engineering collaboration with Irontec started in 2025. Call analysis is one AI project within a collaboration that also includes software development.', flow:['Audio','Transcription','Analysis'] },
  { id:'qamarero', client:'Qamarero', clientUrl:'https://qamarero.com/', sector:'Hospitality · SaaS', kind:'Client project', title:'Phone bookings integrated into the product', summary:'Voice agents connected to the restaurant’s CRM, tables and opening hours.', context:'Qamarero wanted to introduce phone agents into its hospitality SaaS, connected to restaurants’ daily operations.', built:'Agents that answer calls and handle bookings, integrated with the SaaS CRM and table and schedule management. Integration tooling and several months of joint work through production delivery.', close:'A complete conversation and booking flow connected to the software the restaurant uses.', flow:['Call','Agent','Booking'] },
  { id:'biiak', client:'Biiak', clientUrl:'https://biiak.com', sector:'Social services · Private AI', kind:'Co-founded product', title:'A private assistant for complex case files', summary:'Querying notes and preparing drafts with local models and traceable sources.', context:'Child protection teams handle sensitive information and extensive case files. The assistant needs to find relevant information within a limited context budget.', built:'Local architecture with hybrid text and vector search, relevant fact selection and answers citing original notes. Iterative synthesis and grounding checks for drafts. Backend, asynchronous processing and access controls integrated into the platform.', close:'Aritz is Biiak’s co-founder and CTO. This is experience building his own product, with privacy, traceability and professional review as design requirements.', flow:['Notes','Search','Answer with sources'] },
  { id:'informes-periciales', client:'Expert reports', sector:'Legal · Confidential client', kind:'Client project', title:'Expert reports with evaluation by section', summary:'Structured extraction, drafts and quality checks over clinical documentation.', context:'An expert report needs consistent dates, injuries and assessments. Source documents and professional judgment must guide every section.', built:'Section-based extraction with strict data schemas, document parsing and rules to flag inconsistencies. Automated evaluation against reference reports and model routing by task, with processing traceability.', result:{figure:'−42%',text:'approximate cost across the evaluated extraction and drafting phases: $0.93 to $0.54 per report. Internal comparison with evaluation and manual review; material figures remained unchanged in the documented tests.'}, close:'Evaluation enabled model cost adjustments while preserving measured quality. The professional reviews the final report.', flow:['Documents','Extraction','Reviewable report'] },
  { id:'clasificacion-documental', client:'Document classification', sector:'Document management · Confidential client', kind:'Client project', title:'Choosing the method before scaling', summary:'Comparing embeddings, language models and hybrid approaches for document classification.', context:'A document workflow needed to organise information into 15 categories and 77 subcategories. The right balance of quality and cost had to be measured.', built:'Comparison of semantic classification with embeddings, language model classification and a hybrid approach. Evaluation over real documents to support the technical decision.', result:{figure:'94.6%',text:'top-5 accuracy for the semantic approach in the published evaluation: the correct category appears among the five suggestions. Top-1: 72.8%. These results apply to that sample and are not extrapolated to all documents.'}, close:'Metrics include the evaluation context and distinguish top-1 from top-5 accuracy.', flow:['Documents','Comparison','Classification'] },
  { id:'gestion-despachos', client:'Law firm operations', sector:'Legal · Confidential client', kind:'Client project', title:'Connecting case files and working tools', summary:'Internal management with task suggestions and attachment classification under human review.', context:'A law firm’s information is spread across case files, email, documents and calendars. These tools need connecting while preserving professional control.', built:'A management platform covering clients, case files, Gmail, Drive, Calendar, tasks and document generation. AI suggests tasks and attachment classification; a lawyer reviews and accepts before execution.', close:'Workflow integration and AI assistance with an explicit human approval step.', flow:['Email and documents','Suggestion','Review'] },
  { id:'resoluciones', client:'Court decisions', sector:'Legal · Confidential client', kind:'Client project', title:'Court decision analysis with validated output', summary:'PDF extraction, legal classification and accuracy and usage evaluation.', context:'Analysing court decisions means converting PDFs into consistent data and handling ambiguous cases explicitly.', built:'Document extraction, classification into legal categories and a second pass for ambiguous cases. JSON output validated against data schemas, with accuracy and consumption reports.', close:'A system documented in code combining document processing, structural validation and evaluation.', flow:['PDF','Classification','Validated data'] },
  { id:'automatizacion-expedientes', client:'Case file automation', sector:'Legal · Confidential client', kind:'Client project', title:'Tracking case files and limitation periods', summary:'Status and date extraction, human review and auditable records.', context:'Case tracking needs to gather information from legal software and check relevant data before taking action.', built:'Integration with legal software, structured extraction of status, dates and registration numbers, a human review panel, controlled notifications and auditable PDF records.', close:'Automation with traceability and review of the data involved in each action.', flow:['Case file','Validation','Tracking'] },
];
export const getProjects = (lang: Lang): Project[] => lang === 'en' ? en : es;
