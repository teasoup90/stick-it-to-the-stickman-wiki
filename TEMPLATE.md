# Meta Template Contract

This directory is a protected source template. It must never be linked to Vercel, assigned a production domain, or edited for a specific game.

## New Game Procedure

1. Copy this directory to `D:\网站出海\<game-slug>-rebuild`.
2. Run the Game Wiki template launch pipeline against the new directory only.
3. Create a distinct Vercel project for that game.
4. Keep the resulting project and domain isolated from every other game.

## Required Replacement Areas

- `src/locales/en.json` placeholders and all later locale files
- `src/config/site.ts` fallback URL and external links
- favicon, Hero image, and category/article media
- content, navigation, structured data, legal copy, and sitemap configuration

## Template Versioning

- The `VERSION` file is the source of truth for the template version; `src/config/site.ts` must export the same value as `TEMPLATE_VERSION` (the validator enforces the match).
- Every copy carries `VERSION`, so each launched site can report which template version it was built from. Record the version in the site's launch manifest.
- Bump the version and append to `TEMPLATE_CHANGELOG.md` for every change to `src/`, `scripts/`, `content/` structure, or this contract.

## Indexing Gate

`src/app/robots.ts` refuses crawling (`Disallow: /`) until `NEXT_PUBLIC_INDEXABLE=true` is set. Enable indexing only after the launch gate below passes for the new project.

## Verification Gate

Before any Preview, the new project must pass type checking, production build, `npm run validate:seo` (launch gate: real domain, no placeholders, non-empty navigation and content, matching version), sitemap validation, and desktop/mobile visual inspection. A blank advertising block, leftover prior-game media, or prior-game wording is a release blocker.
