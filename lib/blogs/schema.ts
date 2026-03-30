import { z } from "zod";

export const blogFrontmatterSchema = z.object({
  title: z.string().min(1, "title is required"),
  description: z.string().min(1, "description is required"),
  slug: z
    .string()
    .min(1)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "slug must be lowercase kebab-case (letters, numbers, hyphens)"
    ),
  date: z.string().min(1, "date is required (ISO recommended)"),
  updatedAt: z.string().optional(),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).default([]),
  category: z.string().min(1, "category is required"),
  featured: z.boolean().default(false),
  published: z.boolean(),
  author: z.string().min(1, "author is required"),
  authorRole: z.string().optional(),
  readingBadge: z.string().optional(),
  excerpt: z.string().optional()
});

export type BlogFrontmatterInput = z.infer<typeof blogFrontmatterSchema>;
