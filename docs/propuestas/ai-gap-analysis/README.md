# AI Gap Analysis

Estructura base para preparar propuestas comerciales de `AI Gap Analysis` y regenerarlas rápido para nuevos clientes.

## Estructura

- `_template/`: base editable con placeholders y assets genéricos.
- `garantic/`: propuesta concreta ya adaptada para Garantic.
- `render.mjs`: script común para generar `propuesta.pdf` y `propuesta.png` dentro de cada carpeta de cliente.

## Cómo crear una nueva propuesta

1. Duplica la plantilla:
   `cp -R docs/propuestas/ai-gap-analysis/_template docs/propuestas/ai-gap-analysis/nombre-cliente`
2. Sustituye los placeholders del HTML:
   - `{{BUDGET_ID}}`
   - `{{DATE_LONG}}`
   - `{{CLIENT_SHORT_NAME}}`
   - `{{CLIENT_LEGAL_NAME}}`
   - `{{PROJECT_SUMMARY}}`
   - `{{PROJECT_CONTEXT}}`
   - `{{TOTAL_PRICE}}`
   - `{{DELIVERY_WINDOW}}`
   - datos de proveedor y cliente
3. Reemplaza `assets/client-logo.png` por el logo real del cliente.
4. Si hace falta, ajusta solo el bloque de `Contexto del proyecto` y `Alcance del servicio`.
5. Genera el PDF:
   `/Users/aritzjl/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node docs/propuestas/ai-gap-analysis/render.mjs nombre-cliente`

## Convención recomendada

- Carpeta por cliente: `docs/propuestas/ai-gap-analysis/<cliente>`
- HTML fuente: `propuesta.html`
- Salidas generadas: `propuesta.pdf` y `propuesta.png`
- Copia final para envío: mover o copiar el PDF al Escritorio solo al final

## Notas

- Mantén la portada más visual y el resto del documento sobrio.
- Evita meter tarjetas si no ayudan a impresión.
- Si el visor de macOS cachea el PDF, genera una copia nueva en el Escritorio con sufijo `-v2`, `-v3`, etc.
