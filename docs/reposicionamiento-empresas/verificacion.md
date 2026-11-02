# Implementación de la nueva web para empresas

Fecha: 2026-11-02.

## Alcance y autorización

Aritz solicita implementación completa mediante subagentes y despliegue en desarrollo y producción al terminar. Esta autorización sustituye el alcance documental de la primera entrega y su revisión previa a implementación/publicación.

## Implementación

- Home con propuesta común, cuatro soluciones por tarea, proyectos, oferta, equipo, FAQ y contacto abierto.
- Soluciones: documentos e informes, administración, atención y conocimiento interno. Cuatro URLs nuevas ES/EN, total 28 públicas; rutas anteriores conservadas.
- Servicios: diagnóstico, implementación, adopción/continuidad y formación independiente. Anchors históricos preservados.
- Equipo, navegación, footer, JSON-LD, metadatos, seis imágenes sociales y llms.txt coherentes con el nuevo público.
- Cuestionario de diez preguntas de negocio, respuestas locales, resumen sin nota, rutas de diagnóstico/implementación/formación y PDF de siete páginas con marca.
- Compartir requiere datos y consentimiento; generar el PDF antes del envío evita registrar leads si fallan los recursos. Repetir una descarga idéntica no duplica la solicitud.
- Contacto conserva backend, SMTP, token privado y validación de origen. Astro 7.4 necesita allowedDomains para reconocer Host: se configura una lista exacta y el endpoint verifica Host real y origen independientemente de cabeceras reenviadas.

La configuración de dominios se contrastó con el código instalado de Astro y su [referencia oficial](https://docs.astro.build/en/reference/configuration-reference/#securityalloweddomains). No se desactiva checkOrigin.

## Coordinación

Tres agentes en ramas/worktrees independientes: páginas y servicios, cuestionario y PDF, navegación y SEO. Raíz integra home/contacto/rutas, revisa, prueba y despliega. Worktrees de tarea bajo `/home/dev/.superset/worktrees/tenbeltz-business-{pages,diagnosis,navigation}-20261102`; sin nuevos servicios, puertos públicos ni secretos copiados a esos checkouts. Los cambios previos ajenos de brandbook, recursos sociales y documentación de despliegue se conservan fuera de los commits de esta entrega.

## Verificación de desarrollo

- `npm ci` con lockfile sin modificaciones. Astro 7.4.0, Node 24.21.0.
- `npm run build`: cero errores, cero warnings del check y tres hints heredados; aviso de chunk >500 kB en Vite.
- HTTP/SEO: 28 rutas y 838 enlaces internos correctos; canonical, hreflang, sitemap y selector de idioma concordantes.
- Navegador Chromium 140: 84 navegaciones en 1440/390/320 px, más header en 741/768/1024 px, sin overflow, imágenes rotas ni errores JS.
- Menú móvil, foco/Escape/contacto, FAQ teclado, cambio de idioma de solución, detalle técnico de casos, contacto éxito/error simulados, tres rutas de cuestionario, edición/anterior y PDF ES/EN comprobados.
- Sin JavaScript: páginas y navegación legibles, controles de envío deshabilitados y alternativa de email.
- 17 pruebas de origen/Host/tamaño de contacto pasan con cuerpos inválidos, sin correos. Pruebas del navegador interceptan todos los POST de contacto.
- Modelo de orientación y cinco variantes PDF (ES/EN, orientación, implementación, formación, textos máximos y saltos de línea) correctos. MuPDF valida 35 páginas con texto dentro de límites; revisión visual de siete páginas.
- Revisión independiente: navegación ES/EN a 741/768/820 px, rutas, anchors y catálogo JSON-LD coherentes. Retrato de Aritz carga correctamente al desplazar.
- Preview existente reiniciada en `127.0.0.1:10022`; home nueva HTTP200 y HTTPS anónimo401, autenticación privada preservada.

Reproducción: `python3 tools/qa/dual-seo.py URL`, `node tools/qa/contact-origin.mjs`, `node tools/qa/business-diagnosis.mjs` y `tools/qa/business-browser.cjs`. Para navegador, instalar Playwright 1.55.1 en una carpeta temporal y pasar `PLAYWRIGHT_PACKAGE` con su ruta. Chromium local necesita `LD_LIBRARY_PATH=/home/dev/code/tenbeltz/tiktok-studio/tools/chromium-libs/root/usr/lib/x86_64-linux-gnu`. Los resultados y capturas de QA quedan privados en `tmp/business-qa/`.

## Producción

Publicación autorizada, pendiente de ejecución tras el cierre de estas pruebas. Se usará release nuevo, entorno privado de producción conservado y Node 24.21.0 aislado, ya probado con checksum coincidente con desarrollo. El servicio activo y el release anterior se conservan hasta pasar la comprobación del candidato. El resultado real se añadirá después del despliegue.

## Límites

Cero correos reales enviados durante esta revisión. No se verifica recepción en buzón, móvil físico, rendimiento de campo, indexación ni mejora de conversión. No se cambia backend, Nginx, DNS, autenticaciones ni proveedores. Las copias locales de rollback no acreditan recuperación integral ni backup externo. Manual Mac pendiente de sincronizar desde el VPS.
