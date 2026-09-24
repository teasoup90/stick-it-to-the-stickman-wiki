import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";

/**
 * Indexing gate: a project copied from this template stays unindexable until
 * the launch validator passes and NEXT_PUBLIC_INDEXABLE=true is set for the
 * production environment. The raw template therefore never invites crawling.
 */
const INDEXABLE = process.env.NEXT_PUBLIC_INDEXABLE === "true";

export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITE_URL}/sitemap.xml`, host: SITE_URL };
}
