[![Netlify Status](https://api.netlify.com/api/v1/badges/55d0e9f5-8e0d-422e-a3d0-38a79ecf2413/deploy-status)](https://app.netlify.com/sites/lancer-briefings/deploys)

# Lancer Briefings

**[Live Demo](https://lancer.kuenaimaku.com/)**

Go over mission briefings within the LANCER Universe in style by showing your players a fully animated mission briefing screen, with a Mirrorsmoke Mercenary Company theme.

## Credits

- Alkyama#2737 (discord) for the original [Figma Template](figma.com/community/file/983540597915480981) used as reference.
- [VantaJS](https://www.vantajs.com/) for the slick 3d openGL backgrounds.

## Requirements

- Node (v18+, recommended v20 — Vite 6 drops support for v16 and older)
- Light Text Editor (VSCode Recommended)
- Recommended VSCode extensions:
  - Color Info
  - Color Vision
  - IntelliCode
  - npm Intellisense
  - Path Intellisense
  - JSON Tools
  - SVG
  - TypeScript Vue Plugin (Volar)
  - Vue Language Features (Volar)

## Setup

`npm install`

## Build Scripts

`npm run dev` - Serve the webapp with hot reloads (for development work)  
`npm run build` - Build for production  
`npm run preview` - Locally preview production build  
`npm run format` - Format all code files using `prettier` based on rules set in `.prettierrc.json` (for development work)  

## Customization

Customization is handled in a couple of places.

### _base.css

This file holds a majority of the colors, fonts, and sizes of the webapp. Play around with the values in the marked customization section.

### Index.html

This file houses the [VantaJS](https://www.vantajs.com/) background used in the web application. Go to the site, mess with the different effect options, and once you're ready, replace the `VANTA.GLOBE` script with your customized one. Note that if you use a different effect, you'll have to replace the script url above it with one from [their CDN repository](https://cdn.jsdelivr.net/npm/vanta@latest/dist/).

### /public folder

This folder holds all of the local image, audio and video assets.

- `/faction-logos` - SVG files for the logos of each major faction, currently used for mapping icons to mech manufacturers.
- `/icons` - If you want to replace the icons used across the application, this is where you'd swap them.
- `/pilots` - This is where the images of pilots and their bios are held. Filenames MUST match the `callsign` property on pilots.
- `/mechs` - This is where the images of mechs are held. Filenames MUST match the `mech` property on pilots.
- `bullet.webp` - This replaces the default bullet point in Markdown areas.
- `planet.webm` - This is the planet rotation video used in the header.
- `startup.ogg` - This is the sound that plays on page load.

### src/assets folder
- `/clocks` - This is where the json for relevant mission or overarching story Clocks are held. You can add and configure clocks by adding or modifying json objects to the list.
- `/events` - This is where the markdown files for events in the EVENT LOG are held. Each `.md` file uses YAML frontmatter for metadata (see the "Mission and Event file format" section below).
- `/LCPs` - This is where unzipped LCPs will be expected to be read from. `index.js` is the central registry — every LCP listed there gets merged into the global lookup tables for weapons / systems / frames / talents / pilot_gear / etc. Drop new LCPs in this folder, import them into `index.js`, and they're live.
- `/missions` - This is where the summaries of missions are held. Each `.md` file uses YAML frontmatter (see the "Mission and Event file format" section below).
- `/pilots` - This is where the json of pilots (exported from Comp/Con) are held. Filenames MUST match the `callsign` property on pilots.
- `/reserves` - This is where the json of reserves for the pilots are held. Any reserves on each individual pilot's exported data will also be added to the reserves.
- `/info/general-config.json` - Edit this to change which mission loads initially, set the pilot information, and other ease-of-use options that have been introduced to modify how the site works. Below are the values you might have to change.
  - `initialSlug` - Controls what mission file is selected on startup. This MUST match the slug of a markdown file within the `/public/missions/` directory.
  - `planetPath` - The path (relative to the root directory of this repository) to the .webm or .gif file to use for the planet video element.
  - `defaultTitle` - Sets the prefix for the title of each page (the text that shows up in your browser tab).
  - `icon` - The path (relative to the root directory of this repository) to the image that should be used for the favicon. This will be displayed in the browser tab for this website.
  - `header` - Reads from the `header` JSON object to determine what text to place on each element of the `Header.vue` Component.

### /src/assets/LCPs/index.js

Central registry of LCP data. Every imported source (lancer-data, ktb, nrfaw, longrim, wallflower, osr, sotw, ows, dustgrave, siren) is merged into pre-built collections (`weapons`, `systems`, `frames`, `talents`, `skills`, `bonds`, `pilotGear`, `reserves`, `mods`). Pilot.vue and the modal components consume from this module, so you only edit one file when adding a new LCP.

## Mission and Event file format

Both `/src/assets/missions/*.md` and `/src/assets/events/*.md` use **YAML frontmatter** for metadata, followed by the rendered markdown body.

**Mission example:**

```md
---
slug: 001
name: bug hunt
status: success
---

# Mission // 001

Markdown content goes here...
```

`status` accepts `start`, `success`, `partial-success`, or `failure`.

**Event example:**

```md
---
title: "Evergreen: Infrastructure Assessment"
location: HERCYNIA
time: 5014u
thumbnail: https://example.com/image.png
---

Markdown content goes here...
```

Quote values that contain `:` or other YAML-significant characters. See `/src/assets/missions/guide/` and `/src/assets/events/guide/` for ready-to-copy examples.

## Continuous Integration

A GitHub Actions workflow in `.github/workflows/build.yml` runs `npm ci && npm run build` on every pull request to `master` (and on direct pushes to `master`). The `master` branch is protected by a ruleset that requires the build check to pass before merging. Dependabot (`.github/dependabot.yml`) opens grouped monthly PRs for npm and GitHub Actions updates; each PR is validated by the same build check.

## Responsive layout

The interface adapts to mobile, tablet, and desktop:

- **≤767px (mobile):** content stacks in a single column; the sidebar is replaced with a hamburger drawer; the Vanta background runs but pointer-events are disabled so it doesn't intercept touches.
- **768–1199px (tablet / iPad portrait):** header stacks vertically, sidebar stays as a fixed 90px bar to the left, sections wrap into rows that fit the viewport.
- **1200–1599px:** desktop layout with StatusView reflowing the four sections into a 2x2 grid so iPad Pro landscape (1366px) doesn't clip the rightmost panels.
- **≥1600px:** original full-width desktop layout untouched.

All breakpoints live in `/src/assets/styles/_responsive.css` as the single source of overrides on top of `_base.css`.

## Startup sound

The `<audio>` element in `App.vue` is no longer set to autoplay — most browsers (Chrome, Firefox, Safari) block autoplay with sound until the page receives a user gesture, so the original `<audio autoplay>` was silently rejected for first-time visitors. Playback now triggers on the first `pointerdown` or `keydown` event after load.

## Hosting Recommendations

I would strongly recommend using [Netlify](https://www.netlify.com/) for hosting, as there's no cost for hosting, has Continuous Deployment, and they'll provide a url. Register for an account, and click the `New Site from Git` button.
On the next page, pick the git service you used to fork this repo with, and authenticate. On the next page, select the `lancer-briefings` repository. If you can't see the repository listed on the page, click the `Can’t see your repo here? Configure the Netlify app on <git site>` link at the bottom of the page.
Finally, make sure the branch being deployed is `master`, the `base directory` field is blank, the `build command` is `npm run build`, and the publish directory is `dist`.

Once the site builds remotely, click on the link provided in the `site overview` tab and make sure everything looks right.

Alternatively, if you use github, you can probably rely on github-pages. Take a look at the [vite documentation](https://vitejs.dev/guide/static-deploy.html#github-pages) for more info.

## Usage within FoundryVTT

install the [Inline Webviewer](https://foundryvtt.com/packages/inlinewebviewer) module and use the new button to send websites to your players - namely this one. Best viewed at 1920x1080.
