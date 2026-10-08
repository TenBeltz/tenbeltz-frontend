# Brandbook y biblioteca de marca · 2026-10-08

Petición: completar el nuevo sistema de marca y guardar el código de creación para reutilizarlo.

Entrega inicial en `brand/`: manual de 28 páginas, logos en cuatro composiciones y cuatro colores, banners LinkedIn ES/EN, avatares, ocho iconos en tres colores, flor original, patrones, fondos, diagramas, publicaciones, carrusel, recursos web, papelería y presentaciones. 278 exportaciones registradas en `brand/manifest.json`.

Corporativa ES/EN de 12 diapositivas cada una y plantilla de 10 composiciones en PPTX editable, HTML y PDF. Propuestas e informes en DOCX editable/HTML/PDF. Datos JSON y generadores Python/JavaScript guardados en `brand/source/` y `tools/brand-kit/`; ZIP portable con código, fuentes y licencia. La galería funciona también desde archivos locales.

Identidad preservada: símbolo original, nombre TenBeltz., paleta editorial, IBM Plex Sans y flor original. No se generan nuevas imágenes, no se usan logos de clientes ni se inventan métricas. La web activa y los cambios previos de hero permanecen fuera del alcance de la generación del kit.

Galería privada: https://tenbeltz-brandbook.dev.tenbeltz.com; puerto loopback 10023, servicio de usuario `tenbeltz-brandbook.service`, Python HTTP estático. Para regenerar, consultar `brand/README.md`; no necesita reiniciar el servicio al cambiar archivos.

Verificación detallada y pendientes en `brand/VERIFICATION.md`. Sin commit/push ni publicación en redes o despliegue de producción. El nuevo servicio/preview se documenta en el manual remoto y contexto común; Mac pendiente de sincronizar.

## Ampliación tras revisión del usuario

Aritz valora el primer kit positivamente y pide más gráficos, documentos realistas, presentaciones con composiciones distintas y mockups. Ampliado a 30 páginas y 384 exportaciones. Propuesta de 6 páginas e informe de 7 con caso Ladera Cloud ficticio y datos sintéticos coherentes; arquitectura, Gantt, tablas, indicadores, calidad, latencia, iteraciones y errores. Word/HTML/PDF y recursos de gráfico independientes.

Cada presentación corporativa ES/EN tiene 12 composiciones distintas; PPTX, SVG y PDF comparten geometría y fuentes. 16 fondos/motivos nuevos, ocho iconos adicionales y cinco gráficos/diagramas de documento. Seis mockups generados con image_gen integrado: tazas, camisetas, cuadernos, bolsa, botellas y colección. Originales/referencias/prompts preservados en source/mockups; código modular en tools/brand-kit. Los mockups son conceptuales, no artes de fabricación.

Todos los PDF se rasterizaron y revisaron; verificaciones de coherencia de datos, editabilidad, límites de texto, hashes y copias de mockups añadidas. Galería destaca ejemplos, variedad de slides y colección; comprobaciones Chromium para 1440/390/320 px, ejemplos HTML y navegación. Se reutilizan servicio, DNS, puerto y acceso privado existentes. Sin cambios de web activa, envíos de formularios, commit/push o publicaciones externas.
