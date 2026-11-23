# Dra. Vanessa Vittorini Sangueza · Sitio web

Sitio de la Dra. Vanessa Vittorini Sangueza, ortodoncia y ortopedia maxilar (Torres Sofer, Cochabamba).
Next.js (App Router) + TypeScript, sin librerías de UI ni de animación.

## Correr en local

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de producción
```

## Estructura

| Ruta | Qué es |
| --- | --- |
| `app/page.tsx` | Inicio: hero, tratamientos, filosofía, antes/después, videos, formación, reseñas, pasos, FAQ, contacto |
| `app/tratamientos/[slug]/page.tsx` | Una página por tratamiento (8), con su metadata, FAQ y breadcrumbs para Google |
| `app/sitemap.ts` · `app/robots.ts` | `/sitemap.xml` y `/robots.txt` automáticos |
| `lib/data.ts` | **Todo el contenido editable**: datos del consultorio, tratamientos, FAQ, videos |
| `components/Intro.tsx` | Animación de entrada con el logo (una vez por sesión) |
| `components/Motion.tsx` | Reveal al hacer scroll, barra de progreso, header que se oculta, contadores |
| `public/img` · `public/video` | Fotos y videos del doctor |

## Variables de entorno (Vercel → Settings → Environment Variables)

| Variable | Ejemplo |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://dra-vanessa-vittorini.vercel.app` (dominio final, para sitemap y SEO) |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` (Google Analytics 4; si está vacío no se carga) |

Con GA4 activo se registran los eventos `whatsapp_click` (con origen y tratamiento) y `video_play`.

## Pendientes antes de publicar en el dominio final

- [ ] Dirección exacta del consultorio → `SITE.mapQuery` en `lib/data.ts`
- [ ] Enlace de reseñas de Google → `SITE.reviewUrl`
- [ ] Fotos reales de antes y después → `public/casos/` y props `before`/`after` de `<BeforeAfter />` en `app/page.tsx`
- [ ] Reseñas reales de Google → sección `#resenas` en `app/page.tsx`
- [ ] Dominio propio + Search Console (enviar `/sitemap.xml`)

---
Desarrollado por Fernando Ponz
