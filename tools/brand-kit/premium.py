"""Expansion hooks kept separate from the initial brand-kit generator."""
import json
from PIL import Image, ImageDraw, ImageFont
import graphics
import documents
import scenes


def contact_sheet(b):
    thumbs=[]
    for i in range(1,13):
        im=Image.open(b.DIST/'presentations'/'previews'/f'tenbeltz-es-{i:02d}.png').convert('RGB');im.thumbnail((533,300));thumbs.append(im)
    out=Image.new('RGB',(1599,4*326),b.C['surface']);draw=ImageDraw.Draw(out);font=ImageFont.truetype(str(b.SOURCE/'fonts'/'IBMPlexSans-Regular.ttf'),13)
    for i,im in enumerate(thumbs):
        x=(i%3)*533;y=(i//3)*326;out.paste(im,(x,y));draw.text((x+8,y+306),f'{i+1:02d} / {b.SLIDES["es"][i]["kind"]}',fill=b.C['ink'],font=font)
    out.save(b.KIT/'presentation-layouts-contact-sheet.jpg',quality=94)


def gallery(b):
    p=b.KIT/'index.html';s=p.read_text()
    featured='''<section id="examples"><h2>Documentos con contexto</h2><p>Un proyecto de soporte para Ladera Cloud, empresa ficticia. Presupuesto y métricas ilustrativos.</p><div class="grid">'''
    for kind,title,count in [('proposal','Propuesta técnica',6),('report','Informe de evaluación',7)]:
        featured+=f'<article><div class="preview" style="height:380px"><img src="dist/documents/examples/tenbeltz-{kind}-example-01.png" alt="{title}"></div><h3 style="font-size:22px">{title} / {count} páginas</h3><p><a href="dist/documents/tenbeltz-{kind}-example.pdf">PDF</a> · <a href="dist/documents/tenbeltz-{kind}-example.docx">Word editable</a> · <a href="dist/documents/tenbeltz-{kind}-example.html">Ver todas las páginas</a></p></article>'
    featured+='''</div></section><section><h2>Una presentación, doce composiciones</h2><a href="dist/presentations/tenbeltz-es.html"><img src="presentation-layouts-contact-sheet.jpg" alt="Doce composiciones diferentes de presentación" style="width:100%"></a><p><a href="dist/presentations/tenbeltz-es.pptx">PowerPoint ES</a> · <a href="dist/presentations/tenbeltz-en.pptx">PowerPoint EN</a> · <a href="dist/presentations/tenbeltz-template.pptx">Plantilla editable</a></p></section><section id="merchandise"><h2>La marca fuera de la pantalla</h2><img src="dist/mockups/tenbeltz-mockup-collection.png" alt="Colección conceptual TenBeltz: tazas, cuadernos, bolsa, camiseta y botella" style="width:100%"><p>Mockups conceptuales generados con IA. Las imágenes muestran aplicaciones de la identidad; los archivos de producción deben usar los logos vectoriales originales.</p><p><a href="#mockups">Ver y descargar los seis mockups</a> · <a href="#graphics">Explorar los nuevos gráficos</a></p></section>'''
    s=s.replace('<section id="book">',featured+'<section id="book">',1)
    s=s.replace('<a href="#book">Brandbook</a>','<a href="#examples">Ejemplos</a><a href="#merchandise">Mockups</a><a href="#book">Brandbook</a>',1)
    s=s.replace('<a href="#documents/examples">Documents/Examples</a>','')
    s=s.replace('href="#merchandise">Mockups','href="#merchandise">Colección')
    s=s.replace('Primera edición de las nuevas aplicaciones. Pendientes revisión estética humana, recorte en LinkedIn, PowerPoint de escritorio y prueba de imprenta. Recursos locales; sin publicación externa.','Identidad, recursos y ejemplos para usar y adaptar. Los casos y sus métricas son ficticios; los mockups son visualizaciones conceptuales.')
    # Individual document pages are available through their own viewer, not 26 duplicate cards.
    start=s.find('<section id="documents/examples">')
    if start>=0:
        end=s.find('</section>',start)+len('</section>');s=s[:start]+s[end:]
    p.write_text(s)


def install(b):
    original_illustration=b.illustration
    def expanded_illustration(p,visual,index):
        if visual=='example-documents':
            for i,kind in enumerate(('proposal','report')):
                b.pdf_image(p,b.DIST/'documents'/'examples'/f'tenbeltz-{kind}-example-01.png',365+i*224,190,210,297)
                b.pdf_text(p,'Propuesta / 6 páginas' if i==0 else 'Informe / 7 páginas',365+i*224,514,11,'muted')
        elif visual=='mockups':
            b.pdf_image(p,b.DIST/'mockups'/'tenbeltz-mockup-collection.png',365,190,435,290)
            b.pdf_text(p,'Mockup conceptual generado con IA',365,512,11,'muted')
        elif visual=='patterns':
            for i,n in enumerate(['petal-contours','routed-lines','silk-wave']):
                b.pdf_image(p,b.DIST/'graphics'/f'tenbeltz-background-{n}-paper.png',365,190+i*108,435,94)
        else:original_illustration(p,visual,index)
    b.illustration=expanded_illustration
    original_graphics=b.make_graphics
    def expanded_graphics():original_graphics();graphics.build(b)
    b.make_graphics=expanded_graphics
    original_stationery=b.make_stationery
    def expanded_stationery():original_stationery();documents.build(b)
    b.make_stationery=expanded_stationery
    b.make_pptx=lambda data,name:scenes.make_pptx(b,data,name)
    b.make_slide_svg=lambda d,i,n:scenes.slide(b,d,i,n).svg_body()
    original_presentations=b.make_presentations
    def expanded_presentations():
        original_presentations()
        for name,data in b.SLIDES.items():scenes.make_pdf(b,data,name)
        contact_sheet(b)
    b.make_presentations=expanded_presentations
    original_gallery=b.make_gallery
    def expanded_gallery():original_gallery();gallery(b)
    b.make_gallery=expanded_gallery
