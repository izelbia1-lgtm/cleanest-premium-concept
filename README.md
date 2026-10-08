# Cleanest — Premium & Established

**Premium & Established** is a separate website redesign concept/client demo for **Cleanest Cleaning & Garden Care**. It is not the official website, which remains [cleanest.co.za](https://www.cleanest.co.za/). Concepts 1 and 2 have separate projects and repositories. No Vercel deployment has been made for this concept.

## Run and verify

Node 22.12 or newer. `npm ci`, then `npm run dev` starts the local preview on port 5184. `npm run build` checks TypeScript and builds `dist`; `npm run preview` uses port 4184.

With a server running, set `SITE_URL` to its address and run `npm run test:ui` for responsive checks in installed Edge. `UI_BROWSER_CHANNEL` can select another installed browser channel. `npm run test:facts` compares facts against local archived source pages, or fetches the original public pages if captures are absent. Screenshots, raw captures and local files are excluded from Git.

## Design

Independent Concept 3 design system: deep navy masthead, locally hosted Barlow Condensed headings and Manrope text, text-first hero above a panoramic original photograph, numbered service rows, full-width team photography, aligned gallery with accessible enlargement, location directory rows, restrained customer quotes and an integrated dark enquiry section. No empty before-and-after placeholders or invented transformation images.

Edit facts in `src/data.ts`, shared UI in `src/components.tsx`, the form in `src/QuoteForm.tsx`, homepage sections in `src/main.tsx`, and the design system in `src/styles.css`. Font license files are in `public/fonts`.

## Local-only enquiries

The form validates input and opens a request review. Nothing is sent, persisted or uploaded. Optional photographs are local selections only, limited to five JPG/PNG/WebP images under 10 MB each. Contacts open verified real phone, email, WhatsApp and Facebook channels only when a visitor chooses them. No backend or upload storage exists.

## Noindex protection

HTML contains `noindex, nofollow, noarchive`; robots.txt disallows crawling. Prepared vercel.json supplies X-Robots-Tag on every path if deployment is later authorised. No official-domain canonical or active LocalBusiness structured data is injected. Noindex is not access control; a private preview requires host access protection. Do not modify the client's official domain, hosting or DNS.

## Vercel import settings

Import `izelbia1-lgtm/cleanest-premium-concept` as a new project:

- Production branch: `main`
- Framework preset: Vite
- Root directory: repository root (`./`)
- Install command: `npm ci`
- Build command: `npm run build`
- Output directory: `dist`
- Node.js: 22.x (22.12 or newer)
- Environment variables: none required

Keep noindex enabled and do not connect the client's official domain. The social preview is SVG; platforms requiring a raster preview need an approved PNG and absolute URL once a deployment is authorised.

## Client confirmation

Confirm current experience wording, branch-specific services/areas, contacts/hours, photo rights and current team imagery, testimonial authenticity and publication permission, high-resolution branding, and final enquiry recipients/privacy/upload/retention requirements. Business content and imagery remain attributable to Cleanest; this concept grants no additional reuse rights.

## Current service area

The client confirmed on 8 October 2026 that Cleanest serves Johannesburg only. This supersedes older location information on the official source website. Forms, metadata, service areas and testimonial content reflect that instruction.
