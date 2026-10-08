#!/usr/bin/env python3
"""Build the offline TenBeltz brand kit. All paths relative to this script.

No credentials, network calls, website writes or runtime service changes.
Text in vector exports is outlined; PPTX text remains editable.
"""
from pathlib import Path
import base64
import hashlib
import html
import io
import json
import math
import shutil
import zipfile
import xml.etree.ElementTree as ET

from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont as Font
from fontTools.pens.svgPathPen import SVGPathPen
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.lib.utils import ImageReader
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from docx import Document
from docx.shared import Mm as DocMm, Pt as DocPt, RGBColor as DocColor
import fitz


class SVGRenderer:
    """MuPDF handles SVG paths and embedded images without system Cairo."""
    @staticmethod
    def svg2png(bytestring, write_to=None):
        with fitz.open(stream=bytestring, filetype='svg') as doc:
            data = doc[0].get_pixmap(alpha=True).tobytes('png')
        if write_to: Path(write_to).write_bytes(data)
        return data

    @staticmethod
    def svg2pdf(bytestring, write_to=None):
        with fitz.open(stream=bytestring, filetype='svg') as doc:
            data = doc.convert_to_pdf()
        if write_to: Path(write_to).write_bytes(data)
        return data


renderer = SVGRenderer

ROOT = Path(__file__).resolve().parents[2]
KIT = ROOT / 'brand'
SOURCE = KIT / 'source'
DIST = KIT / 'dist'
IDENTITY = json.loads((SOURCE / 'identity.json').read_text())
C = IDENTITY['colors']
BOOK = json.loads((SOURCE / 'book.json').read_text())
SLIDES = json.loads((SOURCE / 'slides.json').read_text())
SOCIAL = json.loads((SOURCE / 'social.json').read_text())
FONTS = {w: Font(SOURCE / 'fonts' / f'IBMPlexSans-{w}.ttf') for w in ('Regular', 'Medium', 'SemiBold')}
FLOWER = SOURCE / 'artwork' / 'abstract-flower.webp'
FLOWER_URI = 'data:image/png;base64,' + base64.b64encode(
    (lambda b: (Image.open(FLOWER).save(b, format='PNG'), b.getvalue())[1])(io.BytesIO())
).decode()
MARK_PATHS = [p.attrib['d'] for p in ET.parse(SOURCE / 'logos' / 'tenbeltz-mark-original.svg').iter()
              if p.tag.endswith('path')]
ARTIFACTS = []


def color(name):
    return C.get(name, name)


def xml(s):
    return html.escape(str(s), quote=True)


def text_svg(s, x, y, size, fill='ink', weight='Regular', tracking=0):
    """Outline text from bundled IBM font, including pair kerning."""
    f = FONTS[weight]
    gs, cmap = f.getGlyphSet(), f.getBestCmap()
    upm, cursor = f['head'].unitsPerEm, 0
    kern = {}
    if 'kern' in f:
        for table in f['kern'].kernTables:
            kern.update(table.kernTable)
    paths, previous = [], None
    for ch in s:
        name = cmap.get(ord(ch), '.notdef')
        cursor += kern.get((previous, name), 0)
        pen = SVGPathPen(gs)
        gs[name].draw(pen)
        d = pen.getCommands()
        if d:
            paths.append(f'<path transform="translate({cursor:.4f},0)" d="{d}"/>')
        cursor += f['hmtx'][name][0] + tracking * upm
        previous = name
    return f'<g fill="{color(fill)}" transform="translate({x},{y}) scale({size/upm}, {-size/upm})">' + ''.join(paths) + '</g>'


def text_width(s, size, weight='Regular', tracking=0):
    f = FONTS[weight]
    return sum(f['hmtx'][f.getBestCmap().get(ord(c), '.notdef')][0] for c in s) * size / f['head'].unitsPerEm + len(s)*tracking*size


def mark(x, y, height, fill='accent'):
    return f'<g fill="{color(fill)}" transform="translate({x},{y}) scale({height/32})">' + ''.join(f'<path d="{d}"/>' for d in MARK_PATHS) + '</g>'


def rect(x, y, w, h, fill, radius=0):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" fill="{color(fill)}"/>'


def line(x1, y1, x2, y2, fill='line', width=1):
    return f'<path d="M{x1},{y1} L{x2},{y2}" stroke="{color(fill)}" stroke-width="{width}"/>'


def flower(x, y, size):
    return f'<image x="{x}" y="{y}" width="{size}" height="{size}" href="{FLOWER_URI}"/>'


def logo_body(kind='horizontal', variant='color'):
    ink, accent = ('ink', 'accent') if variant == 'color' else (variant, variant)
    word = text_svg('TenBeltz', 0, 45, 52, ink, 'SemiBold', -.055)
    word_w = text_width('TenBeltz', 52, 'SemiBold', -.055)
    word += text_svg('.', word_w-1, 45, 52, accent, 'SemiBold')
    width = math.ceil(word_w + 14)
    if kind == 'symbol':
        return 70, 80, mark(0, 0, 80, accent)
    if kind == 'wordmark':
        return width, 58, word
    if kind == 'vertical':
        return width, 154, mark((width-70)/2, 0, 80, accent) + f'<g transform="translate(0,96)">{word}</g>'
    return width+86, 64, mark(0, 0, 64, accent) + f'<g transform="translate(78,9)">{word}</g>'


def logo(x, y, width, variant='color', kind='horizontal'):
    w, h, body = logo_body(kind, variant)
    return f'<g transform="translate({x},{y}) scale({width/w})">{body}</g>'


def svg(w, h, body, title):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-labelledby="title"><title id="title">{xml(title)}</title>{body}</svg>'


def export(name, w, h, body, title, formats=('svg','png'), category='graphics'):
    path = DIST / category / name
    path.parent.mkdir(parents=True, exist_ok=True)
    data = svg(w, h, body, title).encode()
    for fmt in formats:
        target = path.with_suffix('.'+fmt)
        if fmt == 'svg': target.write_bytes(data)
        elif fmt == 'png': renderer.svg2png(bytestring=data, write_to=str(target))
        elif fmt == 'pdf': renderer.svg2pdf(bytestring=data, write_to=str(target))
    ARTIFACTS.append({'name':name, 'category':category, 'title':title, 'width':w, 'height':h})


def make_logos():
    for kind in ('horizontal','vertical','symbol','wordmark'):
        for variant in ('color','ink','black','white'):
            w,h,b = logo_body(kind,variant)
            # PNG exports are large enough for document reuse, transparent throughout.
            scale = (1024 if kind == 'symbol' else 1600) / w
            export(f'tenbeltz-{kind}-{variant}', round(w*scale), round(h*scale),
                   f'<g transform="scale({scale})">{b}</g>',f'TenBeltz / {kind} / {variant}',
                   ('svg','png','pdf'), 'logos')
    for theme in ('paper','accent','ink'):
        b = rect(0,0,400,400,theme)+mark(130,120,160,'accent' if theme=='paper' else 'white')
        export(f'tenbeltz-avatar-{theme}',400,400,b,'Avatar TenBeltz','svg png'.split(),'linkedin')


ICON_PATHS = {
    'diagnostico':'M4 5h10v14H4z M7 9h4 M7 12h4 M7 15h3 M17 5a4 4 0 1 0 0 8a4 4 0 1 0 0-8 M20 12l2 3',
    'arquitectura':'M8 3h8v5H8z M3 16h7v5H3z M14 16h7v5h-7z M12 8v4 M6.5 16v-4h11v4',
    'agente':'M5 7h14v13H5z M12 3v4 M9 12h.01 M15 12h.01 M9 16h6 M2 11v5 M22 11v5',
    'integracion':'M4 5h6v6H4z M14 13h6v6h-6z M10 8h7v5 M14 16H7v-5',
    'evaluacion':'M4 3h16v18H4z M7 8l2 2l4-4 M7 15l2 2l4-4 M15 9h2 M15 16h2',
    'formacion':'M3 5h7l2 2l2-2h7v14h-7l-2 2l-2-2H3z M12 7v14 M6 9h3 M15 9h3',
    'seguridad':'M12 3l8 3v6c0 5-8 9-8 9s-8-4-8-9V6z M8 12l3 3l5-6',
    'entrega':'M3 7l9-4l9 4v12l-9 3l-9-3z M3 7l9 4l9-4 M12 11v11 M7 5l10 4',
}


def make_graphics():
    for name,d in ICON_PATHS.items():
        for theme in ('accent','ink','white'):
            b = f'<path d="{d}" stroke="{color(theme)}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
            export(f'tenbeltz-icon-{name}-{theme}',24,24,b,name,('svg',),'icons')
    w,h = 1600,900
    for theme in ('paper','ink'):
        bg, fg = theme, 'accent' if theme=='paper' else 'petal'
        b=rect(0,0,w,h,bg)
        b+='<g opacity="0.08">'+''.join(mark(x,y,80,fg) for y in range(70,h,160) for x in range(70,w,160))+'</g>'
        export(f'tenbeltz-pattern-symbol-{theme}',w,h,b,'Patrón derivado del símbolo')
    b=rect(0,0,w,h,'paper')
    for y in range(80,850,120): b+=line(80,y,1520,y)
    export('tenbeltz-background-editorial',w,h,b,'Fondo editorial con líneas')
    b=rect(0,0,w,h,'paper')
    for i in range(16):
        b+=f'<path d="M {600+i*14},900 C {200+i*28},400 {1600-i*25},600 {1120+i*9},-70" fill="none" stroke="{C["accent"]}" opacity="0.13" stroke-width="1.2"/>'
    export('tenbeltz-background-folds',w,h,b,'Pliegues abstractos vectoriales')
    export('tenbeltz-background-flower',w,h,rect(0,0,w,h,'paper')+flower(720,-90,1020),'Fondo con flor original')
    # standalone transparent floral PNG with unchanged source pixels
    Image.open(FLOWER).save(DIST/'graphics'/'tenbeltz-flower-transparent.png')
    shutil.copy2(FLOWER,DIST/'graphics'/'tenbeltz-flower-original.webp')
    b=rect(0,0,1600,420,'paper')+text_svg('FLUJO SIMPLIFICADO / PROYECTO DE IA',64,58,18,'muted','Medium',.08)
    for i,(t,s) in enumerate([('Contexto','Datos y límites'),('Definición','Criterios y alcance'),('Sistema','Construcción'),('Evaluación','Calidad y coste')]):
        x=64+i*388
        b+=rect(x,130,324,175,'surface')+text_svg(t,x+24,194,27,'ink','Medium')+text_svg(s,x+24,243,19,'muted')
        if i<3: b+=line(x+334,215,x+374,215,'accent',2)+f'<path d="M{x+366},209 l8,6 l-8,6" fill="none" stroke="{C["accent"]}" stroke-width="2"/>'
    export('tenbeltz-diagram-ai-flow',1600,420,b,'Flujo simplificado de proyecto IA')


def make_banners():
    for lang in ('es','en'):
        for personal in (False,True):
            w,h=(1584,396) if personal else (1512,256)
            x=380 if personal else 275
            b=rect(0,0,w,h,'paper')+flower(w-h*1.2,-h*.3,h*1.6)
            # All essential copy ends before the floral artwork.
            b+=logo(x,45,208 if personal else 165)
            title=['Proyectos de IA','que florecen.'] if lang=='es' else ['AI projects','that bloom.']
            y,size,leading=(162,48,56) if personal else (133,35,40)
            for i,t in enumerate(title): b+=text_svg(t,x,y+i*leading,size,'ink','Medium',-.025)
            b+=text_svg('Ingeniería de IA para empresas de software' if lang=='es' else 'AI engineering for software companies',x,h-47,20 if personal else 16,'muted')
            name=f'tenbeltz-linkedin-{"personal" if personal else "empresa"}-{lang}'
            export(name,w,h,b,'Portada LinkedIn '+lang,('svg','png'),'linkedin')
            # Overlay guides exported separately, never included in publication PNG.
            guide=b+f'<rect x="{x-24}" y="24" width="{w-x-90}" height="{h-48}" fill="none" stroke="{C["accent"]}" stroke-dasharray="8 6"/>'
            if personal: guide+=f'<rect x="0" y="190" width="340" height="206" fill="{C["accent"]}" opacity=".15"/>'
            export(name+'-guia',w,h,guide,'Guía orientativa de recorte',('svg',),'linkedin')
        b=rect(0,0,1512,256,'ink')+logo(275,44,174,'white')
        b+=text_svg('Definir. Construir. Formar.' if lang=='es' else 'Define. Build. Train.',275,153,44,'white','Medium',-.025)
        b+=text_svg(IDENTITY['positioning'][lang],275,210,18,'petal')
        export(f'tenbeltz-linkedin-empresa-editorial-{lang}',1512,256,b,'Portada LinkedIn editorial',('svg','png'),'linkedin')


def post_body(w,h,p,index=None):
    dark=p.get('dark',False)
    bg,fg,secondary=('ink','white','petal') if dark else ('paper','ink','muted')
    b=rect(0,0,w,h,bg)
    m=round(w*.07)
    b+=logo(m,m,round(w*.22),'white' if dark else 'color')
    b+=text_svg(p['label'],m,h*.27,w*.018,secondary,'Medium',.1)
    title_size=w*(.064 if w/h>.9 else .069)
    y=h*.38
    for t in p['title']:
        b+=text_svg(t,m,y,title_size,fg,'Medium',-.03); y+=title_size*1.16
    y=max(y+40,h*.65)
    for t in p['body']:
        b+=text_svg(t,m,y,w*.029,secondary); y+=w*.043
    if h/w>1.6: b+=flower(w*.30,h*.56,w*.95)
    b+=line(m,h-m-46,w-m,h-m-46,'muted' if dark else 'line')
    b+=text_svg('tenbeltz.com',m,h-m,w*.019,secondary)
    if index: b+=text_svg(f'{index:02d} / 05',w-m-115,h-m,w*.019,secondary)
    return b


def make_social():
    for p in SOCIAL['posts']:
        for w,h,fmt in ((1080,1080,'square'),(1080,1350,'portrait')):
            export(f'tenbeltz-post-{p["name"]}-{fmt}',w,h,post_body(w,h,p),p['label'],('svg','png'),'social')
    p=SOCIAL['posts'][2]
    export('tenbeltz-story-formacion',1080,1920,post_body(1080,1920,p),'Historia formación',('svg','png'),'social')
    for lang in ('es','en'):
        b=rect(0,0,1200,630,'paper')+flower(670,-20,760)+logo(70,60,230)
        title=['Proyectos de IA','que florecen.'] if lang=='es' else ['AI projects','that bloom.']
        for i,t in enumerate(title): b+=text_svg(t,70,280+i*66,58,'ink','Medium',-.025)
        b+=text_svg('Para equipos SaaS y' if lang=='es' else 'For SaaS teams and',70,465,24,'muted')
        b+=text_svg('consultoras de software.' if lang=='es' else 'software consultancies.',70,500,24,'muted')
        b+=text_svg('tenbeltz.com',70,575,18,'muted')
        export(f'tenbeltz-og-{lang}',1200,630,b,'Imagen para compartir enlaces',('svg','png'),'web')
        export(f'tenbeltz-link-post-{lang}',1200,627,b,'Publicación de enlace',('svg','png'),'social')
    pdf=canvas.Canvas(str(DIST/'social'/'tenbeltz-carousel-evaluacion.pdf'),pagesize=(540,675))
    for i,p in enumerate(SOCIAL['carousel'],1):
        export(f'tenbeltz-carousel-evaluacion-{i:02d}',1080,1350,post_body(1080,1350,p,i),'Carrusel evaluación '+str(i),('svg','png'),'social')
        pdf.drawImage(str(DIST/'social'/f'tenbeltz-carousel-evaluacion-{i:02d}.png'),0,0,540,675)
        pdf.showPage()
    pdf.save()


def make_web():
    for size in (16,32,48,96,180,192,512):
        b=rect(0,0,size,size,'paper')+mark(size*.29,size*.26,size*.48,'accent')
        export(f'tenbeltz-icon-{size}',size,size,b,'Icono TenBeltz',('png',),'web')
    export('tenbeltz-favicon',64,64,rect(0,0,64,64,'paper')+mark(18.5,16.6,30.7),'Favicon TenBeltz',('svg',),'web')
    Image.open(DIST/'web'/'tenbeltz-icon-96.png').save(DIST/'web'/'tenbeltz-favicon.ico',sizes=[(16,16),(32,32),(48,48)])
    (DIST/'web'/'site.webmanifest').write_text(json.dumps({'name':'TenBeltz','short_name':'TenBeltz','start_url':'/','display':'standalone','background_color':C['paper'],'theme_color':C['paper'],'icons':[{'src':f'tenbeltz-icon-{s}.png','sizes':f'{s}x{s}','type':'image/png'} for s in (192,512)]},indent=2))
    tokens={'primitive':{'color':C,'font':IDENTITY['font'],'space':[4,8,16,24,32,48,64,96]},'semantic':{'background':'{primitive.color.paper}','text':'{primitive.color.ink}','textSecondary':'{primitive.color.muted}','action':'{primitive.color.accent}','border':'{primitive.color.line}'},'component':{'button':{'background':'{semantic.action}','text':'{primitive.color.white}','radius':'3px','padding':'15px 22px'},'focus':{'color':'{semantic.action}','width':'2px','offset':'5px'}}}
    (DIST/'web'/'design-tokens.json').write_text(json.dumps(tokens,ensure_ascii=False,indent=2))
    css=':root {\n'+''.join(f'  --color-{k}: {v};\n' for k,v in C.items())
    css+='  --font-brand: "IBM Plex Sans", Arial, sans-serif;\n  --slide-bg: var(--color-paper);\n  --slide-text: var(--color-ink);\n  --button-bg: var(--color-accent);\n  --button-text: var(--color-white);\n  --radius-small: 3px;\n}\n'
    (DIST/'web'/'design-tokens.css').write_text(css)


def make_stationery():
    d=DIST/'documents'; d.mkdir(exist_ok=True)
    for personal in (False,True):
        name='Aritz' if personal else 'TenBeltz'
        signature=f'''<!doctype html><html lang="es"><meta charset="utf-8"><title>Firma {name}</title><body><table role="presentation" cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;color:{C['ink']};font-size:14px"><tr><td style="padding:0 0 9px;font-size:20px;font-weight:bold">{name}{'.' if not personal else ' / TenBeltz'}</td></tr><tr><td style="padding-bottom:10px;color:{C['muted']}">{'Dirección técnica · ' if personal else ''}Ingeniería de IA para empresas de software</td></tr><tr><td style="border-top:1px solid {C['line']};padding-top:10px"><a style="color:{C['accent']}" href="mailto:hello@tenbeltz.com">hello@tenbeltz.com</a> · <a style="color:{C['accent']}" href="https://tenbeltz.com">tenbeltz.com</a></td></tr></table></body></html>'''
        (d/f'tenbeltz-email-signature-{name.lower()}.html').write_text(signature)
    body=f'''<header><img src="../logos/tenbeltz-horizontal-color.svg" alt="TenBeltz"><span>PROPUESTA / [FECHA]</span></header><h1>[Título del proyecto]</h1><p class="lead">[Cliente] · [Versión] · [Responsable]</p><section><h2>Contexto y objetivo</h2><p>[Situación del producto, usuarios y resultado esperado.]</p></section><section><h2>Alcance y entregables</h2><p>[Qué se construirá, qué queda fuera y cómo se validará cada entregable.]</p></section><section><h2>Calendario y responsabilidades</h2><p>[Fases, dependencias, interlocutores y responsabilidades del cliente y de TenBeltz.]</p></section><section><h2>Condiciones y siguiente paso</h2><p>[Importes, impuestos, validez, aceptación y condiciones acordadas. Completar antes de enviar.]</p></section><footer>TenBeltz · hello@tenbeltz.com · tenbeltz.com<br>Plantilla editable: completar los campos entre corchetes.</footer>'''
    css=f'''@font-face{{font-family:Plex;src:url('../../source/fonts/ibm-plex-sans-latin.woff2')}}*{{box-sizing:border-box}}body{{font-family:Plex,Arial,sans-serif;color:{C['ink']};background:{C['paper']};max-width:794px;margin:auto;padding:65px}}header{{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid {C['line']};padding-bottom:25px}}header img{{width:160px}}header span{{font-size:11px;letter-spacing:.1em;color:{C['muted']}}}h1{{font-size:40px;font-weight:500;letter-spacing:-.04em;margin:48px 0 20px}}.lead{{color:{C['muted']}}}section{{margin-top:30px}}h2{{font-size:20px;font-weight:500}}p{{line-height:1.65;font-size:14px}}footer{{border-top:1px solid {C['line']};padding-top:20px;margin-top:50px;font-size:11px;color:{C['muted']}}}@page{{size:A4;margin:0}}@media print{{body{{padding:55px}}}}'''
    (d/'tenbeltz-proposal-template.html').write_text(f'<!doctype html><html lang="es"><meta charset="utf-8"><title>Plantilla de propuesta TenBeltz</title><style>{css}</style><body>{body}</body></html>')
    report=body.replace('PROPUESTA','INFORME').replace('Contexto y objetivo','Resumen y objetivo').replace('Alcance y entregables','Método y alcance').replace('Calendario y responsabilidades','Resultados y límites').replace('Condiciones y siguiente paso','Conclusiones y siguientes pasos').replace('[Importes, impuestos, validez, aceptación y condiciones acordadas. Completar antes de enviar.]','[Decisiones recomendadas y tareas con responsable. No añadir métricas sin fuente.]')
    (d/'tenbeltz-report-template.html').write_text(f'<!doctype html><html lang="es"><meta charset="utf-8"><title>Plantilla de informe TenBeltz</title><style>{css}</style><body>{report}</body></html>')
    # Native PDF A4 templates, identical typographic system.
    for kind,sections in [('proposal',['Contexto y objetivo','Alcance y entregables','Calendario y responsabilidades','Condiciones y siguiente paso']),('report',['Resumen y objetivo','Método y alcance','Resultados y límites','Conclusiones y siguientes pasos'])]:
        doc=Document()
        sec=doc.sections[0];sec.page_width=DocMm(210);sec.page_height=DocMm(297)
        sec.top_margin=sec.bottom_margin=DocMm(20);sec.left_margin=sec.right_margin=DocMm(20)
        normal=doc.styles['Normal'];normal.font.name=IDENTITY['font'];normal.font.size=DocPt(11)
        normal.font.color.rgb=DocColor.from_string(C['ink'][1:]);normal.paragraph_format.line_spacing=1.5
        for style,size in [('Title',30),('Heading 1',18)]:
            doc.styles[style].font.name=IDENTITY['font'];doc.styles[style].font.size=DocPt(size)
            doc.styles[style].font.color.rgb=DocColor.from_string(C['ink'][1:])
        sec.header.paragraphs[0].add_run().add_picture(str(DIST/'logos'/'tenbeltz-horizontal-color.png'),width=DocMm(45))
        doc.add_paragraph('[Título del proyecto]','Title')
        doc.add_paragraph('[Cliente] / [Versión] / [Fecha]')
        for title in sections:
            doc.add_heading(title,1)
            doc.add_paragraph('[Completar con el contexto, los datos y las condiciones acordadas para este documento.]')
        sec.footer.paragraphs[0].text='TenBeltz / hello@tenbeltz.com / tenbeltz.com'
        sec.footer.paragraphs[0].style=doc.styles['Normal']
        doc.core_properties.author='TenBeltz';doc.core_properties.title='TenBeltz / '+kind
        doc.save(d/f'tenbeltz-{kind}-template.docx')
        p=canvas.Canvas(str(d/f'tenbeltz-{kind}-template.pdf'),pagesize=(595.276,841.89))
        pdf_bg(p,595.276,841.89)
        pdf_logo(p,48,40,155,841.89)
        pdf_text(p,'PROPUESTA' if kind=='proposal' else 'INFORME',445,61,10,'muted',H=841.89)
        pdf_line(p,48,105,547,105,H=841.89)
        pdf_para(p,'[Título del proyecto]',48,150,495,32,H=841.89,weight='Medium')
        pdf_text(p,'[Cliente] / [Versión] / [Fecha]',48,220,12,'muted',H=841.89)
        for i,t in enumerate(sections):
            y=285+i*102
            pdf_text(p,t,48,y,17,weight='Medium',H=841.89)
            pdf_para(p,'[Completar con el contexto, los datos y las condiciones acordadas para este documento.]',48,y+23,460,11,'muted',H=841.89)
        pdf_line(p,48,738,547,738,H=841.89)
        pdf_text(p,'TenBeltz / hello@tenbeltz.com / tenbeltz.com',48,770,10,'muted',H=841.89)
        p.save()
    # Card: 85 x 55 mm + 3 mm bleed, crop marks outside trim, two pages.
    mm=72/25.4; bleed=3*mm; trim_w,trim_h=85*mm,55*mm; slug=5*mm
    w,h=trim_w+2*(bleed+slug),trim_h+2*(bleed+slug)
    p=canvas.Canvas(str(d/'tenbeltz-business-card-print.pdf'),pagesize=(w,h))
    for back in (False,True):
        pdf_bg(p,w,h,'accent' if back else 'paper')
        x0,y0=slug+bleed,slug+bleed
        p.setTrimBox((x0,y0,x0+trim_w,y0+trim_h))
        p.setBleedBox((slug,slug,w-slug,h-slug))
        if back:
            pdf_logo(p,x0+28,y0+35,185,h,'white')
            pdf_text(p,'Proyectos de IA que florecen',x0+28,y0+114,9,'white',H=h)
        else:
            pdf_logo(p,x0+16,y0+16,104,h)
            pdf_text(p,'Aritz / Dirección técnica',x0+16,y0+75,11,weight='Medium',H=h)
            pdf_text(p,IDENTITY['email'],x0+16,y0+97,9,'muted',H=h)
            pdf_text(p,IDENTITY['website'],x0+16,y0+113,9,'muted',H=h)
            pdf_text(p,IDENTITY['phone'],x0+16,y0+129,9,'muted',H=h)
        p.setStrokeColor(HexColor(C['ink'])); p.setLineWidth(.3)
        for x in (x0,x0+trim_w):
            for y in (y0,y0+trim_h):
                # marks stop before the bleed boundary
                sign_x=-1 if x==x0 else 1; sign_y=-1 if y==y0 else 1
                p.line(x+sign_x*bleed,y,x+sign_x*(bleed+slug*.7),y)
                p.line(x,y+sign_y*bleed,x,y+sign_y*(bleed+slug*.7))
        p.showPage()
    p.save()
    export('tenbeltz-business-card-front',1004,650,rect(0,0,1004,650,'paper')+logo(65,65,420)+text_svg('Aritz / Dirección técnica',65,330,44,'ink','Medium')+text_svg(IDENTITY['email'],65,420,34,'muted')+text_svg(IDENTITY['website'],65,480,34,'muted')+text_svg(IDENTITY['phone'],65,540,34,'muted'),'Tarjeta / anverso',('svg','png'),'documents')
    export('tenbeltz-business-card-back',1004,650,rect(0,0,1004,650,'accent')+logo(125,220,750,'white')+text_svg(IDENTITY['tagline']['es'],125,435,34,'white'),'Tarjeta / reverso',('svg','png'),'documents')


def pdf_bg(p,w=842,h=595,theme='paper'):
    p.setFillColor(HexColor(color(theme))); p.rect(0,0,w,h,fill=1,stroke=0)


def pdf_text(p,s,x,y,size=12,fill='ink',weight='Regular',H=595):
    p.setFont('Plex'+weight,size); p.setFillColor(HexColor(color(fill))); p.drawString(x,H-y,s)


def pdf_para(p,s,x,y,width,size=11.5,fill='ink',weight='Regular',H=595):
    style=ParagraphStyle('body',fontName='Plex'+weight,fontSize=size,leading=size*1.55,textColor=HexColor(color(fill)))
    para=Paragraph(xml(s).replace('\n','<br/>'),style)
    _,height=para.wrap(width,1000)
    if y+height>H-35: raise ValueError(f'PDF paragraph overflows: {s[:50]}')
    para.drawOn(p,x,H-y-height)
    return height


def pdf_line(p,x,y,x2,y2,fill='line',H=595):
    p.setStrokeColor(HexColor(color(fill)));p.setLineWidth(.7);p.line(x,H-y,x2,H-y2)


def pdf_image(p,path,x,y,w,h,H=595):
    p.drawImage(ImageReader(str(path)),x,H-y-h,w,h,mask='auto',preserveAspectRatio=True,anchor='c')


def pdf_logo(p,x,y,w,H=595,variant='color',kind='horizontal'):
    a,b,_=logo_body(kind,variant)
    pdf_image(p,DIST/'logos'/f'tenbeltz-{kind}-{variant}.png',x,y,w,w*b/a,H)


def pdf_box(p,x,y,w,h,fill='surface',H=595):
    p.setFillColor(HexColor(color(fill)));p.rect(x,H-y-h,w,h,fill=1,stroke=0)


def luminance(hex_color):
    rgb=[int(hex_color[i:i+2],16)/255 for i in (1,3,5)]
    rgb=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in rgb]
    return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]


def contrast(a,b):
    hi,lo=sorted([luminance(color(a)),luminance(color(b))],reverse=True)
    return (hi+.05)/(lo+.05)


def illustration(p,visual,index):
    x,y,w,h=365,190,435,330
    def img(category,name,yy=y,hh=210):
        path=DIST/category/(name+'.png'); im=Image.open(path)
        scale=min(w/im.width,hh/im.height)
        pdf_image(p,path,x,yy,im.width*scale,im.height*scale)
    if visual=='contents':
        for i,t in enumerate(['01  Fundamentos / 03–04','02  Logotipo / 05–08','03  Color / 09–10','04  Tipografía / 11–12','05  Lenguaje gráfico / 13–17','06  Aplicaciones / 18–22','07 Mensajes / 23–25','08  Biblioteca / 26–28','09  Ejemplos y mockups / 29–30']):
            pdf_text(p,t,x,y+24+i*34,16,'ink','Medium'); pdf_line(p,x,y+34+i*34,x+w,y+34+i*34)
    elif visual in ('logo','position'):
        pdf_box(p,x,y,w,210)
        pdf_logo(p,x+42,y+65,w-84)
        pdf_text(p,'Símbolo original + nombre + punto',x,y+252,13,'muted')
        if visual=='position':pdf_para(p,'Fiabilidad / Rendimiento / Coste',x,y+281,w,22,'accent','Medium')
    elif visual=='variants':
        pdf_logo(p,x+20,y+12,330);pdf_logo(p,x+45,y+116,160,kind='vertical');pdf_logo(p,x+284,y+144,65,kind='symbol')
        pdf_text(p,'Horizontal',x+20,y+92,11,'muted');pdf_text(p,'Vertical',x+45,y+255,11,'muted');pdf_text(p,'Símbolo',x+276,y+255,11,'muted')
    elif visual=='clearspace':
        pdf_box(p,x,y+40,w,190)
        pdf_logo(p,x+38,y+88,w-76)
        p.setStrokeColor(HexColor(C['accent']));p.setDash(3,3);p.rect(x+20,595-y-210,w-40,155,stroke=1,fill=0);p.setDash()
        pdf_text(p,'x',x+22,y+78,13,'accent')
        pdf_logo(p,x,y+272,120);pdf_logo(p,x+190,y+272,20,kind='symbol')
        pdf_text(p,'120 px',x,y+319,11,'muted');pdf_text(p,'20 px',x+187,y+319,11,'muted')
    elif visual=='backgrounds':
        for i,(bg,v) in enumerate([('paper','color'),('accent','white'),('ink','white'),('surface','black')]):
            xx=x+(i%2)*225;yy=y+(i//2)*155;pdf_box(p,xx,yy,210,130,bg);pdf_logo(p,xx+18,yy+38,174,variant=v)
    elif visual=='palette':
        for i,name in enumerate(['paper','ink','accent','muted','line','surface','petal','accentHover']):
            xx=x+(i%2)*225;yy=y+(i//2)*78
            pdf_box(p,xx,yy,52,52,name);pdf_text(p,name,xx+64,yy+17,12,weight='Medium');pdf_text(p,C[name].upper(),xx+64,yy+36,11,'muted')
    elif visual=='contrast':
        for i,(fg,bg) in enumerate([('ink','paper'),('accent','paper'),('muted','paper'),('white','accent'),('white','ink')]):
            yy=y+i*59;pdf_box(p,x,yy,w,49,bg);pdf_text(p,f'{fg} / {bg}     {contrast(fg,bg):.2f}:1',x+18,yy+31,15,fg,'Medium')
    elif visual=='type':
        pdf_text(p,'IBM Plex Sans',x,y+40,40,weight='Medium')
        pdf_text(p,'Aa Bb Cc Dd Ee Ff Gg',x,y+115,28)
        pdf_text(p,'Á É Í Ó Ú Ñ / á é í ó ú ñ',x,y+159,23)
        pdf_text(p,'0123456789  !? / @ + %',x,y+200,24)
        for i,weight in enumerate(('Regular','Medium','SemiBold')):pdf_text(p,weight+' / Ingeniería de IA',x,y+248+i*29,17,weight=weight)
    elif visual=='grid':
        pdf_box(p,x,y,w,280,'surface')
        for i in range(12):pdf_box(p,x+15+i*34,y+15,25,250,'line')
        pdf_box(p,x+15,y+34,393,65,'paper');pdf_text(p,'Una idea principal.',x+30,y+78,26,weight='Medium')
        pdf_box(p,x+15,y+128,121,95,'paper');pdf_box(p,x+151,y+128,257,95,'paper')
        pdf_text(p,'12 columnas / márgenes compartidos',x,y+315,13,'muted')
    elif visual in ('flower','photo'):
        if visual=='flower': pdf_image(p,FLOWER,x,y-20,w,360)
        else:
            pdf_box(p,x,y,w,240,'surface');pdf_para(p,'Contexto\nContribución\nEvidencia',x+35,y+37,w-70,30,'ink','Medium');pdf_text(p,'Imagen real o ilustración etiquetada',x,y+282,13,'muted')
    elif visual=='patterns':
        for i,n in enumerate(['tenbeltz-pattern-symbol-paper','tenbeltz-background-editorial','tenbeltz-background-folds']):img('graphics',n,y+i*108,94)
    elif visual=='icons':
        for i,(name,d) in enumerate(ICON_PATHS.items()):
            xx=x+(i%4)*110;yy=y+(i//4)*100
            data=svg(48,48,f'<g transform="scale(2)"><path d="{d}" stroke="{C["accent"]}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>',name).encode()
            png=renderer.svg2png(bytestring=data)
            p.drawImage(ImageReader(io.BytesIO(png)),xx,595-yy-40,40,40,mask='auto')
            pdf_text(p,name,xx,yy+65,11,'muted')
        img('graphics','tenbeltz-diagram-ai-flow',y+228,110)
    elif visual=='motion':
        for i,t in enumerate(['Nacimiento / 3,8 s','Brisa / sutil','Pausa / fuera de vista','Accesibilidad / estático']):
            yy=y+i*78;pdf_text(p,f'0{i+1}',x,yy+22,15,'accent','Medium');pdf_text(p,t,x+55,yy+22,20,weight='Medium');pdf_line(p,x,yy+45,x+w,yy+45)
    elif visual=='linkedin':
        img('linkedin','tenbeltz-linkedin-empresa-es',y,95);img('linkedin','tenbeltz-linkedin-personal-es',y+125,125)
        pdf_text(p,'Dos composiciones / dos proporciones',x,y+293,13,'muted')
    elif visual=='social':
        for i,n in enumerate(['tenbeltz-post-idea-tecnica-portrait','tenbeltz-post-servicios-portrait','tenbeltz-carousel-evaluacion-01']):
            pdf_image(p,DIST/'social'/(n+'.png'),x+i*148,y,137,171.25)
        pdf_para(p,'Título breve.\nUna idea por pieza.\nCriterios con contexto.',x,y+205,w,24,'ink','Medium')
    elif visual=='web':
        img('web','tenbeltz-og-es',y,226)
        pdf_image(p,DIST/'web'/'tenbeltz-icon-96.png',x,y+258,60,60);pdf_text(p,'Iconos y tokens listos para integrar',x+80,y+293,14,'muted')
    elif visual=='deck':
        pdf_box(p,x,y,w,245,'surface');pdf_logo(p,x+24,y+23,125)
        pdf_para(p,'Proyectos de IA\nque florecen.',x+24,y+93,250,27,'ink','Medium')
        pdf_image(p,FLOWER,x+270,y+36,165,195)
        pdf_text(p,'PPTX editable / HTML / PDF',x,y+288,14,'muted')
    elif visual=='stationery':
        pdf_box(p,x,y,200,285,'white');pdf_logo(p,x+18,y+20,125);pdf_text(p,'[Título del proyecto]',x+18,y+97,14,weight='Medium')
        for i in range(7):pdf_line(p,x+18,y+130+i*18,x+180,y+130+i*18)
        pdf_box(p,x+230,y+50,205,132,'accent');pdf_logo(p,x+246,y+91,174,variant='white');pdf_text(p,'A4 / Tarjeta / Firma',x+230,y+233,13,'muted')
    elif visual in ('voice','messages'):
        pdf_box(p,x,y,w,290,'surface')
        pdf_para(p,'Definir con claridad.\nConstruir con criterio.\nEntregar con evidencia.' if visual=='voice' else 'Proyectos de IA\nque florecen.\n\nAI projects\nthat bloom.',x+26,y+32,w-52,27,'accent','Medium')
    elif visual=='services':
        for i,(t,s) in enumerate([('Definir','Diagnóstico y fundamentos'),('Construir','MVP e integración'),('Formar','IA aplicada al equipo')]):
            yy=y+i*104;pdf_text(p,t,x,yy+26,28,'accent','Medium');pdf_text(p,s,x,yy+60,15,'muted');pdf_line(p,x,yy+81,x+w,yy+81)
    elif visual in ('evidence','checklist'):
        items=['Fuente verificable','Relación atribuida','Permiso de uso','Muestra y alcance','Datos protegidos'] if visual=='evidence' else ['Identidad y contraste','Contenido y atribución','Recortes y fuentes','Imprenta y color','Versión y registro']
        for i,t in enumerate(items):
            yy=y+i*61;pdf_box(p,x,yy+2,22,22,'accent');pdf_text(p,'+',x+6,yy+19,17,'white');pdf_text(p,t,x+43,yy+20,18,weight='Medium')
    elif visual=='library':
        for i,(t,s) in enumerate([('source/','Identidad, contenidos y originales'),('dist/','Recursos listos para usar'),('tools/brand-kit/','Código del generador'),('index.html','Galería y descargas'),('manifest.json','Inventario y huellas SHA-256')]):
            yy=y+i*62;pdf_text(p,t,x,yy+17,18,'accent','Medium');pdf_text(p,s,x,yy+41,12,'muted')
    elif visual=='credits':
        pdf_logo(p,x,y+30,w-35);pdf_para(p,'Edición 2026.10\nTenBeltz / Beltz Dev SL\n\nhello@tenbeltz.com\ntenbeltz.com',x,y+148,w,21,'muted')


def make_book():
    path=DIST/'documents'/'tenbeltz-brandbook.pdf'
    p=canvas.Canvas(str(path),pagesize=(842,595),pageCompression=1)
    p.setTitle('TenBeltz / Brandbook 2026.10');p.setAuthor('TenBeltz')
    for i,page in enumerate(BOOK,1):
        pdf_bg(p)
        if page['visual']=='cover':
            pdf_logo(p,48,40,200);pdf_image(p,FLOWER,380,10,470,540)
            pdf_text(p,'MANUAL DE IDENTIDAD',48,161,11,'muted','Medium')
            pdf_para(p,'Una identidad\nque florece.',48,216,450,48,'ink','Medium')
            pdf_para(p,'Ingeniería de IA para\nempresas de software.',48,391,320,20,'muted')
            pdf_text(p,'2026.10 / Brandbook y biblioteca de recursos',48,546,11,'muted')
        else:
            pdf_text(p,'TENBELTZ / BRAND SYSTEM',42,39,9,'muted','Medium');pdf_text(p,page['section'].upper(),365,39,9,'muted','Medium')
            pdf_line(p,42,57,800,57)
            pdf_para(p,page['title'],42,85,745,32,'ink','Medium')
            yy=190
            for t in page['text']:
                yy+=pdf_para(p,t,42,yy,285,11.1,'muted')+14
            illustration(p,page['visual'],i)
            pdf_line(p,42,549,800,549)
            pdf_text(p,'TenBeltz / Edición 2026.10',42,572,9,'muted');pdf_text(p,f'{i:02d} / {len(BOOK):02d}',751,572,9,'muted')
        p.showPage()
    p.save()
    # Editable content source in an ordinary reading format as well as JSON.
    (KIT/'BRANDBOOK.md').write_text('# TenBeltz · Brandbook 2026.10\n\n'+ '\n\n'.join('## '+p['section']+' · '+p['title']+'\n\n'+'\n\n'.join(p['text']) for p in BOOK)+'\n')


def ppt_text(slide,s,x,y,w,h,size=20,fill='ink',bold=False):
    shape=slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf=shape.text_frame;tf.clear();tf.word_wrap=True
    tf.margin_left=tf.margin_right=0;tf.margin_top=tf.margin_bottom=0
    for i,t in enumerate(s.split('\n')):
        par=tf.paragraphs[0] if i==0 else tf.add_paragraph()
        par.text=t;par.font.name=IDENTITY['font'];par.font.size=Pt(size);par.font.bold=bold
        par.font.color.rgb=RGBColor.from_string(color(fill).strip('#'));par.space_after=Pt(6)
    return shape


def ppt_box(slide,x,y,w,h,fill='surface'):
    sh=slide.shapes.add_shape(MSO_SHAPE.RECTANGLE,Inches(x),Inches(y),Inches(w),Inches(h))
    sh.fill.solid();sh.fill.fore_color.rgb=RGBColor.from_string(color(fill).strip('#'));sh.line.fill.background()
    return sh


def make_pptx(data,name):
    prs=Presentation();prs.slide_width=Inches(13.3333);prs.slide_height=Inches(7.5)
    # Update actual theme defaults, so text inserted by the user uses Plex too.
    for rel in prs.slide_masters[0].part.rels.values():
        if rel.reltype.endswith('/theme'):
            root=ET.fromstring(rel.target_part.blob)
            for el in root.iter():
                if el.tag.endswith('latin'):el.set('typeface',IDENTITY['font'])
            rel.target_part._blob=ET.tostring(root,encoding='utf-8',xml_declaration=True)
    for i,d in enumerate(data,1):
        sl=prs.slides.add_slide(prs.slide_layouts[6]);dark=d['kind'] in ('section','close')
        bg,fg,muted=('ink','white','petal') if dark else ('paper','ink','muted')
        sl.background.fill.solid();sl.background.fill.fore_color.rgb=RGBColor.from_string(C[bg][1:])
        sl.shapes.add_picture(str(DIST/'logos'/f'tenbeltz-horizontal-{"white" if dark else "color"}.png'),Inches(.65),Inches(.48),width=Inches(2.1))
        ppt_text(sl,IDENTITY['website'],10.5,.59,2.1,.3,11,muted)
        title_y=2.0 if d['kind'] in ('cover','section','close') else 1.5
        title_w=7.6 if d['kind']=='cover' else 11.8
        title_size=42 if d['kind'] in ('cover','section','close') else 32
        ppt_text(sl,d['title'],.65,title_y,title_w,1.9,title_size,fg)
        if 'subtitle' in d:
            ppt_text(sl,d['subtitle'],.65,4.25 if d['kind'] in ('cover','section','close') else 2.6,7.5,1.3,20,muted)
        if d['kind'] in ('cover','image'):
            if d['kind']=='cover':sl.shapes.add_picture(str(DIST/'graphics'/'tenbeltz-flower-transparent.png'),Inches(8.0),Inches(1.2),width=Inches(5.1))
            else:
                ppt_box(sl,3.0,3.5,9.6,2.8)
                ppt_text(sl,'[Insertar imagen autorizada / mantener proporciones]',3.35,4.5,8.9,1.0,20,'muted')
        if 'blocks' in d:
            n=len(d['blocks']);gap=.35;bw=(12.03-gap*(n-1))/n
            for j,(t,s) in enumerate(d['blocks']):
                xx=.65+j*(bw+gap)
                ppt_box(sl,xx,3.25,bw,2.7)
                ppt_text(sl,t,xx+.20,3.53,bw-.4,.75,22,'accent')
                ppt_text(sl,s,xx+.20,4.42,bw-.4,1.25,18,'muted')
        if d['kind']=='table':
            table=sl.shapes.add_table(len(d['rows']),3, Inches(.65), Inches(3.25), Inches(12.03), Inches(2.85)).table
            for r,row in enumerate(d['rows']):
                for j,t in enumerate(row):
                    cell=table.cell(r,j);cell.text=t;cell.fill.solid();cell.fill.fore_color.rgb=RGBColor.from_string(C['accent' if r==0 else 'surface'][1:])
                    for para in cell.text_frame.paragraphs:
                        para.font.name=IDENTITY['font'];para.font.size=Pt(18);para.font.color.rgb=RGBColor.from_string(C['white' if r==0 else 'ink'][1:])
        if d['kind']=='metric':ppt_text(sl,d['value'],.65,3.8,10,1.4,66,'accent')
        ppt_box(sl,.65,6.8,12.03,.01,'muted' if dark else 'line')
        ppt_text(sl,'TENBELTZ / 2026.10',.65,7.02,5,.2,10,muted)
        ppt_text(sl,f'{i:02d} / {len(data):02d}',11.7,7.02,1,.2,10,muted)
        sl.notes_slide.notes_text_frame.text='TenBeltz · 2026.10. Contenido editable. Instalar IBM Plex Sans desde source/fonts. '+('Plantilla: sustituir todos los campos entre corchetes; documentar fuente y alcance de las métricas.' if name=='template' else 'Mensajes basados en el posicionamiento y responsabilidades documentados del sitio. No incluye métricas de clientes.')
    prs.core_properties.title='TenBeltz / '+name;prs.core_properties.author='TenBeltz'
    prs.save(DIST/'presentations'/f'tenbeltz-{name}.pptx')


def make_slide_svg(d,i,n):
    w,h=1600,900;dark=d['kind'] in ('section','close');bg,fg,secondary=('ink','white','petal') if dark else ('paper','ink','muted')
    b=rect(0,0,w,h,bg)+logo(78,58,252,'white' if dark else 'color')+text_svg(IDENTITY['website'],1270,98,18,secondary)
    y=310 if d['kind'] in ('cover','section','close') else 230
    size=64 if d['kind'] in ('cover','section','close') else 52
    for t in d['title'].split('\n'):b+=text_svg(t,78,y,size,fg,'Medium',-.03);y+=size*1.2
    if 'subtitle' in d:
        yy=530 if d['kind'] in ('cover','section','close') else 322
        for t in wrap_text(d['subtitle'],58):b+=text_svg(t,78,yy,28,secondary);yy+=42
    if d['kind']=='cover':b+=flower(935,125,655)
    if 'blocks' in d:
        nblocks=len(d['blocks']);bw=(1444-42*(nblocks-1))/nblocks
        for j,(t,s) in enumerate(d['blocks']):
            x=78+j*(bw+42);b+=rect(x,390,bw,325,'surface')+text_svg(t,x+24,448,32,'accent','Medium')
            yy=530
            for t in wrap_text(s,int((bw-48)/15)):b+=text_svg(t,x+24,yy,26,'muted');yy+=39
    if d['kind']=='table':
        for irow,row in enumerate(d['rows']):
            for j,t in enumerate(row):
                x=78+j*481;yrow=390+irow*85;b+=rect(x,yrow,478,82,'accent' if irow==0 else 'surface')+text_svg(t,x+20,yrow+53,27,'white' if irow==0 else 'ink')
    if d['kind']=='metric':b+=text_svg(d['value'],78,650,95,'accent','Medium')
    if d['kind']=='image':b+=rect(370,415,1150,280,'surface')+text_svg('[Insertar imagen autorizada]',400,565,32,'muted')
    b+=line(78,816,1522,816,'muted' if dark else 'line')+text_svg('TENBELTZ / 2026.10',78,856,16,secondary)+text_svg(f'{i:02d} / {n:02d}',1420,856,16,secondary)
    return b


def wrap_text(text,chars):
    out=[]
    for paragraph in text.split('\n'):
        current=''
        for word in paragraph.split():
            if len(current+' '+word)>chars and current:out.append(current);current=word
            else:current=(current+' '+word).strip()
        if current:out.append(current)
    return out


def make_presentations():
    d=DIST/'presentations';d.mkdir(exist_ok=True)
    for name,data in SLIDES.items():
        make_pptx(data,name)
        pdf=canvas.Canvas(str(d/f'tenbeltz-{name}.pdf'),pagesize=(960,540))
        imgs=[]
        for i,s in enumerate(data,1):
            b=make_slide_svg(s,i,len(data));n=f'tenbeltz-{name}-{i:02d}'
            export(n,1600,900,b,s['title'],('svg','png'),'presentations/previews')
            path=d/'previews'/(n+'.png');pdf.drawImage(str(path),0,0,960,540);pdf.showPage()
            imgs.append(f'<section class="slide" aria-label="{i}: {xml(s["title"])}"><img src="previews/{n}.svg" alt="{xml(s["title"])}"></section>')
        pdf.save()
        css='''*{box-sizing:border-box}body{margin:0;background:var(--color-ink);font-family:var(--font-brand)}.slide{display:none;height:calc(100vh - 64px);text-align:center}.slide.active{display:flex;align-items:center;justify-content:center}.slide img{max-width:100%;max-height:100%}nav{height:64px;display:flex;gap:24px;align-items:center;justify-content:center;color:var(--color-white)}button{padding:10px 20px;cursor:pointer}progress{width:160px}@media print{nav{display:none}.slide,.slide.active{display:block;height:auto;break-after:page}.slide img{width:100%}}'''
        js='''let i=0;const s=[...document.querySelectorAll('.slide')],p=document.querySelector('progress'),counter=document.querySelector('#counter');function show(){s.forEach((e,j)=>e.classList.toggle('active',j===i));p.value=i+1;p.max=s.length;counter.textContent=`${i+1} / ${s.length}`;}document.querySelector('#prev').onclick=()=>{i=Math.max(0,i-1);show()};document.querySelector('#next').onclick=()=>{i=Math.min(s.length-1,i+1);show()};document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){i=Math.min(s.length-1,i+1);show()}if(e.key==='ArrowLeft'){i=Math.max(0,i-1);show()}});show();'''
        (d/f'tenbeltz-{name}.html').write_text(f'<!doctype html><html lang="{"en" if name=="en" else "es"}"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>TenBeltz / {name}</title><link rel="stylesheet" href="../web/design-tokens.css"><style>{css}</style><body>'+''.join(imgs)+f'<nav><button id="prev" aria-label="Anterior">←</button><span id="counter"></span><progress aria-label="Progreso"></progress><button id="next" aria-label="Siguiente">→</button></nav><script>{js}</script></body></html>')


def make_previews():
    d=DIST/'documents'/'previews';d.mkdir(exist_ok=True)
    book=fitz.open(DIST/'documents'/'tenbeltz-brandbook.pdf')
    thumbs=[]
    for i,page in enumerate(book,1):
        pix=page.get_pixmap(matrix=fitz.Matrix(1,1),alpha=False);out=d/f'brandbook-{i:02d}.png';pix.save(out)
        im=Image.open(out);im.thumbnail((421,298));thumbs.append(im.copy())
    sheet=Image.new('RGB',(421*4,318*math.ceil(len(thumbs)/4)),C['surface']);draw=ImageDraw.Draw(sheet)
    font=ImageFont.truetype(str(SOURCE/'fonts'/'IBMPlexSans-Regular.ttf'),13)
    for i,im in enumerate(thumbs):
        xx=(i%4)*421;yy=(i//4)*318;sheet.paste(im,(xx,yy));draw.text((xx+8,yy+299),f'{i+1:02d} / {BOOK[i]["section"]}',fill=C['ink'],font=font)
    sheet.save(KIT/'brandbook-contact-sheet.jpg',quality=90)
    # PowerPoint slides are previewed from source layouts. Native rendering is separate.
    pics=[]
    for n in ['linkedin/tenbeltz-linkedin-empresa-es','linkedin/tenbeltz-linkedin-personal-es','social/tenbeltz-post-idea-tecnica-portrait','social/tenbeltz-post-servicios-portrait','documents/tenbeltz-business-card-front','presentations/previews/tenbeltz-es-01']:
        im=Image.open(DIST/(n+'.png')).convert('RGB');im.thumbnail((800,390));pics.append((n,im.copy()))
    sheet=Image.new('RGB',(1600,3*440),C['surface']);draw=ImageDraw.Draw(sheet)
    for i,(n,im) in enumerate(pics):
        xx=(i%2)*800;yy=(i//2)*440;sheet.paste(im,(xx+(800-im.width)//2,yy));draw.text((xx+20,yy+405),n,fill=C['ink'],font=font)
    sheet.save(KIT/'applications-contact-sheet.jpg',quality=92)


def make_gallery():
    groups={}
    for a in ARTIFACTS:
        if a['category'].endswith('previews') or a['name'].endswith('-guia'):continue
        groups.setdefault(a['category'],[]).append(a)
    sections=[]
    for cat,assets in groups.items():
        cards=[]
        for a in assets:
            stem='dist/'+cat+'/'+a['name'];preview=stem+('.png' if (KIT/(stem+'.png')).exists() else '.svg')
            links=' '.join(f'<a download href="{stem}.{fmt}">{fmt.upper()}</a>' for fmt in ('svg','png','pdf') if (KIT/(stem+'.'+fmt)).exists())
            dark=' dark' if a['name'].endswith('-white') else ''
            cards.append(f'<article><div class="preview{dark}"><img loading="lazy" src="{preview}" alt="{xml(a["title"])}"></div><h3>{xml(a["name"])}</h3><p>{a["width"]} × {a["height"]} px · {links}</p></article>')
        sections.append(f'<section id="{cat}"><h2>{cat.title()}</h2><div class="grid">'+''.join(cards)+'</div></section>')
    bookcards=''.join(f'<a href="dist/documents/previews/brandbook-{i:02d}.png"><img loading="lazy" src="dist/documents/previews/brandbook-{i:02d}.png" alt="Página {i}: {xml(p["title"])}"></a>' for i,p in enumerate(BOOK,1))
    links=f'<a href="dist/documents/tenbeltz-brandbook.pdf">Brandbook PDF / {len(BOOK)} páginas ↗</a> <a href="BRANDBOOK.md">Texto editable ↗</a> <a href="tenbeltz-brand-kit.zip">Kit completo ZIP ↗</a>'
    presentations=''.join(f'<p><strong>{label}</strong> · <a href="dist/presentations/tenbeltz-{name}.pptx">PPTX editable</a> · <a href="dist/presentations/tenbeltz-{name}.pdf">PDF</a> · <a href="dist/presentations/tenbeltz-{name}.html">Presentar HTML</a></p>' for name,label in [('es','Corporativa ES / 12 slides'),('en','Corporativa EN / 12 slides'),('template','Plantilla / 10 composiciones')])
    docs=''.join(f'<p><a href="dist/documents/{p.name}">{xml(p.name)}</a></p>' for p in sorted((DIST/'documents').glob('*')) if p.suffix in ('.html','.pdf','.docx'))
    css='''@font-face{font-family:Plex;src:url('source/fonts/ibm-plex-sans-latin.woff2')}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--color-paper);color:var(--color-ink);font-family:Plex,Arial,sans-serif}main{max-width:1280px;margin:auto;padding:48px 32px}header{border-bottom:1px solid var(--color-line);padding-bottom:40px}header>img{width:220px}h1{font-size:clamp(36px,6vw,68px);line-height:1.05;font-weight:500;letter-spacing:-.045em}h2{font-size:32px;font-weight:500;margin-top:70px;border-top:1px solid var(--color-line);padding-top:24px}h3{font-size:13px;word-break:break-word;font-weight:500}p{line-height:1.65;color:var(--color-muted)}a{color:var(--color-accent);text-underline-offset:4px}nav,.downloads{display:flex;gap:20px;flex-wrap:wrap;margin:24px 0}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,265px),1fr));gap:24px}.preview{height:210px;background:var(--color-surface);padding:20px;display:flex;align-items:center;justify-content:center}.preview img{max-width:100%;max-height:100%;object-fit:contain}.preview.dark{background:var(--color-ink)}.book{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:20px}.book img{width:100%}:focus-visible{outline:2px solid var(--color-accent);outline-offset:5px}.notice{border-left:3px solid var(--color-accent);padding-left:16px}footer{margin-top:70px;border-top:1px solid var(--color-line)}'''
    (KIT/'index.html').write_text(f'<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TenBeltz / Brandbook y recursos</title><link rel="stylesheet" href="dist/web/design-tokens.css"><style>{css}</style><body><main><header><img src="dist/logos/tenbeltz-horizontal-color.svg" alt="TenBeltz"><h1>Una identidad<br>que florece.</h1><p>Brandbook y biblioteca de recursos / 2026.10</p><div class="downloads">{links}</div><nav>'+''.join(f'<a href="#{cat}">{cat.title()}</a>' for cat in groups)+'<a href="#book">Brandbook</a><a href="#presentations">Presentaciones</a></nav><p class="notice">Primera edición de las nuevas aplicaciones. Pendientes revisión estética humana, recorte en LinkedIn, PowerPoint de escritorio y prueba de imprenta. Recursos locales; sin publicación externa.</p></header><section id="book"><h2>Brandbook</h2><div class="book">'+bookcards+f'</div></section><section id="presentations"><h2>Presentaciones</h2>{presentations}<p>Instala los TTF de source/fonts para editar con la tipografía original.</p></section><section><h2>Documentos y firmas</h2>{docs}<p><a href="dist/social/tenbeltz-carousel-evaluacion.pdf">Carrusel / PDF de cinco páginas</a></p></section>'+''.join(sections)+'<footer><p>TenBeltz · Fuentes, licencias y regeneración en README.md y SOURCES.md.</p></footer></main></body></html>')


def make_manifest():
    records=[]
    for f in sorted(DIST.rglob('*')):
        if not f.is_file():continue
        record={'path':str(f.relative_to(KIT)),'bytes':f.stat().st_size,'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'format':f.suffix[1:]}
        if f.suffix=='.png':
            with Image.open(f) as im:record.update(width=im.width,height=im.height,mode=im.mode)
        records.append(record)
    (KIT/'manifest.json').write_text(json.dumps({'edition':IDENTITY['edition'],'files':records},indent=2,ensure_ascii=False))
    pairs=[('ink','paper'),('accent','paper'),('muted','paper'),('white','accent'),('white','ink')]
    (DIST/'web'/'contrast.json').write_text(json.dumps([{'foreground':a,'background':b,'ratio':round(contrast(a,b),3),'normalTextPass':contrast(a,b)>=4.5} for a,b in pairs],indent=2))
    # Palette mappings are arithmetic, explicitly not colour-managed print specs.
    rows=['Name,HEX,R,G,B,C_approx,M_approx,Y_approx,K_approx']
    for name,h in C.items():
        rgb=[int(h[i:i+2],16) for i in (1,3,5)];r,g,b=[x/255 for x in rgb];k=1-max(r,g,b)
        cmy=[0,0,0] if k==1 else [(1-v-k)/(1-k) for v in (r,g,b)]
        rows.append(','.join(map(str,[name,h,*rgb,*[round(v*100) for v in cmy],round(k*100)])))
    (DIST/'web'/'palette.csv').write_text('\n'.join(rows)+'\n')
    # Rerun once to include last generated data files.
    for f in (DIST/'web'/'contrast.json',DIST/'web'/'palette.csv'):
        records.append({'path':str(f.relative_to(KIT)),'bytes':f.stat().st_size,'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'format':f.suffix[1:]})
    records={r['path']:r for r in records}
    source_records=[{'path':str(f.relative_to(KIT)),'bytes':f.stat().st_size,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()} for f in sorted(SOURCE.rglob('*')) if f.is_file()]
    (KIT/'manifest.json').write_text(json.dumps({'edition':IDENTITY['edition'],'files':list(records.values()),'sourceFiles':source_records},indent=2,ensure_ascii=False))


def make_archive():
    target=KIT/'tenbeltz-brand-kit.zip'
    temporary=target.with_suffix('.zip.tmp')
    with zipfile.ZipFile(temporary,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
        for f in sorted(KIT.rglob('*')):
            if f.is_file() and f not in (target,temporary):z.write(f,Path('tenbeltz-brand-kit/brand')/f.relative_to(KIT))
        for f in sorted((ROOT/'tools'/'brand-kit').glob('*')):
            if f.is_file():z.write(f,Path('tenbeltz-brand-kit/tools/brand-kit')/f.name)
    temporary.replace(target)


def main():
    import sys
    import premium
    premium.install(sys.modules[__name__])
    for w in FONTS:pdfmetrics.registerFont(TTFont('Plex'+w,str(SOURCE/'fonts'/f'IBMPlexSans-{w}.ttf')))
    DIST.mkdir(exist_ok=True)
    for step in [make_logos,make_graphics,make_banners,make_social,make_web,make_stationery,make_book,make_presentations,make_previews,make_gallery,make_manifest,make_archive]:
        step(); print(step.__name__+' OK',flush=True)
    print(f'Kit: {KIT}; PDF pages: {len(BOOK)}; exports: {len(json.loads((KIT/"manifest.json").read_text())["files"])}')


if __name__=='__main__':main()
