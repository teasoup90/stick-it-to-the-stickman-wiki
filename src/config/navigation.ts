export type NavigationItem = {
  key: string;
  path: `/${string}`;
  isContentType: boolean;
};

/**
 * Content type slugs come from the long-tail keyword clustering categories and
 * must match the article subdirectories under content/<locale>/ one-to-one.
 * `key` is the translation key (en.json `nav` and top-level section), `path`
 * is the URL path — both are required by every consumer of this config.
 */
export const NAVIGATION_CONFIG = [
  { key: "characters", path: "/characters", isContentType: true },
  { key: "community", path: "/community", isContentType: true },
  { key: "guide", path: "/guide", isContentType: true },
  { key: "multiplayer", path: "/multiplayer", isContentType: true },
  { key: "platforms", path: "/platforms", isContentType: true },
  { key: "progression", path: "/progression", isContentType: true },
  { key: "resources", path: "/resources", isContentType: true },
  { key: "updates", path: "/updates", isContentType: true },
] satisfies readonly NavigationItem[];

export type NavigationKey = NavigationItem["key"];
export type ContentType = NavigationItem["key"];

export const CONTENT_TYPES = NAVIGATION_CONFIG
  .filter((item) => item.isContentType)
  .map((item) => item.key) as ContentType[];
