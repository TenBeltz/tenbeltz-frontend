"""Generate text-free editorial project scenes. Run from repository root.
Concept illustrations, never screenshots or client data. ES/EN share geometry.
"""
from pathlib import Path
OUT = Path(__file__).resolve().parents[2] / 'public/images/projects'
PAPER = '#f7f6f2'
ACCENT = '#583346'

def line(d, color=ACCENT, width=5):
    return f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/>'

def card(x, y, w, h, color=PAPER, radius=12):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" fill="{color}"/>'

def sheet(x, y, angle=0):
    return f'<g transform="rotate({angle} {x+80} {y+100})">'+card(x,y,160,200)+line(f'M{x+28} {y+48}h48 M{x+28} {y+80}h104 M{x+28} {y+102}h90 M{x+28} {y+124}h100', '#c3babd',4)+'</g>'

def wave(x, y, heights, color=ACCENT, step=22):
    return ''.join(line(f'M{x+i*step} {y-h/2}v{h}',color,9) for i,h in enumerate(heights))

def scene(content):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
<defs><radialGradient id="paper"><stop stop-color="#f7f6f2"/><stop offset="1" stop-color="#e9e5e1"/></radialGradient><filter id="shadow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#493440" flood-opacity=".10"/></filter></defs>
<rect width="1200" height="800" fill="url(#paper)"/>
<ellipse cx="610" cy="635" rx="330" ry="26" fill="#583346" opacity=".045"/>
{content}</svg>'''

def handset(x, y, scale=1):
    return f'<g transform="translate({x} {y}) scale({scale})">'+line('M-43-62c-13 0-24 11-23 26 5 51 47 93 98 98 15 1 26-10 26-23l-29-24-21 11c-21-8-39-26-47-47l11-21z',width=7)+'</g>'

def forward():
    return line('M535 405h75m-17-17 17 17-17 17','#b6a1ab',5)

def konect():
    # A phone call yields a small collection of analytical charts.
    s='<circle cx="735" cy="400" r="215" fill="#e4dadd" opacity=".5"/>'
    s+='<g filter="url(#shadow)"><circle cx="370" cy="405" r="112" fill="#583346"/>'+handset(370,405,1)
    # Override handset stroke inside the filled call disc.
    s=s.replace('stroke="#583346"', 'stroke="#f7f6f2"')
    s+='</g>'+forward()+'<g filter="url(#shadow)">'+card(665,268,295,274)
    s+=line('M697 312h53','#c3babd',5)
    for x,h,col in [(700,38,'#b8a8af'),(739,67,'#957f8b'),(778,99,ACCENT)]:
        s+=card(x,452-h,24,h,col,4)
    s+='<circle cx="880" cy="358" r="35" fill="none" stroke="#ded5d9" stroke-width="13"/><path d="M880 323a35 35 0 0 1 35 35" fill="none" stroke="#583346" stroke-width="13" stroke-linecap="round"/>'
    s+=line('M700 494l43-16 40 6 43-24 41 8 59-37',width=5)+'</g>'
    return scene(s)

def qamarero():
    # A telephone bot confirms a table reservation.
    s='<circle cx="795" cy="410" r="205" fill="#e4dadd" opacity=".55"/>'
    s+='<g filter="url(#shadow)">'+card(272,302,210,190,PAPER,38)
    s+=line('M377 301v-35',width=5)+'<circle cx="377" cy="255" r="10" fill="#583346"/>'
    s+='<circle cx="343" cy="377" r="10" fill="#583346"/><circle cx="411" cy="377" r="10" fill="#583346"/>'
    s+=line('M352 426q25 16 50 0',width=5)
    # Headset and microphone make the bot explicitly telephone-based.
    s+=line('M290 362v-10a87 87 0 0 1 174 0v47',width=8)
    s+=card(278,361,20,49,ACCENT,9)+card(455,361,20,49,ACCENT,9)
    s+=line('M464 409v22q0 17-20 17h-15',width=5)+'</g>'+forward()
    s+='<g filter="url(#shadow)">'+card(680,302,230,206,ACCENT,36)
    for x,y,w,h in [(720,260,150,24),(720,526,150,24),(638,343,24,126),(928,343,24,126)]:
        s+=card(x,y,w,h,'#b6a1ab',12)
    s+='<circle cx="795" cy="405" r="44" fill="#f7f6f2"/>'+line('M775 406l14 14 28-33',width=6)+'</g>'
    return scene(s)

def classification():
    # Loose sheets at left, three tidy groups at right.
    s='<g filter="url(#shadow)">'+sheet(240,350,-17)+sheet(305,265,10)
    for x,y,color in [(550,330,'#583346'),(705,285,'#957f8b'),(860,355,'#b8a8af')]:
        s+=card(x-8,y+20,138,190,'#d7ced1')+card(x-4,y+10,138,190,'#e7dfe2')+card(x,y,138,190,color)
        s+=card(x+23,y+32,42,7,'#f7f6f2',3)+line(f'M{x+24} {y+67}h87 M{x+24} {y+85}h66','#f7f6f2',3)
    return scene(s+'</g>')

def biiak():
    # A protected case file, with the human responsibility represented by a seal.
    s='<circle cx="610" cy="410" r="235" fill="#e4dadd" opacity=".45"/>'
    s+='<g filter="url(#shadow)">'+sheet(455,238,-8)+sheet(585,253,9)
    s+='<path d="M367 354q0-18 18-18h130l37 38h263q18 0 18 18v195q0 18-18 18H385q-18 0-18-18z" fill="#583346"/>'
    s+=line('M408 420h92','#bca7b1',5)
    s+='<circle cx="786" cy="540" r="74" fill="#f7f6f2"/>'+line('M786 493l33 12v31c0 27-20 44-33 51-13-7-33-24-33-51v-31z',width=4)+line('M773 537l10 10 20-24',width=4)+'</g>'
    return scene(s)

if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    for key, fn in [('irontec',konect), ('qamarero',qamarero), ('clasificacion-documental',classification), ('biiak',biiak)]:
        for suffix in ['', '-en']:
            (OUT / f'{key}{suffix}.svg').write_text(fn())
    print('Built 8 text-free conceptual project covers.')
