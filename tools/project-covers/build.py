"""Build bilingual, illustrative system covers for the four selected cases.
Standard-library SVG only; no client data or product screenshots.
Run from repository root: python3 tools/project-covers/build.py
"""
from pathlib import Path
from html import escape
OUT = Path(__file__).resolve().parents[2] / 'public/images/projects'
INK='#252826'; MUTED='#676b65'; LINE='#d9dcd4'; PAPER='#f7f6f2'; SURFACE='#eeeee7'; ACCENT='#583346'
def text(x,y,t,size=28,fill=INK,anchor='start',spacing=None):
 return f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill}" text-anchor="{anchor}"'+(f' letter-spacing="{spacing}"' if spacing else '')+f'>{escape(t)}</text>'
def rect(x,y,w,h,fill=PAPER,stroke=LINE,rx=7):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="2"/>'
def path(d,stroke=LINE,width=2,fill='none'):return f'<path d="{d}" stroke="{stroke}" stroke-width="{width}" fill="{fill}" stroke-linecap="round" stroke-linejoin="round"/>'
def circle(x,y,r,fill=PAPER,stroke=LINE):return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="2"/>'
def base(title,subtitle,content):
 grid=''.join(path(f'M{x} 255V655',width=1) for x in range(110,1100,70))+''.join(path(f'M110 {y}H1090',width=1) for y in range(270,660,70))
 return f'<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="{SURFACE}"/><g opacity=".4">{grid}</g><g font-family="Arial,sans-serif">'+text(80,85,'TENBELTZ / SYSTEM STUDY',18,MUTED,spacing=3)+text(80,165,title,45)+text(80,218,subtitle,25,MUTED)+content+path('M80 710H1120')+text(80,754,'AI ENGINEERING',16,MUTED,spacing=3)+text(1120,754,'TENBELTZ',16,ACCENT,anchor='end',spacing=3)+'</g></svg>'
def audio(x,y):
 heights=[12,24,48,68,38,84,57,96,44,74,30,52,22,12]
 return ''.join(path(f'M{x+i*12} {y-h/2}v{h}',ACCENT,5) for i,h in enumerate(heights))
def konect(en):
 title='Konect / Call intelligence' if en else 'Konect / Análisis de llamadas'
 subtitle='Speech, language and service quality' if en else 'Voz, lenguaje y calidad de atención'
 s=rect(100,330,245,235)+text(222,378,'AUDIO',20,MUTED,'middle',2)+audio(145,453)
 s+=path('M345 448H454',ACCENT,3)+circle(400,448,5,ACCENT,ACCENT)
 s+=rect(455,310,290,275,ACCENT,ACCENT)+rect(538,354,124,95,ACCENT,'#a88c9a')
 for i in range(5):
  q=550+i*25;s+=path(f'M{q} 344V354M{q} 449V459', '#a88c9a',2)
 s+=text(600,411,'AI',37,PAPER,'middle')+text(600,510,'LLM',26,PAPER,'middle')+text(600,551,'LOCAL / CLOUD',18,'#d7c7cf','middle',2)
 s+=path('M745 448H855',ACCENT,3)+circle(800,448,5,ACCENT,ACCENT)
 s+=rect(855,330,245,235)+text(977,378,'INSIGHT',20,MUTED,'middle',2)
 for i,h in enumerate([30,58,47,88,108]):s+=rect(888+i*33,518-h,20,h,ACCENT,ACCENT,2)
 s+=text(110,649,'Audio',24,MUTED)+text(600,649,'Transcription + analysis' if en else 'Transcripción + análisis',24,MUTED,'middle')+text(1090,649,'Quality' if en else 'Calidad',24,MUTED,'end')
 return base(title,subtitle,s)
def qamarero(en):
 title='Qamarero / Voice reservations' if en else 'Qamarero / Reservas por voz'
 subtitle='A conversation connected to restaurant operations' if en else 'Una conversación conectada a la operativa del restaurante'
 s=circle(234,448,116)+path('M182 380c-10 4-17 13-16 26 5 54 57 106 112 113 12 1 21-7 26-17l-32-31-21 12c-25-9-46-29-55-55l12-20z',ACCENT,4)
 s+=path('M350 448H470',ACCENT,3)+rect(470,310,282,280)+text(611,359,'AGENT',20,MUTED,'middle',2)+audio(529,406)
 s+=rect(498,469,226,81,ACCENT,ACCENT)+text(611,517,'Availability' if en else 'Disponibilidad',23,PAPER,'middle')
 s+=path('M752 448H866',ACCENT,3)+rect(866,330,234,234)+text(983,379,'BOOKING' if en else 'RESERVA',20,MUTED,'middle',2)
 for row in range(2):
  for col in range(3):
   x=893+col*63;y=415+row*60;s+=rect(x,y,44,40,ACCENT if (row,col)==(1,1) else SURFACE,ACCENT if (row,col)==(1,1) else LINE,4)
 s+=text(234,649,'Call' if en else 'Llamada',24,MUTED,'middle')+text(611,649,'CRM + tools' if en else 'CRM + herramientas',24,MUTED,'middle')+text(983,649,'Tables + hours' if en else 'Mesas + horarios',24,MUTED,'middle')
 return base(title,subtitle,s)
def classification(en):
 title='Classification / Geometry + learning' if en else 'Clasificación / Geometría + aprendizaje'
 subtitle='15 categories. 77 subcategories. Supervised ensemble.' if en else '15 categorías. 77 subcategorías. Ensemble supervisado.'
 s=rect(90,292,282,137)+rect(90,467,282,137)
 dots=[(135,342),(160,359),(142,377),(180,341),(194,370),(170,391),(211,354)]
 for x,y in dots:s+=circle(x,y,5,ACCENT,ACCENT)
 s+=text(235,371,'154 sims',25)+text(118,523,'1024d',28,ACCENT)+text(118,571,'Embedding',26)
 s+=path('M372 360H405Q428 360 428 386V449H471M372 535H405Q428 535 428 509V449H471',ACCENT,3)
 s+=rect(472,330,285,234,ACCENT,ACCENT)+text(614,416,'ENSEMBLE',32,PAPER,'middle')+text(614,475,'GeoMean',29,PAPER,'middle')+text(614,523,'CPU / NO LLM',17,'#d7c7cf','middle',2)
 s+=path('M757 449H857',ACCENT,3)+rect(857,305,257,284)
 for i in range(5):
  s+=text(881,352+i*47,str(i+1).zfill(2),18,ACCENT)+rect(925,332+i*47,156-i*22,24,ACCENT if i==0 else '#ccc4c8',ACCENT if i==0 else '#ccc4c8',3)
 s+=text(230,656,'Two signals' if en else 'Dos señales',24,MUTED,'middle')+text(615,656,'0 generative LLM calls' if en else '0 llamadas LLM generativo',24,MUTED,'middle')+text(989,656,'Top-5',24,MUTED,'middle')
 return base(title,subtitle,s)
def biiak(en):
 title='Biiak / Private AI platform' if en else 'Biiak / Plataforma de IA privada'
 subtitle='Case files, knowledge and professional review' if en else 'Expedientes, conocimiento y revisión profesional'
 s=rect(90,335,237,244)+path('M116 366h73l20 23h84v142H116z',ACCENT,3)
 s+=path('M143 427h125M143 450h98M143 473h113',MUTED,3)+text(207,615,'Case files' if en else 'Expedientes',24,MUTED,'middle')
 s+=path('M327 449H458',ACCENT,3)+rect(458,301,300,296,ACCENT,ACCENT)
 s+=path('M608 344l66 24v61c0 45-36 69-66 82-30-13-66-37-66-82v-61z','#c0a6b4',3)
 s+=rect(584,404,48,38,PAPER,PAPER,4)+path('M594 404v-13a14 14 0 0 1 28 0v13',PAPER,3)+text(608,550,'LOCAL AI',25,PAPER,'middle',1)
 s+=path('M758 449H876',ACCENT,3)+rect(876,335,238,244)
 s+=text(900,385,'Sources' if en else 'Fuentes',25)+path('M900 416h185M900 442h155M900 468h175',MUTED,3)
 s+=circle(921,527,17,ACCENT,ACCENT)+path('M913 527l6 6 10-12',PAPER,3)+text(951,535,'[1] [2]',27,ACCENT)
 s+=text(608,650,'Roles + audit trail' if en else 'Permisos + trazabilidad',24,MUTED,'middle')+text(994,615,'Review' if en else 'Revisión',24,MUTED,'middle')
 return base(title,subtitle,s)
if __name__=='__main__':
 OUT.mkdir(parents=True,exist_ok=True)
 for key,fn in [('irontec',konect),('qamarero',qamarero),('clasificacion-documental',classification),('biiak',biiak)]:
  for en in [False,True]: (OUT/(key+('-en' if en else '')+'.svg')).write_text(fn(en))
 print('Built 8 bilingual system illustrations.')
