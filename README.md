# Game Wiki Meta Template

Protected, game-neutral Next.js source template for the Game Wiki launch pipeline. It retains the verified page architecture, metadata, sitemap, PWA, image fallback, and visual-quality fixes, but intentionally contains no game articles, domain, navigation, or game assets.

Do not deploy this directory. For each game, copy it to a new `<game-slug>-rebuild` directory and run the template launch pipeline with the completed data-job folder.

## Run locally

```bash
npm install
npm run dev
```

Production verification:

```bash
npm run type-check
npm run build
npm start
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin before deployment. Leave every advertising variable empty for a new site. After the optional Stage 8 advertising gate, add only that domain's Adsterra placement Keys in deployment environment variables and redeploy.

## Content workflow

Articles live outside `src`:

```text
content/en/[contentType]/[nested/path]/[slug].mdx
```

Each MDX file exports `metadata` and starts its visible headings at H2. The detail page renders the single H1 from `metadata.title`.

`src/lib/content.ts` recursively scans English MDX files, converts filenames to URL-safe slugs, imports the MDX module directly, extracts H2/H3 headings, and falls back to the English article when a localized file is absent.

The sitemap calls `getAllContentPaths()` and never derives article URLs from card arrays or navigation configuration.

## Add a language

Keep these three locations synchronized:

1. Add the locale to `src/i18n/routing.ts`.
2. Statically import its JSON file and add it to the `messages` object in `src/i18n/request.ts`.
3. Add the actual `src/locales/[locale].json` file.

Localized UI messages are deep-merged with English. Add translated articles under `content/[locale]/...`; missing articles fall back to English.

## Configuration

- `src/config/navigation.ts`: navigation and content-type source.
- `src/locales/en.json`: home and listing-page interface copy.
- `src/app/globals.css`: theme tokens including `--nav-theme`.
- `brand-spec.md`: reference pages, tokens, local assets and their sources.
- `src/components/ads.tsx` and `src/config/ads.ts`: opt-in Adsterra components and placement configuration. Empty or `0` Keys render no DOM, script, or reserved space. Banner placements are isolated in their own sandboxed iframe; do not hard-code Keys or enable Popunder, Smartlink, or Social Bar.
- `public/ads.txt`: replace its placeholder with the current site's authorized seller record only when AdSense is configured.
