import { DateString, ms } from '@/types'
import { User } from '@/types/auth.types'
import z from 'zod'

export const SkillSchema = z.object({
  name: z.string().nonempty('Skill name is required'),
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const OptionalUrlSchema = z.url().optional().transform(value => value || undefined)
export type Skill = z.infer<typeof SkillSchema>
export const ProjectSchema = z.object({
  title: z.string().nonempty('Project title is required'),
  description: z.string().nonempty('Project description is required'),
  html: z.string().nonempty('Project details are required'),
  skills: z.array(SkillSchema),
  projectUrl: z.preprocess(val => !val ? undefined : val, z.url().optional().transform(value => value || undefined)) as unknown as typeof OptionalUrlSchema,
  repoUrl: z.preprocess(val => !val ? undefined : val, z.url().optional().transform(value => value || undefined)) as unknown as typeof OptionalUrlSchema,
  coverImage: z.url(),
})
export type Project = z.infer<typeof ProjectSchema> & {
  id: number
  createdAt: DateString
  updatedAt: DateString
  publish: boolean
}

export const CreateProjectSchema = ProjectSchema.omit({ skills: true }).extend({
  skills: z.array(z.object({
    value: z.string(),
    label: z.string(),
  })),
})
export type CreateProject = z.infer<typeof CreateProjectSchema>

export const TagSchema = z.object({
  name: z.string().nonempty('Tag name is required'),
})
export type Tag = z.infer<typeof TagSchema>
export const BlogPostSchema = z.object({
  title: z.string().nonempty('Blog post title is required'),
  description: z.string().nonempty('Blog post description is required'),
  html: z.string().nonempty('Blog post details are required'),
  coverImage: z.url(),
  tags: z.array(TagSchema),
})
export type BlogPost = z.infer<typeof BlogPostSchema> & {
  id: number
  createdAt: DateString
  updatedAt?: DateString
  estimatedReadingTime?: ms
  author: User
  publish: boolean
}

export const CreateBlogPostSchema = BlogPostSchema.omit({ tags: true }).extend({
  tags: z.array(z.object({
    value: z.string(),
    label: z.string(),
  })),
})
export type CreateBlogPost = z.infer<typeof CreateBlogPostSchema>
