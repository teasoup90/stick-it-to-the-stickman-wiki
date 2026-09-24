export type NavigationItem = {
  key: string;
  path: string;
  isContentType: boolean;
};

export const NAVIGATION_CONFIG: readonly NavigationItem[] = [];

export type NavigationKey = NavigationItem["key"];
export type ContentType = NavigationItem["key"];

export const CONTENT_TYPES = NAVIGATION_CONFIG
  .filter((item) => item.isContentType)
  .map((item) => item.key) as ContentType[];
