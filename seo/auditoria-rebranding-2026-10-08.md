# Auditoría SEO del rebranding — 2026-10-08

## Dictamen

Auditoría inicial: base técnica apta para publicación, con ajustes recomendados antes del lanzamiento. El cierre posterior registra las correcciones y verificaciones; no se ha publicado en producción.

## Alcance y evidencia

Revisión de fuentes de la rama `rebranding`, documentación SEO previa, HTML del servicio local activo en 127.0.0.1:10022 y GET públicos de tenbeltz.com. No se ha enviado el formulario ni usado credenciales privadas. La preview HTTPS responde 401 sin autenticación, protección esperada que debe mantenerse.

- Las 12 páginas del nuevo sitemap responden 200, tienen un H1, título, descripción, canonical propio y `index, follow`.
- Hreflang es/en/x-default consistente entre HTML y sitemap, incluidas rutas traducidas de casos/equipo.
- Todos los destinos de enlaces internos a páginas responden 200; no se detectaron anclas internas sin destino entre esas páginas.
- URL inexistente devuelve HTTP 404. `/services/` redirige a `/services` (se comprobó destino con seguimiento de redirecciones; no se registró el código intermedio).
- Sitemap contiene las 12 páginas y excluye páginas 404. Robots permite rastreo y referencia el sitemap de producción.
- JSON-LD presente en el HTML y parseable en todas las páginas. Fuentes incluyen Organization, Person, servicios, breadcrumbs y nodos específicos de perfil/casos. Esto confirma presencia y sintaxis; no sustituye validación semántica mediante Rich Results Test ni inspección en navegador.
- Las diez rutas de la web actual se conservan. `/aritz` y `/en/aritz` son nuevas y hoy dan 404 en producción: comportamiento esperado hasta desplegar.
- Imágenes con dimensiones y atributos alt presentes, incluidos alt vacíos correctos en duplicados decorativos de logos. Fuentes locales y flor hero WebP de 196.640 bytes. La home actual del rebranding no usa el antiguo fondo React/Three de HomeHero. La flor nueva sí carga Three.js dinámicamente en escritorio; móvil conserva la imagen estática.

## Ajustes priorizados

| Prioridad / impacto | Hallazgo y evidencia | Acción |
|---|---|---|
| Alta / coherencia del contenido | `public/llms.txt` aún dice cuatro servicios, equipo de una persona, FAQ de home y métricas 95,5% / −42% de la versión anterior. El rebranding ofrece cinco modalidades, equipo y métricas documentales distintas. | Actualizar desde datos actuales verificados. No mantener cifras antiguas por inercia. Es un archivo para asistentes, no un requisito de indexación Google. |
| Media / identidad al compartir | `SEO.astro` usa `Astro.url` para `og:url`; respuesta local contiene `http://localhost:10022/`, mientras canonical es https://tenbeltz.com/. | Derivar `og:url` del canonical para evitar host interno, preview o parámetros. |
| Media / relevancia temática | H1 servicios: «De la primera decisión a producción». H1 casos: «Decisiones, sistemas y trabajo concreto». Títulos sí mencionan IA. | Introducir contexto explícito manteniendo el tono: «Servicios de ingeniería de IA, de la primera decisión a producción» y «Proyectos de ingeniería de IA: decisiones, sistemas y trabajo concreto», con equivalentes ingleses. No es un bloqueo técnico. |
| Baja / presentación en resultados | Descripciones de servicios: 176 caracteres ES y 181 EN; home 123 ES/115 EN. | Revisar claridad y posible truncado de servicios. No tratar 150–160 caracteres como requisito o longitud garantizada de Google. |
| Media / mantenimiento | `src/middleware.ts` pretende caché immutable de un año para robots/sitemaps/favicon sin hash. GET local de estáticos devuelve realmente `max-age=0`, así que esa política no se está aplicando en esa ruta de servicio. | Definir caché larga sólo para assets con hash y corta/revalidable para robots/sitemaps. Verificar cabeceras del servidor de publicación; no afirmar que actualmente se cachean un año. |

## Comprobaciones necesarias de lanzamiento

1. Medir nueva web en navegador móvil y escritorio: LCP, CLS y carga inicial; INP real requiere datos de uso. Esta auditoría no contiene Lighthouse/PageSpeed ni prueba visual móvil: no se asigna puntuación ni se certifican Core Web Vitals.
2. Verificar en el dominio público después del despliegue: HTTPS, host www/apex, redirecciones, 404, las 12 URLs, canonical/hreflang, sitemap, compresión y caché. Mantener autenticación de las previews privadas.
3. Validar datos estructurados y previews sociales. La presencia de JSON-LD no garantiza resultados enriquecidos.
4. Consultar Search Console actual y enviar/revisar sitemap actualizado; inspeccionar páginas nuevas y URLs con cambios importantes. Los 43 clics y datos de indexación de julio son históricos, no una medición actual.

No se necesita una migración de URLs para las diez páginas conservadas. Si se cambian rutas al publicar, elaborar mapa y redirecciones permanentes hacia sus equivalentes; evitar redirigir todo a la home.

## Mejoras posteriores

Páginas específicas de servicios y casos con demanda demostrada pueden ampliar captación orgánica; hoy cada modalidad/caso es una sección de una página agregada. Priorizar con consultas de Search Console. El blog fue aplazado expresamente y no es condición para publicar. Los casos reales, equipo, perfil y contacto aportan señales de experiencia y confianza.

Fuentes oficiales consultadas:

- https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
- https://developers.google.com/search/docs/crawling-indexing/site-move-no-url-changes
- https://developers.google.com/search/docs/crawling-indexing/canonicalization-troubleshooting

La auditoría inicial registró el servicio activo y las fuentes de ese momento. En esa primera revisión no se hizo un nuevo build, despliegue o commit; hay cambios previos de asistente/equipo/layout en el checkout que se conservan.

## Cierre de correcciones — 2026-10-08

Aplicados en `rebranding`:

- llms.txt describe cinco modalidades, cuatro personas, nueve proyectos y las
  métricas actuales del test documental, sin reutilizar cifras de la web anterior.
- og:url usa el canonical y no el host de la petición.
- H1 de servicios y casos describe ingeniería de IA en ambos idiomas.
- Descripciones de servicios simplificadas: 143 caracteres ES y 147 EN.
- Middleware reserva immutable para assets de build y permite revalidar
  robots/llms/sitemap/favicon. Configuración de proxy preparada en
  `docs/deploy/nginx-seo.md`; el servicio estático Node evita middleware y hoy
  devuelve max-age=0, no caché de un año, para descubrimiento.
- Estado/backlog SEO distinguen julio histórico de la revisión actual.
- Inicialización del menú móvil durante el parseo del header: evita que la
  navegación expandida de fallback se muestre antes de cargar el módulo y
  colapse después, desplazando el contenido. Sin JavaScript el menú sigue
  accesible.

Verificación del nuevo build: `npm run build` completado, 0 errores y 0 warnings
de tipos, dos hints heredados del parser SVG y aviso de chunk Three.js >500 kB.
Comparación automatizada de las 12 páginas con sitemap: HTTP 200, canonical y
og:url propios, hreflang coincidente, un H1, enlaces y anclas internas correctos.
Ruta inexistente: HTTP 404. llms.txt servido contiene las métricas actualizadas.

El build se comprobó en un servidor temporal ligado a loopback y Docker rootless
con la imagen Playwright existente, sin instalar paquetes del sistema ni enviar
formularios. Los cambios previos del equipo y asistente presentes en el checkout
se conservaron y no se incluyen en el commit de SEO.

Quedan ligados al despliegue público: configuración del proxy de producción,
Rich Results Test, actualización/inspección en Search Console y métricas de
usuarios reales. Un push a la rama no permite certificar esos resultados.

### Rendimiento y navegación

La prueba inicial con red lenta detectó un salto móvil de navegación expandida
a recogida (CLS cercano a 0,5). Tras inicialización durante el parseo, los cuatro
escenarios móviles con red/CPU limitadas registraron CLS entre 0,024 y 0,042;
los saltos restantes proceden del launcher previo del asistente cuando aparece
el aviso de cookies. Apertura/cierre por Escape comprobados, también en 320 px.
Sin JavaScript, navegación visible y contenido/schema accesibles.

Son muestras de laboratorio de Chromium en Docker, red de 1,6 Mbps y 150 ms de
latencia, CPU x4; el servidor temporal no aplica compresión. No son valores de
usuarios reales ni una certificación de Core Web Vitals. La primera muestra
móvil de home registró LCP de 6,47 s y motivó reducir la imagen decorativa móvil
(original 196.640 bytes; derivada 600×600 WebP de aproximadamente 37 KB), quitar
su prioridad alta y diferir logos con loading=lazy. Escritorio conserva el
original y la animación. La derivada mantiene la ilustración y se genera con
Pillow, resize LANCZOS y WebP quality=80/method=6.

Verificación de optimización: variante móvil seleccionada a390 px, original a1440
px, también correcta sin JavaScript. Sin overflow ni errores JS; menú abre/cierra.
CLS medido en home EN móvil: 0,0335; escritorio: 0,0082. La muestra LCP de home
EN móvil fue 4,03 s y escritorio 1,36 s; el observador de home ES móvil no produjo
una muestra válida (0 no se interpreta como aprobado). No se certifica el umbral
LCP móvil: falta repetir con compresión/configuración del servidor público y
medición estable. INP y datos reales requieren usuarios tras el lanzamiento.
El ahorro de imagen está comprobado: 159.104 bytes (81 %).

Evidencia estructurada en `verificacion-rebranding-2026-10-08.json`. Se ha hecho
push de las correcciones a la rama; las tareas externas de lanzamiento siguen
registradas explícitamente y no se dan por hechas por modificar código.
