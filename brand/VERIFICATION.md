# Verificación · TenBeltz brand kit · 2026-10-08

## Comprobado

- Generación local desde los originales y JSON; 384 exportaciones en el inventario. Entorno virtual Python separado del runtime de Astro.
- PDF de 30 páginas con texto de contenido buscable. Renderizadas todas las páginas y revisada la hoja de contacto; títulos, márgenes, muestras y pies legibles, sin recortes.
- Logos en cuatro composiciones × cuatro colores × tres formatos. SVG parseables, PDF legibles y PNG con transparencia. Símbolo original idéntico al de la web.
- Flor convertida a PNG con píxeles RGBA idénticos al original WebP.
- LinkedIn empresa 1512×256, personal 1584×396 ES/EN; archivos dentro de sus límites de peso. Avatares 400×400.
- Contraste calculado sRGB: carbón/papel 13,77:1; berenjena/papel 9,82:1; secundario/papel 5,02:1; blanco/berenjena 10,62:1; blanco/carbón 14,89:1. Valores redondeados; datos en contrast.json.
- PowerPoint: 12 slides ES, 12 EN y 10 composiciones de plantilla. Texto editable en todas, tablas nativas, figuras dentro del lienzo y notas. PDF con el mismo número de páginas.
- DOCX de propuesta/informe abiertos con python-docx y campos editables comprobados. PDF A4 de una página por plantilla.
- Tarjeta de dos caras: TrimBox 85×55 mm, BleedBox con 3 mm por lado.
- Galería en Chromium, 1440/390/320 px: sin overflow, imágenes rotas o errores JavaScript. Detectado y corregido el mínimo de retícula que causaba overflow a 320 px. Enlaces locales existentes; navegación de las tres presentaciones por flechas derecha/izquierda correcta.
- Browser aislado en la imagen Playwright ya disponible mediante Docker rootless, sin red, sin sesión autenticada y con límite de CPU/memoria. No se instalaron librerías del sistema ni se usó sudo general.
- Galería persistente: servicio activo/habilitado, escucha sólo 127.0.0.1:10023. HTTP local 200; HTTPS válido y anónimo 401. Certificado emitido por dev-preview.
- ZIP portable con código, JSON, originales y licencia; integridad CRC comprobada con verify.py. SHA-256 de exportaciones y fuentes en manifest.json.

## Pendiente / límites

- Aceptación estética humana recibida el 2026-10-08 («brutal es perfecto»); autoriza commit y push.
- Acceso positivo con autenticación Nginx: no se dispone de credenciales legibles de acceso general en esta sesión. La protección contra acceso anónimo sí está comprobada.
- Recorte real al subir las imágenes a LinkedIn, desde escritorio y móvil.
- Renderizado/edición en PowerPoint y Word de escritorio. El VPS no dispone de esas aplicaciones. Las vistas PPTX/SVG/PDF comparten geometría; no se ha usado el motor de Office.
- Conversión de los PDF RGB por la imprenta, prueba física y resolución efectiva para gran formato.
- Sin publicación en redes, contactos enviados, modificación de la web activa ni commit/push.
- Documentación operativa actualizada en el VPS. Carpeta del manual del Mac pendiente de sincronizar; no se accedió al Mac.

## Repetir

```bash
python tools/brand-kit/build.py
python tools/brand-kit/verify.py
# QA opcional, con Playwright disponible:
node tools/brand-kit/browser-check.mjs
```

Usar el Python del entorno virtual descrito en README.md. Para aprovechar una instalación existente de Playwright, pasar su URL de módulo mediante BRAND_PLAYWRIGHT_MODULE. Los informes de navegador y capturas se guardan en brand/.

## Revisión ampliada / 2026-10-08

- Propuesta: 6 páginas A4, con contexto, arquitectura, Gantt, presupuesto y criterios. Informe: 7 páginas A4, con resumen, muestra, calidad, latencia, iteraciones, causas de error y acciones. Todas las páginas de los PDF nativos se rasterizaron y revisaron. Texto buscable y avisos de ejemplo ficticio.
- Datos sintéticos consistentes: categorías 60+40+20=120; aprobados 56+34+16=106; fallos 6+4+2+2=14; presupuesto 2.400+6.000+3.600=12.000 €.
- Doce composiciones corporativas distintas en cada idioma; texto, formas y conectores editables. Geometría compartida con PDF/SVG y tipografía por peso real.
- Seis mockups revisados visualmente; copias de distribución idénticas a originales generados; prompts y referencias guardados.
- 16 nuevos fondos/motivos, ocho iconos adicionales y cinco diagramas/gráficos de documento en SVG/PNG.
- Galería ampliada con acceso directo a ejemplos, presentación y colección. QA de ejemplos HTML en 1440/390/320 px incluida en browser-check.mjs.
- Sin cambios de DNS, puertos, servicios, autenticación o web activa. Se reutiliza la galería privada existente. Nuevas piezas pendientes de aceptación estética y las pruebas de Office/imprenta ya descritas.
