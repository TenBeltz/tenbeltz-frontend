# Verificación y entrega

2026-10-13. Alcance: preview privada, no producción. Dirección e integración del agente principal con tres especialistas en worktrees separados: marketing/copy, diseño/frontend y SEO/arquitectura. Hubo revisión cruzada del código y revisión visual independiente por diseño.

## Resultado

Home de marca común y dos landings completas ES/EN. Se conservan las veinte URLs anteriores y se añaden cuatro, total24. Hero y símbolo originales; ofertas, evidencias, FAQs y contacto específicos. Software conserva sus cinco modalidades y páginas técnicas; empresas incorpora un explorador local de procesos. Equipo/footer/contacto y recursos sociales reflejan ambos públicos.

| Área | Comprobación real | Resultado |
|---|---|---|
| Build | npm run build: Astro check + build + compat | 0 errores, 0 warnings, 3 hints (2 parser heredados,1 script QA temporal); avisos Vite heredados y chunk grande |
| SEO/IA | tools/qa/dual-seo.py sobre preview10022 | 24 rutas200; 732 enlaces internos; H1/lang/title/description/canonical/hreflang/JSON-LD y sitemap correctos |
| Navegador | Chromium Playwright aislado,42 navegaciones (6 rutas×7 anchos) | 320,390,741,768,820,1024,1440px; sin overflow, imágenes rotas, erroresJS ni desbordamiento header |
| Accesibilidad funcional | Menú móvil, ciclo de foco, Escape, inert, FAQ con teclado | Correctos; menú/contacto conservan contexto de landing |
| Empresas | Explorador ES/EN, cálculo, invalidación al editar, prefill opcional, deduplicación y texto largo | Correctos; no envío antes de acción explícita; se conserva texto del visitante |
| Contacto | Éxito200 y error500 interceptados en navegador | Interés contextual, datos conservados ante error, reset tras éxito, feedback local al formulario |
| Sin JS | Home/empresas/software en390px | Contenido y navegación disponibles; formularios desactivados y alternativas explícitas, sin GET con datos personales |
| Diagnóstico existente | Diez respuestas, consentimiento, registro interceptado y descarga | PDF6páginas, válido (~1,5MB), sin correo real |
| Puente de contacto | tools/qa/contact-origin.mjs sobre servicio real | 13 casos de origen/cuerpo correctos; cuerpos inválidos, cero correo |
| Social | 6 imágenes por público/idioma | 1200×630, HTTP200 image/png; revisión visual y fuentes/logo reales |
| Preview | Servicio existente tenbeltz-landing activo, loopback10022 | HTTP200 y HTTPS anónimo401; autenticación privada conservada |

El navegador se ejecutó en Docker rootless con imagen ya instalada, red deshabilitada,2CPU/2GiB y sin instalar paquetes del sistema. Monta sólo build/dependencias de lectura y archivos QA. Inicia una copia aislada del build; se interceptan las solicitudes de contacto. Dos respuestas simuladas de éxito (contacto y diagnóstico) y una de fallo. Cero emails reales en toda esta revisión.

## Revisión y correcciones

La revisión independiente confirmó atribuciones e IDs de evidencia. Se corrigieron destinos de CTA y anclas de servicios, alineación de prueba documental, cuadrícula de cinco modalidades, descripción del alcance de métricas, contexto de contacto y mapa compartido de idiomas. La revisión visual encontró las composiciones de escritorio/móvil listas para preview. El aviso de formulario se mantiene en su columna y el launcher se oculta junto a su sección de destino.

Capturas de las seis páginas en1440/390px, resultado del explorador y feedback de contacto en `tmp/dual-audience-qa/`. La captura de viewport desktop confirma la flor original completa; las capturas full-page pueden omitir pintura offscreen de imágenes, por lo que no se usaron solas para juzgar la hero. Informe técnico reproducible en qa.md y resumen de resultados en qa-results.json.

## Límites y pendientes

- Aceptación visual/comercial de Aritz y su socio antes de publicar en producción.
- Login positivo del agente por Nginx no repetido; el acceso anónimo401 y el servicio loopback están comprobados.
- No medición de conversiones, posicionamiento/indexación nueva, Core Web Vitals de campo ni prueba en móvil físico. Los controles funcionales no equivalen a una auditoría exhaustiva WCAG.
- SMTP y backend existentes sin cambios; se probaron sus guardias, no se enviaron nuevos correos ni se comprobó bandeja de entrada.
- No despliegue/push de esta revisión a producción. Git local conserva cambios y revisiones; las modificaciones ajenas preexistentes se mantuvieron fuera de los commits propios.
- Manual remoto actualizado; sincronización del manual Mac pendiente, sólo se accedió al VPS.

## Revisar

- https://tenbeltz-landing.dev.tenbeltz.com
- https://tenbeltz-landing.dev.tenbeltz.com/ia-para-empresas
- https://tenbeltz-landing.dev.tenbeltz.com/ia-para-software

Las versiones inglesas se abren con el selector de idioma. Mantienen rutas y canonical propios. La fuente de contexto global no se modifica: el cambio es de producto, sin nuevos hosts, puertos, credenciales o servicios.

## Ajustes tras revisión del usuario — 2026-10-14

Se reemplazó el selector simple del explorador empresarial por cuatro opciones visuales, dos controles de cantidad con steppers y un resultado editorial que distingue tiempo declarado de ahorro. La estimación sigue local y solo se añade al mensaje a petición de la persona. Se añadieron ejemplos en lenguaje de negocio a la home, las pruebas de empresas y los nueve casos; los detalles y métricas técnicas se mantienen dentro de elementos desplegables nativos cerrados por defecto en `/casos` y `/en/case-studies`. Ningún caso jurídico anónimo se asignó a Prados-Osuna o LexFirma.

La franja incluye doce referencias: Zetesis, Irontec, EROSKI, LAE Homes, RETAbet, Qamarero, SistemaPol/TecniSoft, Prados-Osuna Abogados, LexFirma, OrderInn, Biiak e Imagina. Explicita relaciones: EROSKI, LAE Homes y RETAbet vía Irontec; Biiak como producto cofundado; Imagina como responsable de la formación del equipo técnico de Opus Dei. LexFirma aparece como wordmark tipográfico sin destino, porque la búsqueda encontró varias entidades homónimas y no una marca oficial inequívoca para ese proyecto.

QA de este ajuste: reconstrucción Astro con 0 errores/0 warnings y 3 hints existentes; la revisión SEO volvió a cubrir24rutas y732enlaces. Chromium cubrió8rutas×7anchos=56 navegaciones, sin overflow, imágenes rotas ni errores JS. Se verificaron opciones/steppers/resultados, copia empresarial, detalles técnicos abiertos/cerrados, menú/FAQ, contacto simulado exitoso y fallido, diagnóstico PDF y versión sin JS. Dos solicitudes simuladas de éxito, una de error; cero correos reales. Capturas actualizadas en `tmp/dual-audience-qa/`. Preview10022 privada, sin cambios en producción.
