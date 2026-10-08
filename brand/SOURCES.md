# Fuentes y procedencia

Fecha de consulta y edición: 2026-10-08.

## Identidad local

- `.agents/skills/brand-guidelines/SKILL.md`: identidad editorial vigente, responsabilidades, atribuciones y flor original.
- `src/styles/global.css`: colores, IBM Plex Sans, jerarquías y espaciado.
- `src/components/Header.astro`: símbolo + nombre TenBeltz + punto.
- `src/templates/LandingPage.astro`: público, mensajes ES/EN y estructura de oferta.
- `src/components/Contact.astro`: hello@tenbeltz.com y teléfono público +34 640 520 819.
- `CLAUDE.md`: posicionamiento, cinco servicios y responsabilidades de Aritz/equipo.

Las normas de mínimos, área de protección, versiones vertical/wordmark y nuevas aplicaciones son extensiones de diseño de esta edición; no se presentan como un manual histórico ya aprobado. El sitio existente conserva sus recursos sin modificaciones de este kit.

## Símbolo y flor

- Símbolo original: `public/images/tenbeltz-mark.svg`; copia preservada en `source/logos/tenbeltz-mark-original.svg`. Cinco trazados originales sin redibujo.
- Flor original: `public/images/hero/abstract-flower.webp`; copia preservada en `source/artwork/abstract-flower.webp`.
- Procedencia de la ilustración y prompt: `docs/hero-flower-2026-10-08.md`. Creada previamente con image_gen desde la referencia de Aritz. En esta tarea no se ha generado ni editado otra flor. La conversión WebP→PNG conserva dimensiones y transparencia.
- Los pliegues abstractos SVG, patrones, iconos y diagramas son dibujos programáticos de esta edición.

## Tipografía

IBM Plex Sans Regular, Medium y SemiBold descargados del [repositorio oficial IBM/plex](https://github.com/IBM/plex/tree/master/packages/plex-sans/fonts/complete/ttf).

- TTF originales guardados en `source/fonts/`.
- [Licencia oficial SIL Open Font License](https://github.com/IBM/plex/blob/master/LICENSE.txt), copia íntegra en `source/fonts/OFL.txt`.
- WOFF2 latin: copia de la fuente autoalojada de la web. Los textos gráficos se convierten a curvas usando los TTF oficiales. Fuente web, versión binaria y tipografía de edición pueden tener pequeñas diferencias ópticas; el lockup exportado es la referencia estable del kit.
- No se aplica la licencia de las fuentes al logotipo ni se concede permiso para usar marcas de terceros.

## Especificaciones de LinkedIn

- [Imagen de portada personal](https://www.linkedin.com/help/linkedin/answer/a568217): 1584×396 px.
- [Especificaciones de Pages y Career Pages](https://www.linkedin.com/help/billing/answer/a563309): portada 1512×256, logo 400×400, imágenes PNG/JPEG y límite 3 MB para Page.
- Las áreas marcadas por el kit son protección editorial orientativa. No hay una zona oficial de recorte universal en esos documentos; revisar al subir desde móvil/escritorio.
- Formatos sociales de 1080×1080, 1080×1350, 1080×1920 y 1200×627 son tamaños elegidos para las plantillas del kit, no afirmaciones sobre todos los requisitos actuales de cada plataforma.

## Contraste y color

- [W3C: contraste mínimo](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html): referencia para los objetivos 4,5:1 en texto normal y 3:1 en texto grande.
- Cálculo del kit: luminancia relativa sRGB; resultados en `dist/web/contrast.json`.
- CMYK: conversión aritmética sin perfil ICC, registrada como aproximada en CSV y manual. No es una prueba de imprenta ni una especificación Pantone.

## Herramientas

ReportLab, Pillow, FontTools, MuPDF/PyMuPDF, python-pptx y python-docx se usan como dependencias del generador. No se redistribuye su código en el ZIP; el fichero de dependencias permite instalarlas. PyMuPDF ofrece licencia AGPL y opción comercial: revisar sus condiciones si se integra el generador en un servicio distribuido. Los archivos de marca se mantienen como recursos de TenBeltz.

## Ampliación / 2026-10-08

- Seis mockups creados mediante image_gen integrado, con el logo horizontal y la flor original como referencias. Prompts completos en `source/mockups/prompts.json`; imágenes sin edición posterior en `source/mockups/*.png` y copias en `dist/mockups/`. No son productos fotografiados ni archivos de fabricación.
- Fondos/motivos vectoriales y ocho iconos nuevos: código determinista `tools/brand-kit/graphics.py`, con la paleta del JSON. Son recursos secundarios, no logos alternativos.
- Ladera Cloud es una empresa ficticia. Cliente, alcance, importe y métricas proceden de `source/example-project.json` y son ilustrativos. No se usaron datos de clientes, CRM o producción.
- Documentos: `documents.py` y geometría de `scenes.py`. PPTX/HTML/PDF comparten contenido y composición; el PDF usa texto nativo ReportLab y gráficos vectoriales básicos.
