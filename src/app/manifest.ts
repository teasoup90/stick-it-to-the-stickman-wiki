import type { MetadataRoute } from "next";
import en from "@/locales/en.json";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: en.site.wikiName,
    short_name: en.site.shortName,
    description: en.site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#111111",
    theme_color: "#E53935",
    icons: [
      { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
    ]
  };
}
