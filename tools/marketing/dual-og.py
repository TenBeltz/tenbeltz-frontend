"""Render social previews from existing TenBeltz brand assets.
Run with the brand-kit Python environment; no API or external assets.
"""
from pathlib import Path
from io import BytesIO
import json
import fitz
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
ROOT=Path(__file__).resolve().parents[2]
identity=json.loads((ROOT/'brand/source/identity.json').read_text())
colors=identity['colors']
for name,weight in [('Plex','Regular'),('PlexMedium','Medium')]:
 pdfmetrics.registerFont(TTFont(name,str(ROOT/f'brand/source/fonts/IBMPlexSans-{weight}.ttf')))
copy={
 ('home','es'):('IA PARA EMPRESAS', ['Implementamos IA', 'en el trabajo diario', 'de tu empresa.'], 'Diagnóstico · Implementación · Formación'),
 ('home','en'):('AI FOR BUSINESS', ['We implement AI', 'in your company’s', 'everyday work.'], 'Diagnosis · Implementation · Team training'),
 ('business','es'):('SOLUCIONES DE IA', ['La IA aplicada', 'a tus procesos.'], 'Documentos · Administración · Atención · Conocimiento'),
 ('business','en'):('AI SOLUTIONS', ['AI built around', 'your workflows.'], 'Documents · Administration · Service · Knowledge'),
 ('software','es'):('INGENIERÍA DE IA', ['Experiencia técnica.', 'Aplicada a tu negocio.'], 'Integración · Evaluación · Adopción'),
 ('software','en'):('AI ENGINEERING', ['Technical expertise.', 'Applied to your business.'], 'Integration · Evaluation · Adoption'),
}
for (audience,lang),(kicker,lines,footer) in copy.items():
 buf=BytesIO();c=canvas.Canvas(buf,pagesize=(1200,630))
 c.setFillColor(HexColor(colors['paper']));c.rect(0,0,1200,630,fill=1,stroke=0)
 c.drawImage(str(ROOT/'brand/dist/logos/tenbeltz-horizontal-color.png'),64,525,width=225,height=46,preserveAspectRatio=True,anchor='sw',mask='auto')
 c.setFillColor(HexColor(colors['muted']));c.setFont('Plex',17);c.drawRightString(1136,550,'tenbeltz.com')
 c.setFont('PlexMedium',14);c.drawString(64,405,kicker)
 size=min(68,1000/max(pdfmetrics.stringWidth(line,'PlexMedium',1) for line in lines))
 for i,line in enumerate(lines):
  c.setFillColor(HexColor(colors['ink'] if i==0 else colors['accent']));c.setFont('PlexMedium',size);c.drawString(64,318-i*84,line)
 c.setStrokeColor(HexColor(colors['line']));c.line(64,100,1136,100)
 c.setFillColor(HexColor(colors['muted']));c.setFont('Plex',20);c.drawString(64,61,footer)
 c.save();doc=fitz.open(stream=buf.getvalue(),filetype='pdf')
 path=ROOT/f'public/og/tenbeltz-{audience}-{lang}.png';doc[0].get_pixmap().save(path)
 print(path.relative_to(ROOT))
