"""Additional deterministic vector art and imported AI merchandise concepts."""
import math
import shutil
from PIL import Image


def build(b):
    w,h=1600,900
    for theme in ('paper','ink'):
        fg='accent' if theme=='paper' else 'petal'
        variants={}
        # Nested organic petal contours, precise enough to scale to print.
        paths=[]
        for i in range(28):
            f=i/27
            paths.append(f'<path d="M{840+f*260},920 C{200+f*500},{730-f*430} {330+f*310},{-130+f*210} {1140-f*240},{100+f*250} C{1690-f*300},{360+f*210} {1110+f*100},{740-f*190} {840+f*260},920" fill="none" stroke="{b.color(fg)}" stroke-width="1.1" opacity=".35"/>')
        variants['petal-contours']=''.join(paths)
        # Radial line blossom as secondary illustration, never a logo.
        paths=[]
        for i in range(64):
            a=2*math.pi*i/64
            x=1050+math.cos(a)*470;y=450+math.sin(a)*420
            paths.append(f'<path d="M1050,450 Q{1050+math.cos(a+.55)*220},{450+math.sin(a+.55)*180} {x},{y}" stroke="{b.color(fg)}" opacity=".35" stroke-width="1.2" fill="none"/>')
        variants['radial-bloom']=''.join(paths)
        # Routed engineering paths with deliberate turns and meeting points.
        paths=[]
        for i in range(12):
            y=120+i*55;x=620+i*35
            paths.append(f'<path d="M80,{y} H{x} Q{x+40},{y} {x+40},{y+40} V760 H1520" fill="none" stroke="{b.color(fg)}" stroke-width="1.3" opacity=".3"/>')
        variants['routed-lines']=''.join(paths)
        paths=[]
        for i in range(15):
            x=900+i*24
            paths.append(f'<path d="M{x},-60 C{x-600},180 {x+500},650 {x-100},960" fill="none" stroke="{b.color(fg)}" stroke-width="1.5" opacity=".3"/>')
        variants['silk-wave']=''.join(paths)
        paths=[]
        for i in range(7):
            for j in range(12):
                x=100+j*126;y=100+i*112
                paths.append(f'<path d="M{x-25},{y} H{x+25} M{x},{y-25} V{y+25}" stroke="{b.color(fg)}" opacity=".17"/>')
        variants['cross-grid']=''.join(paths)
        for name,body in variants.items():
            b.export('tenbeltz-background-'+name+'-'+theme,w,h,b.rect(0,0,w,h,theme)+body,'Fondo '+name+' / '+theme,('svg','png'),'graphics')
    # A reusable transparent vector motif for corners or section dividers.
    for theme in ('accent','petal','white'):
        body=''
        for i in range(5):
            angle=i*72
            body+=f'<path transform="rotate({angle},300,300)" d="M300 300 C110 270 125 40 260 75 C390 105 365 240 300 300Z" fill="none" stroke="{b.color(theme)}" stroke-width="2"/>'
        b.export('tenbeltz-motif-line-petals-'+theme,600,600,body,'Motivo secundario de pétalos / '+theme,('svg','png'),'graphics')
    # Transparent symbol detail for oversized editorial corner crops.
    for theme in ('accent','petal','white'):
        b.export('tenbeltz-motif-symbol-'+theme,700,800,b.mark(0,0,800,theme),'Símbolo vectorial para composición',('svg','png'),'graphics')
    extra={
        'datos':'M4 6c0-4 16-4 16 0v12c0 4-16 4-16 0z M4 6c0 4 16 4 16 0 M4 12c0 4 16 4 16 0',
        'observabilidad':'M2 12s4-7 10-7s10 7 10 7s-4 7-10 7S2 12 2 12 M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8',
        'documentacion':'M5 3h9l5 5v13H5z M14 3v5h5 M8 12h8 M8 16h6',
        'api':'M8 5L2 12l6 7 M16 5l6 7l-6 7 M14 3l-4 18',
        'busqueda':'M10 3a7 7 0 1 0 0 14a7 7 0 1 0 0-14 M15 15l7 7',
        'coste':'M17 5c-8-5-14 3-14 7s6 12 14 7 M2 10h12 M2 14h12',
        'latencia':'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18 M12 6v6l4 3',
        'equipo':'M8 3a3 3 0 1 0 0 6a3 3 0 1 0 0-6 M2 21v-4c0-7 12-7 12 0v4 M17 5a3 3 0 1 1 0 6 M17 14c4 0 5 2 5 7',
    }
    for name,path in extra.items():
        for theme in ('accent','ink','white'):
            body=f'<path d="{path}" stroke="{b.color(theme)}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
            b.export(f'tenbeltz-icon-{name}-{theme}',24,24,body,name,('svg',),'icons')
    # Import original generated pixels without editing or compositing.
    labels={'mug':'Tazas','tshirts':'Camisetas','notebook':'Cuadernos','tote':'Bolsa de tela','bottle':'Botellas','collection':'Colección'}
    for name,title in labels.items():
        source=b.SOURCE/'mockups'/(name+'.png')
        if not source.exists(): raise FileNotFoundError(source)
        target=b.DIST/'mockups'/('tenbeltz-mockup-'+name+'.png');target.parent.mkdir(exist_ok=True)
        shutil.copy2(source,target)
        with Image.open(source) as im:w,h=im.size
        b.ARTIFACTS.append({'name':target.stem,'category':'mockups','title':title+' / mockup conceptual generado con IA','width':w,'height':h})
