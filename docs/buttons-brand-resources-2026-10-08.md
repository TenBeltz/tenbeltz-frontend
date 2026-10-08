# Contraste de botones y recursos de marca — 2026-10-08

El CTA del perfil heredaba color de texto carbón por `.cv-contact a`, que tenía mayor especificidad que `.button`. La regla se limita ahora a `.cv-contact p a`, los enlaces de correo/teléfono. El botón recupera blanco sobre berenjena sin añadir excepciones ni `!important`.

Revisado el catálogo del brandbook. Se reutilizan tres SVG originales en las entradas de servicios de la home ES/EN: diagnóstico, arquitectura y formación, sustituyendo su numeración por pictogramas de26px. Copias sin modificaciones en public/images/brand; fuente brand/dist/icons. Imágenes decorativas con alt vacío y aria-hidden. No se reutilizan gráficos con métricas ficticias ni mockups de merchandising como evidencia de proyectos. No se modifica el generador del brandbook.

Build Astro/check correcto. Preview existente reconstruida y servicio de usuario reiniciado. HTTP200 y HTTPS anónimo401. Verificación browser:288 comprobaciones de botones visibles y habilitados en doce rutas, escritorio1440px y móvil390px, en estados normal, hover y foco de teclado. Contraste mínimo8,51:1 (umbral4,5:1), cero fallos, sin errores JS ni desbordamiento. Capturas revisadas de servicios e información de contacto del perfil; no envíos del formulario, commit/push o despliegue en producción.
