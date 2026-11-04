# RAFIK AMIRI (RAIDEN) — Engineering & Creative Portfolio

Personal portfolio of **Rafik Amiri**, Master 1 student in Automation & Robotics (Mechatronics Design for Health) at Sorbonne Université, developer and photographer based in Paris.

**Control, robotics & mechatronics · Photographer & graphic designer**

## Features

- **Cinematic opening** (`CinematicIntro.tsx`, ~7.5 s, once per session on the home page): a gold line draws a robotic arm whose end effector (exact IK) traces a violet trajectory that closes into a photo frame; photographs and graphic marks appear, then the frame opens around the name, which glides into the hero title. Skip button, Esc/Enter/scroll/nav skip it, replay button, none with `prefers-reduced-motion`, content stays reachable if scripts fail.
- **Work with me** (`/contact#travaillons-ensemble`): opportunity form (type, field, description…) sent by email through Resend with the visitor as Reply-To, server-side validation, honeypot, timing and rate-limit spam guards. Without `RESEND_API_KEY` it honestly falls back to a pre-filled email.
- **Identity in one glance**: control, robotics & mechatronics (Master 1, Sorbonne Université) plus photographer & graphic designer. Three actions: projects, CV, contact.
- **Engineering visuals that are actually correct**: an SVG two-link arm driven by exact inverse kinematics along a trajectory, an animated feedback control loop, and per-domain line glyphs. Illustrative plots are labelled as such.
- **Two entry doors** (Engineering & Robotics / Photography & Design) in one consistent site.
- **Projects**: filterable catalogue (robotics, control, AI & vision, signal, software), honest statuses, and structured case studies with recorded demo data from GitHub.
- **Skills → projects map**: separates skills shown in a project from skills only listed on the CV.
- **Photography**: opening image, series, fullscreen viewer with keyboard and swipe navigation. Raiden Creative Studio is ready for documented graphic work.
- **CV**: FR and EN PDFs, generated from the resume page.
- **RAIDEN AI** assistant (Claude when `ANTHROPIC_API_KEY` is set, otherwise a free local engine), private **/admin** dashboard, FR/EN, SEO (sitemap, OG image, JSON-LD).
- **Motion system** (`src/components/Reveals.tsx`): reveal, image wipe, line drawing, timeline progress, parallax and page transitions. Text above the fold uses CSS only. Respects `prefers-reduced-motion`, and content stays visible if scripts fail.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · GSAP · SVG

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
| `RESEND_API_KEY` | Enables the opportunity form (free Resend plan). Without it the form opens a pre-filled email instead. |
| `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Optional: recipient (default: the confirmed address in portfolio.json) and sender (default: `onboarding@resend.dev`, which only delivers to the Resend account owner's address; verify a domain to change it). |
| `GITHUB_TOKEN`, `GITHUB_REPO`, `GITHUB_BRANCH` | Let the admin publish. Use a fine-grained token with *Contents: read & write* on this repository only. |

Secrets are never committed (`.env*` is git-ignored).

## Google Search Console

1. Add the site URL as a property in Search Console.
2. Choose *HTML tag*, copy the `content` value into `NEXT_PUBLIC_GSC_VERIFICATION`, then redeploy.
3. Submit `https://<your-domain>/sitemap.xml`.

Indexing is decided by Google and may take days or weeks.

## Credits

Photography © Rafik Amiri. Code by Rafik Amiri with AI assistance.
