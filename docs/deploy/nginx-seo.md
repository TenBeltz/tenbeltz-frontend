# nginx: redirección www y cabeceras de seguridad

Pendiente de aplicar en producción (62.171.173.193). Son los dos puntos de SEO que no se
pueden arreglar desde el código del sitio.

## Problema 1 — `www.tenbeltz.com` devuelve 200 en vez de redirigir

Verificado el 2026-07-21:

```
https://www.tenbeltz.com/  ->  200   (debería ser 301 a https://tenbeltz.com/)
```

Ahora mismo cada página existe en dos dominios. El `<link rel="canonical">` apunta al
dominio sin www, así que Google lo resuelve bien y no es crítico, pero divide señales y
hace que cualquier enlace entrante a la versión www valga menos de lo que debería.

**Añadir un server block dedicado** (no tocar el bloque existente de `tenbeltz.com`):

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.tenbeltz.com;

    # Mismos certificados que el bloque de tenbeltz.com. El certificado DEBE cubrir
    # www.tenbeltz.com o el navegador dará error de TLS antes de llegar a la redirección.
    ssl_certificate     /etc/letsencrypt/live/tenbeltz.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tenbeltz.com/privkey.pem;

    return 301 https://tenbeltz.com$request_uri;
}
```

> Comprobar primero que el certificado incluye el dominio www:
> `openssl s_client -connect www.tenbeltz.com:443 -servername www.tenbeltz.com </dev/null 2>/dev/null | openssl x509 -noout -text | grep -A1 "Subject Alternative Name"`
> Si no lo incluye: `certbot --nginx -d tenbeltz.com -d www.tenbeltz.com`

## Problema 2 — cero cabeceras de seguridad

Verificado: la respuesta de `https://tenbeltz.com/` no incluye ninguna de estas. No son un
factor de ranking directo, pero HTTPS y la seguridad del sitio sí son señales de calidad, y
esto sale en cualquier auditoría.

Dentro del `server` block de `tenbeltz.com`:

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header X-Frame-Options "SAMEORIGIN" always;
```

`Strict-Transport-Security` obliga a HTTPS durante un año en los navegadores que ya han
visitado el sitio. No añadas `preload` sin querer entrar en la lista de HSTS, que es
difícil de revertir.

## Problema 3 — `cache-control: no-store` en todas las páginas

Cada visita de un rastreador fuerza un render SSR completo. Con 10 URLs no es un problema
real hoy, pero es gasto innecesario y penaliza el tiempo de respuesta. Los assets estáticos
sí deberían cachearse:

```nginx
location /_astro/ {
    proxy_pass http://localhost:4321;
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```

## Aplicar

```bash
nginx -t                 # valida la sintaxis ANTES de recargar
systemctl reload nginx   # reload, no restart: no corta conexiones vivas
```

Si `nginx -t` falla, no recargues: corrige primero. Un reload con config inválida deja
nginx sirviendo la config anterior, pero un restart lo tumbaría.

## Redesplegar el sitio

```bash
cd /ruta/del/repo
git pull origin main
npm ci
npm run build
pm2 reload <nombre-del-proceso>   # 'pm2 list' para ver el nombre exacto
```

`pm2 reload` hace recarga sin downtime; `pm2 restart` corta. Comprobar después:

```bash
curl -s https://tenbeltz.com/sitemap-0.xml | grep -o '<loc>[^<]*</loc>'
curl -s https://tenbeltz.com/en | grep -o '<link rel="canonical" href="[^"]*"'
```

El sitemap debe salir **sin barra final** y el canonical de `/en` debe apuntar a
`https://tenbeltz.com/en`, no a `https://tenbeltz.com/`.
