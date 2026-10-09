# Producción TenBeltz — 2026-10-09

Despliegue autorizado expresamente por el usuario. Frontend `main` publicado desde `rebranding`; backend nuevo `TenBeltz/tenbeltz-landing-api` rama `main`. VPS 62.171.173.193, `/home/tenbeltz/tenbeltz-frontend` y `/home/tenbeltz/tenbeltz-landing-api`. Servicios systemd `tenbeltz-frontend` (Node22, loopback10022) y `tenbeltz-landing-api` (Python3.12, loopback10024). Nginx conserva TLS y redirecciones canónicas; www redirige al dominio raíz. `/api/contact` permite exclusivamente Origin HTTPS del propio dominio (o preview/local en desarrollo), con token privado de servidor y upstream loopback. Chat retirado; no exponer rutas IA mediante el dominio API.

Entorno privado de producción: `.env`600 en ambos proyectos, token compartido exclusivo de producción; backend sólo SMTP, destinatario hello@tenbeltz.com, DATA_DIR privada. No copiar claves Groq ni otros proveedores innecesarios. Recompilar frontend al rotar token.

Rollback privado en `/root/backups/tenbeltz-20261009/`: archivo completo de ambos proyectos anteriores con datos/archivos ignorados y Git, configuración Nginx, PM2. Verificar gzip y SHA256 antes de retirar legado. Repositorio GitHub antiguo respaldado con mirror íntegro en VPS dev y metadatos issues/pulls privados antes de eliminarlo por petición expresa.

Validación y hashes finales: consultar manual operativo remoto docs/13, docs/14 y docs/06. No se considera recuperación offsite ensayada. Manual Mac pendiente de sincronizar.
