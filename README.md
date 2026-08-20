# VEX Web

The public-facing website for **VEX**, the computer-native AI companion.

This repository is intentionally lightweight: it is a static HTML/CSS site designed for GitHub Pages.

## Current site

The site currently includes:

- A professional VEX landing page with the preferred right-side mascot hero
- VEX dark/purple visual system
- Responsive desktop and mobile layouts
- Download-for-Mac links pointing to the VEX releases page
- Working GitHub links with the official GitHub mark embedded in the page
- A compact **A glimpse of VEX** desktop preview
- macOS-style preview window controls
- MCP / ChatWise positioning and integration information
- The VEX web icon wired to `assets/vex-icon.png`
- GitHub Pages deployment configuration
- `.nojekyll` for static GitHub Pages hosting

## Commit workflow

Keep website changes controlled, reviewable, and easy to undo.

### 1. Do not experiment directly on `main`

`main` is the published website branch. Use a development/fix/feature branch for changes first.

Examples:

```text
fix/homepage-hero
fix/icon-wiring
fix/github-mark
feat/preview
chore/docs
```

### 2. Keep commits focused

Use conventional commit prefixes:

- `feat:` — new website functionality or sections
- `fix:` — visual or functional corrections
- `docs:` — README/documentation changes
- `chore:` — maintenance or deployment tooling

Good examples:

```text
fix: restore VEX homepage hero sizing
fix: repair VEX icon and GitHub links
docs: update VEX web workflow
```

Do not mix unrelated redesigns, asset changes, deployment changes, and documentation unless they are genuinely one logical change.

### 3. Verify before pushing to `main`

Before merging a website change:

1. Inspect the exact diff.
2. Check that only the intended files changed.
3. Test the page at desktop and mobile sizes.
4. Confirm local images use paths that work on GitHub Pages.
5. Confirm GitHub and release links open correctly.
6. Check the GitHub Pages deployment/action status.
7. Make sure unrelated sections were not accidentally redesigned.

### 4. Merge the verified result

Once the branch is visually and technically verified, merge it into `main`. Do not reset the published branch to an older commit just because a later styling change was wrong; identify the exact intended file/state and restore only that part.

## Current asset rule

The website asset is:

```text
assets/vex-icon.png
```

Use the repository-relative path `assets/vex-icon.png` from `index.html`. This keeps the website independent of a moving raw URL and makes the same asset work on GitHub Pages.

The main VEX Electron repository has a separate application asset at `resources/icon.png`. That is intentionally separate from the web asset.

## Current homepage layout

The homepage is intentionally composed as:

- Left: VEX headline, description, download/GitHub actions, and platform metadata.
- Right: the large VEX mascot.
- Top-right of the hero art: a small, unobtrusive VEX badge.

The mascot should be large enough to feel like the main visual but should stay contained inside the right hero column. It should not use the previous oversized `1050px / 155%` treatment.

The compact badge should remain out of the way and should not cover the hero copy.

## What we have completed

- [x] Built the VEX static website structure.
- [x] Established the dark/purple VEX visual language.
- [x] Added the preferred right-side homepage mascot composition.
- [x] Added Download for Mac and GitHub actions.
- [x] Added a compact VEX desktop preview.
- [x] Added macOS-style preview window controls.
- [x] Added MCP / ChatWise positioning.
- [x] Wired the web icon through `assets/vex-icon.png`.
- [x] Replaced incomplete GitHub SVG paths with the complete GitHub mark.
- [x] Restored repository-relative icon paths so the icon is not dependent on a raw GitHub URL.
- [x] Restored a controlled homepage mascot size and right-side placement.
- [x] Moved the small VEX badge to the top-right of the hero art and reduced it so it does not interfere with the mascot.
- [x] Preserved the existing visual polish and mobile layout rules.

## What still needs work

### Website

- [ ] Verify the deployed GitHub Pages result at desktop and mobile sizes.
- [ ] Confirm the small icon is visible in the navigation, preview, and footer after deployment.
- [ ] Keep the GitHub mark consistent everywhere.
- [ ] Continue refining **A glimpse of VEX** without turning it into a large dashboard.
- [ ] Add the eventual simplified VEX mascot/icon when the final simplified asset is ready.
- [ ] Add secondary pages only when their content and design are ready.

### VEX application integration

- [ ] Connect the website's visual language to the actual VEX Electron UI where appropriate.
- [ ] Add an accurate maintained application preview once the real UI is stable.
- [ ] Keep website claims synchronized with what the VEX application actually supports.

### Deployment

- [ ] Confirm the final GitHub Pages production URL.
- [ ] Decide whether to keep the GitHub Pages domain or add a custom domain later.
- [ ] Remove any duplicate deployment workflow once the preferred Pages workflow is confirmed.

## GitHub Pages

This is a static site and is intended to deploy directly through GitHub Pages. Keep asset references repository-relative so the site works correctly when hosted from the repository's Pages URL.

## Repository structure

```text
vex-web/
├── assets/
│   └── vex-icon.png
├── .github/
│   └── workflows/
├── index.html
├── styles.css
├── .nojekyll
└── README.md
```

## Relationship to VEX

The website is the presentation layer for the main VEX project:

- Website: `apxllo123/vex-web`
- Application: `apxllo123/vex`

The website should describe and preview the application, not become a second implementation of the Electron UI.
