import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: ["rehype-slug", ["rehype-autolink-headings", { behavior: "wrap" }]]
  }
});
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(withMDX({
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: { formats: ["image/avif", "image/webp"] }
}));
