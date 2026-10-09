# Asistente de proyectos —2026-10-08

Acceso «Explora tu proyecto» / «Explore your project» visible en preview y entornos locales, desde Layout compartido. Un diálogo nativo accesible carga Assistant UI bajo mismo origen al abrir; no carga el chat ni llama al modelo antes. El launcher se recoloca si aparece el aviso de cookies. Escape/cerrar devuelve foco al botón.

Backend nuevo `/home/dev/code/tenbeltz/tenbeltz-landing-api`, Agno + Groq `qwen/qwen3.8-27b` + AG-UI + Assistant UI, independiente de API antigua/Bilbe. API puente `src/pages/api/agent/[...path].ts` allowlist y upstream fijo127.0.0.1:10024. Transmite SSE/Bearer, sin cookies/secretos/autenticación Nginx. Cuerpo máximo64KiB. Endpoint y botón limitados por hostname preview/local; aún no habilitados en tenbeltz.com.

Consentimiento, historial, briefing, referencias reales y PDF con kit de marca se gestionan en backend. Token efímero de pestaña sessionStorage; caducidad7d/borrado servidor. El formulario existente sigue intacto y no se ha enviado en QA. Informe español/chat ES-EN.16 casos disponibles; resto del inventario177repos pendiente de revisión.

Verificación: Astro check0errores/build correcto (dos hints previos svgPathParser y advertencia de chunk3D). Chromium1440×1000,390×844 y320×844, sin errores JS/overflow. Conversación real de dos turnos con datos ficticios, streaming, PDF descargado, historial recuperado al recargar, borrado y versión inglesa comprobados. Cookie visible no impide abrir chat. Salud backend/puente200 y HTTPS anónimo401. Nginx login positivo pendiente; pruebas browser realizadas contra loopback privado. No publicación de producción.

Repo backend ya registrado en Superset: TenBeltz · Backend / TenBeltz · Backend · VPS. Manual VPS docs/14-tenbeltz-landing-api.md y docs13. Sólo VPS accesible; sincronización Mac pendiente.
