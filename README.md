# Web catálogo — CORPORACION J & F SAC

Sitio estático (Next.js App Router, `output: 'export'`, Tailwind v4). Datos de cables en `src/data/cables.ts`; datos de empresa en `src/data/company.ts`.

## Comandos

```bash
npm run dev     # desarrollo
npm run lint
npm run build   # genera la carpeta out/ (HTML estático)
```

## Configuración antes de publicar

Mientras estos valores no existan, el sitio compila y funciona, pero con marcadores provisionales.

| Qué | Dónde | Estado actual |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` (dominio real, p. ej. `https://midominio.pe`, sin barra final) | variable de entorno en el build | Sin definir: canonical, Open Graph y sitemap usan el marcador `https://PENDING-DOMAIN.invalid` (`PENDING_SITE_URL` en `company.ts`). No publicar así. |
| `NEXT_PUBLIC_GA_ID` (GA4, `G-XXXXXXXXXX`) | variable de entorno en el build | Sin definir: Google Analytics no se carga. Con valor, se envía el evento `quote_sent` al enviar la lista por WhatsApp. |
| Formulario "¿Prefieres que te llamemos?" | `company.form.endpoint` y `company.form.accessKey` en `src/data/company.ts` | Configurado con Web3Forms (`https://api.web3forms.com/submit` + accessKey); los mensajes llegan a corporacionjfml@gmail.com. Si `endpoint` queda vacío, el formulario abre WhatsApp con los datos. Al tener dominio, actualizar la Website URL en el panel de Web3Forms. |
| Correo de destino del formulario | cuenta del servicio de formularios y `company.email` | Confirmado: los envíos llegan a `corporacionjfml@gmail.com` (cuenta de Web3Forms); `company.email` (`corporacionj@gmail.com`) es solo el correo público que muestra la web. |
| Logo real (PNG/SVG) | `src/components/ui/Logo.tsx`, `src/app/icon.svg`, `src/app/opengraph-image.tsx` | Logo provisional dibujado en SVG (el cliente solo entregó `LOGO.pdf`). |
| Usuario de redes | `company.social` en `src/data/company.ts` | TikTok `@nexajf` (`tiktokUrl`). |
| Fotos, texto "Nosotros", horario | por definir con el cliente | No incluidos. |

Ejemplo:

```bash
NEXT_PUBLIC_SITE_URL=https://midominio.pe NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX npm run build
```

Con `NEXT_PUBLIC_SITE_URL` definido, el JSON-LD de la empresa también incluye la `url` del sitio.

## Reglas cerradas

Sin precios, sin descarga de fichas PDF, marca "CORPORACION J & F SAC" con el lema "Siempre Hay Opción". Detalle en el `CLAUDE.md` de la raíz del proyecto.
