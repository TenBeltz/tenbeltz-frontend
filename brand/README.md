# TenBeltz · Brandbook y recursos · 2026.10

Edición ampliada del sistema editorial para documentos, redes, presentaciones y mockups. Parte de la identidad actual de la web; conserva el símbolo original y la flor original. Las aplicaciones nuevas están listas para revisión estética humana, sin publicaciones en redes o cambios en la web activa.

## Ver y descargar

- Galería privada VPS: https://tenbeltz-brandbook.dev.tenbeltz.com (acceso privado habitual del VPS).
- Abrir `index.html` localmente después de descomprimir el kit también funciona; no necesita Internet.
- Manual: `dist/documents/tenbeltz-brandbook.pdf`, 30 páginas. Texto: `BRANDBOOK.md`.
- Paquete completo: `tenbeltz-brand-kit.zip`. Incluye `brand/` y `tools/brand-kit/` con estructura portable.
- Inventario verificable: `manifest.json`, con formatos, tamaños, dimensiones PNG y SHA-256.

## Entrega

| Carpeta | Contenido |
| --- | --- |
| `dist/logos/` | Horizontal, vertical, símbolo y wordmark; color, carbón, negro y blanco; SVG, PNG transparente y PDF vectorial |
| `dist/linkedin/` | Portadas empresa 1512×256 y personal 1584×396 ES/EN; portada editorial ES/EN; avatares 400×400; guías separadas |
| `dist/graphics/` | Flor original, 16 nuevos fondos/motivos en SVG/PNG, patrones, diagramas y gráficos reutilizables de los ejemplos |
| `dist/icons/` | 16 iconos propios × tres colores, SVG 24×24 |
| `dist/social/` | Cuatro plantillas cuadradas y verticales, historia, enlace ES/EN y carrusel de cinco páginas PNG/SVG/PDF |
| `dist/web/` | OG ES/EN, favicons, iconos de aplicación, manifest, tokens JSON/CSS, paleta CSV y contrastes calculados |
| `dist/documents/` | Brandbook, propuesta de ejemplo (6 páginas), informe de ejemplo (7), DOCX/HTML/PDF y plantillas base, tarjetas y firmas HTML |
| `dist/presentations/` | Corporativa ES y EN de 12 slides y plantilla de 10 composiciones, PPTX/HTML/PDF; vistas individuales |
| `dist/mockups/` | Seis fotografías conceptuales generadas con IA: tazas, camisetas, cuadernos, bolsa, botellas y colección |
| `source/` | Identidad y contenidos JSON, símbolo/flor originales y fuentes con licencia |

## Regenerar

Desde la raíz del repo o de la carpeta descomprimida `tenbeltz-brand-kit/`:

```bash
python3 -m venv .venv-brand
.venv-brand/bin/python -m pip install -r tools/brand-kit/requirements.txt
.venv-brand/bin/python tools/brand-kit/build.py
.venv-brand/bin/python tools/brand-kit/verify.py
```

Python 3.12 utilizado en el VPS. La regeneración de gráficos/documentos no necesita Cairo, LibreOffice, APIs, claves ni servicios externos. Los mockups ya generados se incorporan desde sus originales locales; para crear otros se usa image_gen integrado con los prompts guardados. MuPDF exporta SVG a PNG y PDF; ReportLab crea el manual y documentos; python-pptx y python-docx crean archivos editables. El generador no modifica `src/`, `public/`, cuentas, redes ni servicios.

El entorno de ejecución usado aquí está en `/home/dev/.cache/tenbeltz-brand-venv`; es caché local, no una ruta requerida por el código. Las dependencias directas están fijadas en requirements.txt. `requirements-vps-lock.txt` registra también las transitivas usadas en esta generación; es una referencia para Python 3.12/Linux.

## Adaptar contenido y diseño

- `source/identity.json`: datos de contacto, mensajes ES/EN y paleta.
- `source/book.json`: capítulos, texto y selección de ejemplos del manual.
- `source/slides.json`: contenidos corporativos y composiciones de la plantilla.
- `source/social.json`: publicaciones y carrusel.
- `source/example-project.json`: cliente ficticio, presupuesto y datos sintéticos de los documentos.
- `source/mockups/prompts.json`: los seis prompts completos; originales de imagen en esa carpeta.
- `tools/brand-kit/build.py`: generador general. `graphics.py`, `scenes.py`, `documents.py` y `premium.py`: ampliación de gráficos, geometría compartida, documentos y galería. Todo el código queda guardado para reutilizar.
- Instalar `source/fonts/IBMPlexSans-*.ttf` antes de editar en PowerPoint o Word.

Los textos, formas y tablas del PPTX son editables. El símbolo y la flor están insertados como imágenes. Las 10 composiciones son diapositivas duplicables con campos de muestra; no son 10 layouts personalizados del Slide Master. El tema de PowerPoint usa IBM Plex Sans. PowerPoint, SVG y PDF comparten una única geometría en `scenes.py`; el PDF conserva texto buscable. Las doce diapositivas corporativas usan doce composiciones diferentes. No es una captura del motor de PowerPoint.

Los SVG y PDF de logos convierten texto en trazados para no depender de fuentes instaladas. Las variantes blancas son transparentes y necesitan un fondo oscuro al colocarlas. No subir las guías con sufijo `-guia` a LinkedIn.

El generador sobrescribe sus salidas conocidas; no elimina archivos obsoletos al quitar una pieza del JSON. Antes de reorganizar recursos, conservar una copia y retirar las exportaciones antiguas explícitamente.

## Límites de verificación

- Revisión visual del manual rasterizado y piezas; verificación automática de formatos, dimensiones, integridad y documentos.
- Galería comprobada en Chromium a 1440/390/320 px; controles de presentación comprobados por teclado.
- Pendientes aceptación estética humana, recorte real de LinkedIn y edición/renderizado en PowerPoint/Word de escritorio. No hay acceso a esas apps en el VPS.
- Tarjeta con 3 mm de sangrado, TrimBox y BleedBox. Los PDF son RGB: la imprenta debe convertir según su perfil y hacer una prueba. El CMYK de `palette.csv` es orientativo; no hay Pantone aprobado.
- La flor tiene resolución original 1254×1254; no usar su exportación en gran formato sin revisar resolución efectiva.
- No se han redistribuido logos de clientes. Las métricas de los ejemplos son sintéticas y están señaladas; no se inventan resultados o referencias reales.

Licencias, procedencia y fuentes en `SOURCES.md`; resultados técnicos en `VERIFICATION.md`.

El usuario valida esta edición completa el 2026-10-08 y autoriza commit/push. Las comprobaciones de Office e imprenta siguen pendientes. Los recursos de `dist/` se versionan; el ZIP descargable y las cachés Python se regeneran y quedan fuera de Git.

## Ampliación de ejemplos y mockups / 2026-10-08

El primer kit fue valorado positivamente por el usuario. Esta revisión responde a sus peticiones: más gráficos, ejemplos realistas de propuesta/informe, variedad de diapositivas y mockups de productos. 384 exportaciones registradas.

- Ejemplos: `dist/documents/tenbeltz-proposal-example.pdf` y `tenbeltz-report-example.pdf`, con Word editable y visor HTML. Se conservan las plantillas base de una página.
- Ladera Cloud y todos los presupuestos/métricas son ficticios. La muestra de 120 casos, los 106 aprobados, los 14 fallos y el reparto por categorías son aritméticamente consistentes. No son una referencia de cliente ni una oferta real.
- Los gráficos de calidad, latencia, errores, arquitectura y calendario tienen exportaciones separadas SVG/PNG bajo `dist/graphics/tenbeltz-example-*`.
- Mockups creados con la herramienta integrada image_gen, usando los logos y la flor originales. La regeneración determinista del kit conserva sus píxeles; una nueva inferencia con esos prompts puede producir otro resultado. No se usó un CLI externo ni se pidió una clave.
- Mockups conceptuales: no prueban fabricación ni sirven como artes finales. Para imprimir, usar logo/SVG original y especificaciones del proveedor.
- Referencia ZIP previa conservada sólo en caché del VPS: `/home/dev/.cache/tenbeltz-brand-kit-before-expansion-20261008.zip`. No es un backup offsite.
