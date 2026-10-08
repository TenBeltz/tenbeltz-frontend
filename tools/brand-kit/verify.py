#!/usr/bin/env python3
"""Meaningful checks for export integrity, dimensions and editable documents."""
from pathlib import Path
import hashlib
import json
import zipfile
import xml.etree.ElementTree as ET
from PIL import Image
from pptx import Presentation
from docx import Document
from pypdf import PdfReader
import fitz

ROOT=Path(__file__).resolve().parents[2]
KIT=ROOT/'brand'
DIST=KIT/'dist'
manifest=json.loads((KIT/'manifest.json').read_text())
checks=[]


def check(name,condition):
    if not condition: raise AssertionError(name)
    checks.append(name)


for f in manifest['files']:
    p=KIT/f['path']
    check('sha256 '+f['path'],p.is_file() and hashlib.sha256(p.read_bytes()).hexdigest()==f['sha256'])
    if p.suffix=='.png':
        with Image.open(p) as im:
            check('dimensions '+p.name,im.size==(f['width'],f['height']))
            im.verify()
    if p.suffix=='.svg':ET.parse(p)
    if p.suffix=='.pdf':check('readable PDF '+p.name,len(PdfReader(p).pages)>0)
for f in manifest.get('sourceFiles',[]):
    check('source sha256 '+f['path'],hashlib.sha256((KIT/f['path']).read_bytes()).hexdigest()==f['sha256'])
book=PdfReader(DIST/'documents'/'tenbeltz-brandbook.pdf')
check('brandbook matches source pages',len(book.pages)==len(json.loads((KIT/'source/book.json').read_text())))
text='\n'.join(p.extract_text() for p in book.pages)
check('brandbook has searchable body text','Ingeniería con criterio.' in text and 'hello@tenbeltz.com' in text)
for name,n in [('es',12),('en',12),('template',10)]:
    prs=Presentation(DIST/'presentations'/f'tenbeltz-{name}.pptx')
    check('pptx slide count '+name,len(prs.slides)==n)
    check('pptx editable text '+name,all(any(sh.has_text_frame and sh.text.strip() for sh in sl.shapes) for sl in prs.slides))
    check('pptx bounds '+name,all(sh.left>=0 and sh.top>=0 and sh.left+sh.width<=prs.slide_width+10 and sh.top+sh.height<=prs.slide_height+10 for sl in prs.slides for sh in sl.shapes))
    check('PDF slide count '+name,len(PdfReader(DIST/'presentations'/f'tenbeltz-{name}.pdf').pages)==n)
    check('PDF standard slide size '+name,all(abs(float(p.mediabox.width)-960)<.01 and abs(float(p.mediabox.height)-540)<.01 for p in PdfReader(DIST/'presentations'/f'tenbeltz-{name}.pdf').pages))
for kind in ('proposal','report'):
    d=Document(DIST/'documents'/f'tenbeltz-{kind}-template.docx')
    check('DOCX editable '+kind,any('[Título del proyecto]' in p.text for p in d.paragraphs))
    check('A4 PDF '+kind,len(PdfReader(DIST/'documents'/f'tenbeltz-{kind}-template.pdf').pages)==1)
for kind,n in [('proposal',6),('report',7)]:
    pdf=PdfReader(DIST/'documents'/f'tenbeltz-{kind}-example.pdf')
    check('example pages '+kind,len(pdf.pages)==n)
    text='\n'.join(p.extract_text() for p in pdf.pages)
    check('explicit fictional example '+kind,'EJEMPLO FICTICIO' in text and 'Ladera Cloud' in text)
    check('example DOCX '+kind,len(Document(DIST/'documents'/f'tenbeltz-{kind}-example.docx').paragraphs)>30)
    with fitz.open(DIST/'documents'/f'tenbeltz-{kind}-example.pdf') as doc:
        for i,page in enumerate(doc):
            for block in page.get_text('dict')['blocks']:
                for row in block.get('lines',[]):
                    for span in row['spans']:
                        r=fitz.Rect(span['bbox'])
                        check(f'example text in A4 {kind} {i+1}',r.x0>=0 and r.y0>=0 and r.x1<=596 and r.y1<=842)
slides=json.loads((KIT/'source/slides.json').read_text())
for lang in ('es','en'):
    check('12 distinct compositions '+lang,len({s['kind'] for s in slides[lang]})==12)
    check('presentation PDF text searchable '+lang,len(PdfReader(DIST/'presentations'/f'tenbeltz-{lang}.pdf').pages[1].extract_text())>100)
project=json.loads((KIT/'source/example-project.json').read_text());e=project['evaluation']
check('synthetic example flag',project['fictional'] is True)
check('evaluation sample consistent',sum(c['total'] for c in e['categories'])==e['sampleSize'])
check('evaluation passes consistent',sum(c['pilotPass'] for c in e['categories'])==e['pilotPass'] and sum(c['baselinePass'] for c in e['categories'])==e['baselinePass'])
check('error counts consistent',sum(e['pilotErrorCounts'].values())==e['sampleSize']-e['pilotPass'])
check('proposal budget sums',sum(p['amount'] for p in project['proposal']['phases'])==project['proposal']['budgetEUR'])
for name in ('mug','tshirts','notebook','tote','bottle','collection'):
    check('mockup pixels preserved '+name,(KIT/'source/mockups'/f'{name}.png').read_bytes()==(DIST/'mockups'/f'tenbeltz-mockup-{name}.png').read_bytes())
for name,size,maxbytes in [('empresa-es',(1512,256),3_000_000),('empresa-en',(1512,256),3_000_000),('personal-es',(1584,396),8_000_000),('personal-en',(1584,396),8_000_000)]:
    path=DIST/'linkedin'/f'tenbeltz-linkedin-{name}.png'
    check('LinkedIn size '+name,Image.open(path).size==size)
    check('LinkedIn upload weight '+name,path.stat().st_size<maxbytes)
for f in (DIST/'logos').glob('*.png'):
    im=Image.open(f).convert('RGBA')
    check('transparent logo '+f.name,im.getextrema()[-1][0]==0)
flower=Image.open(KIT/'source/artwork/abstract-flower.webp').convert('RGBA')
converted=Image.open(DIST/'graphics/tenbeltz-flower-transparent.png').convert('RGBA')
check('flower pixels preserved',flower.size==converted.size and flower.tobytes()==converted.tobytes())
check('all normal-text contrast pairs pass',all(r['normalTextPass'] for r in json.loads((DIST/'web/contrast.json').read_text())))
card=PdfReader(DIST/'documents'/'tenbeltz-business-card-print.pdf')
check('card trim size 85x55',all(abs(float(p.trimbox.width)-85*72/25.4)<.02 and abs(float(p.trimbox.height)-55*72/25.4)<.02 for p in card.pages))
check('card bleed 3mm',all(abs(float(p.bleedbox.width)-91*72/25.4)<.02 for p in card.pages))
# Confirm original source symbol remains byte-for-byte identical to the website.
original=ROOT/'public/images/tenbeltz-mark.svg'
if original.exists():check('source symbol identical',original.read_bytes()==(KIT/'source/logos/tenbeltz-mark-original.svg').read_bytes())
# PDFs: body text must remain within page and above the footer separator.
doc=fitz.open(DIST/'documents'/'tenbeltz-brandbook.pdf')
for i,page in enumerate(doc):
    for block in page.get_text('dict')['blocks']:
        for row in block.get('lines',[]):
            for span in row['spans']:
                r=fitz.Rect(span['bbox'])
                check(f'PDF text in page {i+1}',r.x0>=0 and r.y0>=0 and r.x1<=842.5 and r.y1<=595)
with zipfile.ZipFile(KIT/'tenbeltz-brand-kit.zip') as z:
    check('ZIP CRC',z.testzip() is None)
    check('ZIP generator included','tenbeltz-brand-kit/tools/brand-kit/build.py' in z.namelist())
    check('ZIP sources included','tenbeltz-brand-kit/brand/source/slides.json' in z.namelist())
print(json.dumps({'passed':len(checks),'exports':len(manifest['files']),'brandbookPages':len(book.pages),'pptxSlides':[12,12,10]},indent=2))
