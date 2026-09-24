export const MAX_TITLE_LENGTH = 60;

/**
 * Keeps the rendered document title within the launch SEO budget. When the
 * article title already uses the available space, preserving that descriptive
 * title is more useful than appending a truncated site name.
 */
export function composeDocumentTitle(title: string, siteName: string) {
  const complete = `${title} — ${siteName}`;
  return complete.length <= MAX_TITLE_LENGTH ? complete : title;
}
