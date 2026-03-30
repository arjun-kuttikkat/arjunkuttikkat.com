import "server-only";

import { compileMDX } from "next-mdx-remote/rsc";
import type { Element } from "hast";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { getBlogMdxComponents } from "../../components/blog/mdx-components";

function headingLinkTest(node: Element) {
  return node.tagName === "h2" || node.tagName === "h3" || node.tagName === "h4";
}

export async function compileBlogMdx(source: string) {
  const { content } = await compileMDX({
    source,
    components: getBlogMdxComponents(),
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "append",
              test: headingLinkTest,
              properties: {
                className: ["blog-heading-permalink"],
                ariaLabel: "Link to this section"
              },
              content: {
                type: "element",
                tagName: "span",
                properties: { className: ["blog-heading-hash"] },
                children: [{ type: "text", value: " #" }]
              }
            }
          ],
          [
            rehypePrettyCode,
            {
              theme: "github-dark",
              keepBackground: true
            }
          ]
        ]
      }
    }
  });

  return content;
}
