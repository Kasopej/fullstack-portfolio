import { DateString, ms } from '@/types'
import z from 'zod'

export const SkillSchema = z.object({
  name: z.string().nonempty('Skill name is required'),
})
export type Skill = z.infer<typeof SkillSchema>
export const ProjectSchema = z.object({
  title: z.string().nonempty('Project title is required'),
  description: z.string().nonempty('Project description is required'),
  html: z.string().nonempty('Project details are required'),
  skills: z.array(SkillSchema),
  projectUrl: z.url().optional(),
  repoUrl: z.url().optional(),
  coverImage: z.url().optional(),
})
export type Project = z.infer<typeof ProjectSchema> & {
  id: string
  createdAt: DateString
  updatedAt: DateString
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
  image: z.string().optional(),
  tags: z.array(TagSchema),
})
export type BlogPost = z.infer<typeof BlogPostSchema> & {
  id: string
  createdAt: DateString
  updatedAt?: DateString
  estimatedReadingTime?: ms
}
