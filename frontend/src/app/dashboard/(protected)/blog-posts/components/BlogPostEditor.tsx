'use client'
import PageToolbar from '@/components/Toolbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import dynamic from 'next/dynamic'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { httpClient } from '@/lib/http/http.client'
import { notifyError } from '@/lib/utils/client/errors.utils'
import { BlogPost, CreateBlogPostSchema, Skill, Tag } from '@/schemas'
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxItem, ComboboxList, ComboboxWrapper, Value } from '@/components/ui/combobox'
import { useDebounce } from 'use-debounce'
import { Loader2Icon } from 'lucide-react'
import { FileUploader } from '@/components/File/FileUploader'
import { uniqBy } from 'lodash-es'
import { queryAPI } from '@/queries/api'
import { useRouter } from 'next/navigation'

const HtmlEditor = dynamic(() => import('@/components/Editors/HtmlEditor'), { ssr: false })

type Props = {
  mode: 'create'
  post?: never
} | {
  mode: 'edit'
  post: BlogPost
}
export default function BlogPostEditor({ mode, post }: Props) {
  const formContext = useForm({
    resolver: zodResolver(CreateBlogPostSchema),
    defaultValues: mode === 'edit' && post
      ? {
          title: post.title,
          description: post.description,
          html: post.html,
          tags: post.tags.map(tag => ({ value: tag.name, label: tag.name })),
          coverImage: post.coverImage,
        }
      : {
          title: '',
          description: '',
          html: '',
          tags: [],
          coverImage: '',
        },
  })

  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tagsSearch, setTagsSearch] = useState('')
  const [isLoadingTags, setIsLoadingTags] = useState(false)
  const [debouncedTagsSearch] = useDebounce(tagsSearch, 1000)
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const selectedTags = formContext.watch('tags')
  const coverImage = formContext.watch('coverImage')

  const filteredTags = useMemo(
    () =>
      availableTags.filter(tag =>
        !selectedTags.some(selectedTag => selectedTag.label === tag.name),
      ),
    [availableTags, selectedTags],
  )
  const searchTags = useCallback(async () => {
    try {
      setIsLoadingTags(true)
      const response = await httpClient.request<Skill[]>('/tags', {
        method: 'GET',
        params: {
          name: debouncedTagsSearch,
        },
      })
      setAvailableTags(uniqBy(response.data.concat(debouncedTagsSearch ? { name: debouncedTagsSearch } : []), 'name'))
    }
    catch (error) {
      notifyError(error)
    }
    finally {
      setIsLoadingTags(false)
    }
  }, [debouncedTagsSearch])

  useEffect(() => {
    searchTags()
  }, [searchTags])
  const anchorRef = useRef<HTMLDivElement>(null)

  const submitPost = useCallback(async (data: z.infer<typeof CreateBlogPostSchema>, publish = true) => {
    const formattedData: Omit<BlogPost, 'id' | 'author' | 'createdAt' | 'updatedAt'> = {
      ...data,
      tags: data.tags.map(tag => ({
        name: tag.label,
      })),
      publish,
    }
    try {
      setIsSubmitting(true)
      await httpClient.request(mode === 'edit' ? `/blog-post/${post?.id}` : '/blog-post', {
        method: mode === 'edit' ? 'PATCH' : 'POST',
        data: formattedData,
      })
      queryAPI.util.invalidateTags(['BlogPost'])
      router.push('/dashboard/blog-posts')
    }
    catch (error) {
      notifyError(error)
    }
    finally {
      setIsSubmitting(false)
    }
  }, [mode, post?.id, router])
  return (
    <main className="grid lg:grid-cols-[1fr_280px] gap-8">
      <PageToolbar>
        <Button size="lg" variant="ghost" type="button" disabled={!formContext.formState.isValid || isSubmitting} loading={isSubmitting} onClick={() => formContext.trigger().then(result => void (result && submitPost(formContext.getValues(), false)))}>
          Save Draft
        </Button>
        <Button size="lg" form="post-form" type="submit" disabled={!formContext.formState.isValid} loading={isSubmitting}>
          Publish Post
        </Button>
      </PageToolbar>
      <FormProvider {...formContext}>
        <form id="post-form" className="post-details w-full flex flex-col gap-4" onSubmit={formContext.handleSubmit(data => submitPost(data))}>
          <FormField
            control={formContext.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="p-4 w-full border-none border-b font-bold text-3xl"
                    placeholder="Post Title (e.g My First Blog Post)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          >
          </FormField>
          <Card>
            <CardHeader>
              <CardTitle>Post Description</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={formContext.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <textarea className="w-full h-30 p-4 bg-background" placeholder="Post Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              >
              </FormField>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={formContext.control}
                name="html"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <HtmlEditor onProcessEnd={content => field.onChange(content)} presetContent={mode === 'edit' ? formContext.formState.defaultValues?.html : ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              >
              </FormField>
            </CardContent>
          </Card>
        </form>
        <section className="post-meta flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="pb-4 border-b border-input">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={formContext.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Combobox
                        items={filteredTags.map(item => ({ value: item.name, label: item.name }))}
                        multiple
                        autoHighlight
                        value={field.value}
                        onValueChange={(values) => {
                          console.log({ values })
                          field.onChange(values)
                        }}
                        onInputValueChange={setTagsSearch}
                      >
                        <ComboboxWrapper popupId="tags-combobox" items={filteredTags.map(item => ({ value: item.name, label: item.name }))}>
                          <ComboboxChips ref={anchorRef}>
                            {field.value?.map(item => (
                              <ComboboxChip key={item.label}>
                                {item.label}
                              </ComboboxChip>
                            ))}
                            <ComboboxChipsInput placeholder="Add..." />
                            {isLoadingTags && <Loader2Icon className="ml-auto text-primary animate-spin" />}
                          </ComboboxChips>

                          <ComboboxContent anchor={anchorRef} id="tags-combobox">
                            <ComboboxList>
                              {((item: Value) => (
                                <ComboboxItem key={item.value} value={item}>
                                  {item.label}
                                </ComboboxItem>
                              ))}
                            </ComboboxList>
                          </ComboboxContent>
                        </ComboboxWrapper>
                      </Combobox>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              >
              </FormField>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="pb-4 border-b border-input">Cover Image</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {coverImage && <img src={coverImage} className="w-full aspect-video object-cover" alt="Cover Image" />}
              <FormField
                control={formContext.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUploader
                        noContent
                        shouldUpload
                        onUrlChange={urls => field.onChange(urls[0])}
                        triggerEl={({ trigger }) => (
                          <Button className="w-full" onClick={trigger}>
                            {
                              coverImage ? 'Change Cover Image' : 'Upload Cover Image'
                            }
                          </Button>
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              >
              </FormField>
            </CardContent>
          </Card>
        </section>
      </FormProvider>
    </main>
  )
}
