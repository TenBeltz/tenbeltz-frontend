# Producción TenBeltz — 2026-10-09

Despliegue autorizado expresamente por el usuario. Frontend `main` publicado desde `rebranding`; backend nuevo `TenBeltz/tenbeltz-landing-api` rama `main`. VPS 62.171.173.193, `/home/tenbeltz/tenbeltz-frontend` y `/home/tenbeltz/tenbeltz-landing-api`. Servicios systemd `tenbeltz-frontend` (Node22, loopback10022) y `tenbeltz-landing-api` (Python3.12, loopback10024). Nginx conserva TLS y redirecciones canónicas; www redirige al dominio raíz. `/api/contact` permite exclusivamente Origin HTTPS del propio dominio (o preview/local en desarrollo), con token privado de servidor y upstream loopback. Chat retirado; no exponer rutas IA mediante el dominio API.

Entorno privado de producción: `.env`600 en ambos proyectos, token compartido exclusivo de producción; backend sólo SMTP, destinatario hello@tenbeltz.com, DATA_DIR privada. No copiar claves Groq ni otros proveedores innecesarios. Recompilar frontend al rotar token.

Rollback privado en `/root/backups/tenbeltz-20261009/`: archivo completo de ambos proyectos anteriores con datos/archivos ignorados y Git, configuración Nginx, PM2. Verificar gzip y SHA256 antes de retirar legado. Repositorio GitHub antiguo respaldado con mirror íntegro en VPS dev y metadatos issues/pulls privados antes del intento de eliminación autorizado. GitHub rechazó el borrado con403 por falta del scope `delete_repo`; repositorio archivado y borrado definitivo pendiente.

Validación y hashes finales: consultar manual operativo remoto docs/13, docs/14 y docs/06. No se considera recuperación offsite ensayada. Manual Mac pendiente de sincronizar.

## Resultado verificado

Publicación de código frontend `3338e71`, backend `86dae55`. Build limpio en Node22.17.1 con npm11 instalado aisladamente en `/opt/tenbeltz-tools`: npm10 de ese Node rechaza la resolución del lockfile, npm11 coincide con desarrollo y permite `ci` sin modificarlo. Comando: `node /opt/tenbeltz-tools/node_modules/npm/bin/npm-cli.js ci`; después `npm run build`.

14 URLs públicas200 y canonicals/sitemap concordantes; www301. Browser ES1440/390 y EN320 sin errores ni overflow: puntuaciones1/5,5/10, PDF y reintento. Prueba real HTTPS: diagnóstico y contacto200, dos notificaciones aceptadas SMTP; PDF seis páginas con IBM Plex incrustada. No se ha leído inbox. Token ausente de todos los assets cliente. Origen ajeno403, chat/backend antiguo404. Servicios activos y habilitados en loopback10022/10024. Otros procesos PM2 conservados.

Legado detenido y retirado de `/home/tenbeltz/tenbeltz-backend`; frontend anterior reemplazado por enlace al release. Copia final de datos del backend tras detenerlo, además de backup completo anterior, ambos copiados al VPS dev y hashes coincidentes. Backups privados en VPS dev: `/home/dev/.local/share/tenbeltz-migration/production-20261009/`. GitHub antiguo archivado, eliminación pendiente del permiso `delete_repo`; no se han cambiado autenticaciones.
