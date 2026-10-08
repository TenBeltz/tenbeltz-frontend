# Landing: equipo y proyectos — 2026-10-08

## Resultado

- Zetesis incorporado al carrusel con su logo oficial y enlace a https://zetesis.xyz/. Marca naranja original, tratamiento gris compartido y color en hover. Duplicado excluido de teclado; seis logos en grid desktop de movimiento reducido.
- Home con tres casos, en el orden pedido: clasificación documental, Qamarero (agente telefónico de reservas), Irontec (análisis de llamadas). Clasificación lleva diagrama comparativo propio ES/EN, identificado como comparativa; otros casos conservan imágenes ilustrativas.
- Portfolio de diez casos: Biiak, informes periciales, clasificación, Qamarero, Irontec, plataforma de despachos, resoluciones, expedientes/prescripciones, informes técnicos y RAG local. Los dos últimos identificados como desarrollo/demostrador técnico, sin claims de despliegue comercial.
- Biiak presentado como plataforma de protección a la infancia: expedientes, notas, documentos, actividades, calendario, informes, roles y seguridad, además de asistente con Typesense/Ollama, citas, presupuesto de contexto y fallbacks. Producto cofundado y adecuación al ENS Media confirmada por el usuario.
- Informes periciales: LangGraph de12 nodos, JSON validado, checks deterministas, juez LLM y Langfuse. Conservada comparativa interna de costes y revisión profesional.
- `lae-parser`: métricas híbrido corregidas en ambos idiomas:77,1% Top-1 y95,5% Top-5,158 documentos. Tabla compara embeddings65,8/93,0; LLM69,6/94,3; híbrido77,1/95,5, sin extrapolar. Los tres repos indicados por el usuario se consultaron por GitHub autenticado y resultan privados: no se publican enlaces que prometan acceso al código.
- Irontec: aportación técnica de Aritz explícita, sin identificar al cliente final; enlace a página pública Konect de Faktoria. Qamarero trata el agente de voz, separado del servidor MCP.
- CTA «Conoce al equipo» y navegación «Equipo». Rutas existentes `/quien-esta-detras` / `/en/who-is-behind` ahora presentan a Aritz, Rubén García Hernando, Ángel Jiménez y Artem Pysmak con fotos reales autorizadas y roles. No se afirma relación laboral. Dirección técnica de Aritz conservada.
- SEO: página de equipo `AboutPage` sobre Organization sustituye `ProfilePage` sobre una sola persona; meta y breadcrumb acordes. URLs/hreflang/sitemap conservados; diez URLs, sin migración de slugs.

## Fuentes y recursos

- Petición y confirmaciones del usuario: nombres, roles, autorización de retratos y orden de tres enlaces de fotos (Rubén, Artem, Ángel).
- Perfil maestro local CVMaker, secciones identificadas de Biiak, informes, Qamarero e Irontec. No se publica material interno ni cliente final.
- Lectura de rutas de UI del repo Biiak (solo código, sin datos): expedientes, documentos, notas, informes, actividades/calendario y ajustes de seguridad/roles.
- README de `aritzjl/lae-parser`, `aritzjl/kompletai-rag-langgraph`, `aritzjl/vllm-rag` mediante GitHub autenticado de solo lectura. Estado privado comprobado con `gh repo view`.
- https://zetesis.xyz/: nombre, arquitectura de software, trayectoria CERN; logo SVG original extraído del HTML público sin alterar geometría/colores. Perfil LinkedIn Rubén rgarciah distingue al homónimo de Segovia.
- https://www.linkedin.com/in/angel-jimenezz/: identidad y experiencia frontend; cofundación confirmada por el usuario.
- https://www.linkedin.com/in/artem-pysmak-a97313293/: rol AI Engineer aportado por el usuario, stack backend del perfil público.
- https://faktoria.es/konect-ia-conversacional-automatizacion-chatbot-voicebot/: referencia pública de producto, no atribución de su totalidad a Aritz.
- Fotos recibidas desde media.licdn.com, descargadas a recursos locales WebP800×800. No dependencias de enlaces firmados temporales. Sin caras generadas ni fotos de homónimos.
- `src/data/team.ts`: perfiles bilingües compartidos. `src/data/projects.ts`: casos y evidencia ES/EN. Logo/retratos y SVG comparativo en public/images.

## Verificación

`npm run build`: Astro check0 errores/0 warnings/2 hints heredados. Build correcto; aviso Vite heredado por tamaño de chunk dinámico Three.js de flor.

Playwright Chromium en Docker rootless existente, memoria1GB/2CPU, trece combinaciones de home/equipo/casos ES/EN a1440/390/320px. HTTP200, sin overflow, imágenes rotas ni erroresJS. Cuatro miembros y diez casos comprobados. Carrusel tres slides, avance por botones01→02→03, último botón deshabilitado; teclado ArrowRight en1440/390px pasa01→02. Capturas de equipo desktop/móvil y clasificación móvil revisadas. Evaluación usa movimiento reducido; la animación floral previa no se modifica. La API de contacto de producción se bloqueó en las revisiones: sin envíos.

JSON-LD parseado: AboutPage.mainEntity=Organization en ES/EN; CollectionPage diez elementos. Canonicals de rutas revisadas coinciden con sitemap de diez URLs (excepción conocida home sin barra en sitemap). `git diff --check` correcto.

Servicio preview existente tenbeltz-landing reiniciado tras build y activo. HTTP loopback10022=200; HTTPS anónimo=401. Sin cambios de DNS/puertos/auth ni producción, commit/push. Cambios previos de flor preservados.

Pendientes: aceptación visual del usuario, teléfono físico y acceso positivo Nginx (credenciales generales no disponibles). Manual remoto actualizado; Mac pendiente de sincronizar, sólo acceso VPS. Contexto global común sin cambios por ser evolución de producto sobre la misma infraestructura.

## Prueba de portadas conceptuales — 2026-10-08

Por petición del usuario, las cuatro portadas de home pasan de diagramas técnicos a escenas editoriales sin texto: voz convertida en señal clara (Konect), conversación y mesa reservada (Qamarero), documentos agrupados (clasificación) y expediente protegido (Biiak). Paleta de marca, pocos elementos y geometría compartida ES/EN. Generador: `tools/project-covers/build.py`; etiqueta «Ilustración conceptual». Sin cambios en los textos de los casos ni en el carrusel.

Verificación: npm run build correcto, Astro 0 errores/0 warnings y 2 hints heredados; aviso de chunk grande heredado. SVGs parseados y sin nodos de texto. Preview existente reiniciada; aceptación visual del usuario pendiente.

### Ajuste tras revisión del usuario

Clasificación y Biiak aprobados visualmente y conservados. Konect ahora representa llamada → gráficos de información (barras, anillo y tendencia); Qamarero bot con auricular/micrófono → mesa reservada. Una flecha discreta por escena, sin texto. SVGs ES/EN regenerados; ambas composiciones revisadas mediante capturas Chromium.

### Flechas coherentes en móvil — 2026-10-08

Sustituidos caracteres Unicode de flechas en enlaces, botones y flujos por el componente compartido `src/components/ArrowIcon.astro`. SVG decorativo con currentColor, tamaño relativo al texto y sin foco; elimina la dependencia de la presentación emoji del dispositivo. Carrusel conserva sus SVG existentes y las etiquetas accesibles de enlaces/botones. Aplicado a templates compartidos ES/EN. Verificación: build y diff check; ausencia de flechas Unicode en archivos Astro. Comprobación humana en iPhone pendiente.
