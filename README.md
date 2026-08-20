# VEX Web

The public-facing website for **VEX**, the computer-native AI companion.

This repository is intentionally lightweight: it is a static HTML/CSS site that can be deployed directly with GitHub Pages.

## Current site

The site currently includes:

- A professional VEX landing page with the preferred right-side mascot hero
- VEX branding and purple/dark visual system
- Responsive desktop and mobile layouts
- Download-for-Mac links pointing to the VEX releases page
- GitHub links pointing to the main VEX repository
- A compact **A glimpse of VEX** desktop preview
- macOS-style preview window controls
- MCP / ChatWise positioning and integration information
- The VEX icon wired through `assets/vex-icon.png`
- GitHub Pages deployment configuration
- `.nojekyll` for static GitHub Pages hosting

## Commit workflow

Keep the website changes controlled and easy to undo.

### 1. Never make experimental changes directly on `main`

`main` is the release/published website branch. Do not use it as the working branch for redesigns or experiments.

### 2. Work on a separate branch first

Use a focused branch name such as:

```text
fix/homepage-hero
fix/icon-wiring
feat/preview
chore/docs
```

Keep each branch focused on one logical change.

### 3. Make small, descriptive commits

Use conventional commit prefixes:

- `feat:` — new website functionality or sections
- `fix:` — visual or functional correction
- `docs:` — README/documentation changes
- `chore:` — maintenance or deployment tooling

Examples:

```text
feat: add VEX landing page
fix: restore preferred landing hero sizing
docs: document VEX web workflow
```

Do not combine unrelated homepage, icon, deployment, and documentation changes into one commit unless they are genuinely part of the same change.

### 4. Verify before merging

Before a change reaches `main`:

1. Check the changed files and the diff.
2. Verify the page visually at desktop and mobile sizes.
3. Check that images and links load from the deployed site.
4. Check GitHub Actions / GitHub Pages deployment status.
5. Confirm that unrelated pages and sections were not changed.

### 5. Merge only the verified result

After verification, merge the focused branch into `main`. Do not reset `main` to an older commit just to recover from a styling mistake unless the exact previous state has been identified and intentionally restored.

## Current icon rule

The website's web asset is:

```text
assets/vex-icon.png
```

Keep the web icon in the website repository rather than depending on a moving path in the VEX application repository. The current homepage references the stable `main` asset URL.

The VEX application repository has its own application icon at `resources/icon.png`; that is a separate application asset and should not be confused with the web asset.

## Current homepage sizing note

The homepage layout is intended to have the large VEX mascot on the **right side** of the hero on desktop, with the text and actions on the left.

The desired desktop hero treatment is a large but controlled mascot rather than an image that expands far beyond its hero column. The current `styles.css` should be checked before the next homepage polish because the present `.hero-icon` rules use an unusually large `1050px` width / `155%` sizing treatment. Do not change that sizing as part of documentation-only work; it is tracked here as a visual follow-up.

## What is still needed

### Website

- [ ] Finalize the homepage mascot size/position without disturbing the preferred hero composition.
- [ ] Verify the small VEX icon renders reliably in the navigation and other compact locations.
- [ ] Keep the GitHub mark consistent everywhere on the site.
- [ ] Finish visual polish for the **A glimpse of VEX** section while keeping the preview compact.
- [ ] Add the eventual simplified VEX mascot/icon when the final simplified asset is ready.
- [ ] Continue adding secondary pages only when their content and design are ready.

### VEX application integration

- [ ] Connect the website's visual language to the actual VEX Electron UI where appropriate.
- [ ] Add an accurate, maintained application preview once the real UI is stable.
- [ ] Keep website claims synchronized with what the VEX application actually supports.

### Deployment

- [ ] Confirm the final GitHub Pages production URL.
- [ ] Decide whether to keep the GitHub Pages domain or add a custom domain later.
- [ ] Remove any duplicate deployment workflow once the preferred Pages workflow is confirmed.

## GitHub Pages

The repository already contains GitHub Pages deployment workflows under `.github/workflows/` and is configured as a static site. Changes pushed to `main` are intended to trigger the Pages deployment.

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
