# RAFIK AMIRI ( RAIDEN ) — The Complete Digital Universe

Personal portfolio of **Rafik Amiri**, Master 1 student in Automation & Robotics (Mechatronics Design for Health) at Sorbonne Université, developer and photographer based in Paris.

**Engineer • Creator • Innovator**

## Features

- **Cinematic intro** (Three.js + GSAP): golden particles, purple energy core, metallic ring, name reveal, particle burst. Plays once per visitor, with *Skip* and *Replay* buttons and a reduced-motion version.
- **Three 3D portals**: Engineering, Creative, Explore everything. Each has a mouse-reactive tilt and spinning energy rings.
- **Hero scene** built with React Three Fiber: gold torus, purple knot and particles that react to the mouse. It pauses when off-screen and is skipped on reduced motion.
- **Pages**: Home, Engineering, Creative Studio, About (life timeline), Education, Experience, Projects (filterable gallery and 20 case studies), Skills (interactive 3D constellation), Photography (masonry gallery, filters, fullscreen viewer), Resume (printable / PDF), Contact, private Admin.
- **French / English**: French is the default, under `/fr` and `/en` URLs, with hreflang alternates.
- **RAIDEN AI**: holographic assistant orb. With `ANTHROPIC_API_KEY` set it answers with Claude, restricted to verified portfolio facts. Without a key it uses a free local answer engine.
- **Admin dashboard** at `/admin`: password + signed HttpOnly cookie, CSRF origin checks and login rate limiting. It edits every content section, uploads photos and the CV PDF, and publishes by committing to GitHub, which makes Vercel redeploy.
- **SEO**: per-page metadata, Open Graph image, `sitemap.xml`, `robots.txt`, JSON-LD `Person`, and optional Google Search Console verification.
- **Accessibility and performance**: skip link, keyboard-navigable lightbox, `prefers-reduced-motion`, lazy-loaded WebGL, optimised images (AVIF/WebP), static generation.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · Three.js · React Three Fiber · GSAP

## Content

All content lives in [`content/portfolio.json`](content/portfolio.json), either edited by hand or through `/admin`.
Every claim comes from the owner's CVs, the public GitHub repository [HackEPS-12-Python-Projects](https://github.com/Rafik0107/HackEPS-12-Python-Projects) and the photography site [meinfewminites.carrd.co](https://meinfewminites.carrd.co/). See [CONTENT_AUDIT.md](CONTENT_AUDIT.md).

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # content integrity and privacy tests
npm run lint         # TypeScript check
npm run build        # production build
```

## Environment variables (Vercel → Project → Settings → Environment Variables)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public URL (SEO, sitemap). |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Optional Google Search Console verification code. |
| `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL` | Optional: Claude-powered RAIDEN AI. |
| `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` | Enable `/admin` (the secret needs at least 32 characters). |
| `GITHUB_TOKEN`, `GITHUB_REPO`, `GITHUB_BRANCH` | Let the admin publish. Use a fine-grained token with *Contents: read & write* on this repository only. |

Secrets are never committed (`.env*` is git-ignored).

## Google Search Console

1. Add the site URL as a property in Search Console.
2. Choose *HTML tag*, copy the `content` value into `NEXT_PUBLIC_GSC_VERIFICATION`, then redeploy.
3. Submit `https://<your-domain>/sitemap.xml`.

Indexing is decided by Google and may take days or weeks.

## Credits

Photography © Rafik Amiri. Code by Rafik Amiri with AI assistance.
