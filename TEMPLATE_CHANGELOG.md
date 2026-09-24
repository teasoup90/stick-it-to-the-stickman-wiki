# Template Changelog

The `VERSION` file is the source of truth for the template version. Every copy
of this template carries it, so every launched site can report which template
version it was built from. Bump the version for every change to `src/`,
`scripts/`, `content/` structure, or this contract.

## v2 — 2026-09-04 (feat-098)

- `scripts/validate-seo.mjs` extended from a title-length check into a real
  launch gate: domain placeholder detection, `{{...}}` / `example.com`
  placeholder scan, empty-content and empty-navigation blockers, version
  consistency check, and an indexing-state report.
- `src/app/robots.ts` now gates indexing behind `NEXT_PUBLIC_INDEXABLE=true`;
  the template and any unfinished copy respond `Disallow: /` until the launch
  gate passes and indexing is explicitly enabled.
- `src/app/sitemap.ts`: static pages no longer fake `lastModified` with build
  time (they inherit the newest article date instead); the leftover
  game-specific `/bosses/` change-frequency rule was removed in favor of a
  content-type map (`updates` / `news` → weekly, everything else → monthly).
- `src/config/site.ts` exposes `TEMPLATE_VERSION` for built sites and the
  validator cross-checks it against the `VERSION` file.

## v1 — 2026-07-16

- Initial meta template: transformed from the `vvultimatum_sbs` course clone
  into a protected, reusable game-wiki template (ad system, SEO helpers,
  structured data, brand spec, template contract, title validation).
