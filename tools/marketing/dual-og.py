"""Render six social previews from existing TenBeltz brand assets.
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
 ('home','es'):('IA APLICADA', ['IA para tu negocio.', 'Y para tu producto.'], 'Procesos de negocio · Ingeniería para software'),
 ('home','en'):('APPLIED AI', ['AI for your business.', 'And your product.'], 'Business workflows · Software engineering'),
 ('business','es'):('PARA EMPRESAS Y PYMES', ['Menos trabajo repetitivo.', 'Más tiempo para tu negocio.'], 'Documentos · Informes · Herramientas conectadas'),
 ('business','en'):('FOR BUSINESSES AND SMEs', ['Less repetitive work.', 'More time for your business.'], 'Documents · Reports · Connected tools'),
 ('software','es'):('PARA EQUIPOS DE SOFTWARE', ['IA para tu producto.', 'Ingeniería a tu lado.'], 'Arquitectura · Evaluación · Integración'),
 ('software','en'):('FOR SOFTWARE TEAMS', ['AI for your product.', 'Engineering alongside you.'], 'Architecture · Evaluation · Integration'),
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
