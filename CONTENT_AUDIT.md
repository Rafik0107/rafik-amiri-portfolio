# Content audit: 2 November 2026

## Sources inspected

| Source | Result |
|---|---|
| Owner's brief (education, internships, projects, jobs, skills) | Used as the CV reference. **The CV PDF files themselves were not provided.** |
| GitHub `Rafik0107`: 2 public repositories | `HackEPS-12-Python-Projects`: 12 projects, with READMEs (FR/EN), recorded demo outputs and validation logs (41 tests passing). `Rafik0107`: an empty profile README. |
| `meinfewminites.carrd.co` | 12 gallery photos plus 2 page images, the creative bio ("3+ years in graphic design, e-commerce and photography"), and Instagram, Facebook and email links. |

## Inventory

- **Education (4)**: Master 1 Sorbonne Université (2026–); Licence SPI Sorbonne Paris Nord (2024–2026); Licence Automatique MCIL Boumerdès (2021–2024); Bac Techniques Mathématiques, Mention Bien (2021).
- **Internships (4)**: Wikeys (2025); SARL Céramique Boumerdès (2024); Sonatrach Hassi R'Mel (2023); Mokassiart Aya (date unknown).
- **Jobs and activities (9)**: Subway Paris (1 year 8 months, 4 restaurants); Le Balthazar; Taksim; Le 130; La Rambla; retail; industrial production; freelance photography; e-commerce. Self-employed status is mentioned **without a SIRET**.
- **Projects (20)**:
  - 6 from the CV, marked *completed*.
  - 12 from GitHub, marked *completed (educational, AI-assisted)*. Every number shown comes from the repo's `example_output.json`.
  - AI agents, marked *in development*.
  - HackEPS preparation, marked *planned*. No participation is claimed.
- **Photos (14)**: original images from the Carrd site.

## Duplicates resolved

- "Smart Factory Web Application" (project) and the "Wikeys" internship are cross-linked instead of duplicated.
- "MATLAB/Simulink Vibration Analysis" (CV) and "Mechanical Vibration Analysis" (Python, GitHub) are kept as two distinct projects because they use different tools.
- The brief's items 7–11 (Python / AI / ML / Computer Vision projects) are covered by the 12 GitHub projects, so no empty placeholder pages were created.

## Contradictions and points to confirm

1. **Email**: the Carrd site lists `amirirafikk@gmail.com` and is used as the public contact. Another address is attached to your account. Confirm which one to publish.
2. **No dates** for Le Balthazar, Taksim, Le 130, La Rambla, retail, industrial production, freelance photography, e-commerce or Mokassiart Aya. These show as "Dates on request" or have no date.
3. **The status and technologies of the 6 CV projects** (solar tracker, Arduino line, supervision app, Factory I/O, MATLAB) are not documented anywhere public. Only tools named in the brief are listed.
4. **AI Agents** is shown as *in development*. Correct this if it is finished or still only planned.
5. **Languages spoken** are not in any source, so they are omitted.
6. **The downloadable CV PDF** was not provided. The Resume page prints to PDF until a file is uploaded via `/admin`.
7. **Photo categories and titles**: Carrd only labels some images ("Random", "Portrait"). The categories were inferred from the captions and image content.
8. **The cherry-blossom portrait** (`image01.jpg`) appears to show a person. It is published as a portrait. Remove it if the subject has not consented.

## Kept private

No home address, phone number, SIRET, ID number, grades, transcripts or private documents are published. The automated test `tests/content.test.mjs` checks for phone, SIRET and street-address patterns.
