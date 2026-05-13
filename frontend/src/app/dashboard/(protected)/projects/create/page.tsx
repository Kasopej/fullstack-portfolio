'use client'
import PageToolbar from '@/components/Toolbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import dynamic from 'next/dynamic'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { httpClient } from '@/lib/http/http.client'
import { notifyError } from '@/lib/utils/client/errors.utils'
import { CreateProjectSchema, Project, Skill } from '@/schemas'
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxItem, ComboboxList, Value } from '@/components/ui/combobox'
import { useDebounce } from 'use-debounce'
import { ExternalLinkIcon, GithubIcon, Loader2Icon } from 'lucide-react'
import { FileUploader } from '@/components/File/FileUploader'
import { uniqBy } from 'lodash-es'

const HtmlEditor = dynamic(() => import('@/components/Editors/HtmlEditor'), { ssr: false })

export default function CreateProjectPage() {
  const formContext = useForm({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: {
      title: '',
      description: '',
      html: '',
      skills: [],
    },
  })

  const [skillsSearch, setSkillsSearch] = useState('')
  const [isLoadingSkills, setIsLoadingSkills] = useState(false)
  const [debouncedSkillsSearch] = useDebounce(skillsSearch, 1000)
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([])
  const selectedSkills = formContext.watch('skills')
  const coverImage = formContext.watch('coverImage')

  const filteredSkills = useMemo(
    () =>
      availableSkills.filter(skill =>
        !selectedSkills.some(selectedSkill => selectedSkill.label === skill.name),
      ),
    [availableSkills, selectedSkills],
  )
  const searchSkills = useCallback(async () => {
    if (!debouncedSkillsSearch) {
      setAvailableSkills([])
      return
    }
    try {
      setIsLoadingSkills(true)
      const response = await httpClient.request<Skill[]>('/skills', {
        method: 'GET',
        params: {
          name: debouncedSkillsSearch,
        },
      })
      setAvailableSkills(uniqBy(response.data.concat({ name: debouncedSkillsSearch }), 'name'))
    }
    catch (error) {
      notifyError(error)
    }
    finally {
      setIsLoadingSkills(false)
    }
  }, [debouncedSkillsSearch])

  useEffect(() => {
    searchSkills()
  }, [searchSkills])
  const anchorRef = useRef<HTMLDivElement>(null)

  const submitProject = useCallback(async (data: z.infer<typeof CreateProjectSchema>) => {
    const formattedData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
      ...data,
      skills: data.skills.map(skill => ({
        name: skill.label,
      })),
    }
    try {
      await httpClient.request('/projects', {
        method: 'POST',
        data: formattedData,
      })
    }
    catch (error) {
      notifyError(error)
    }
  }, [])
  return (
    <main className="grid lg:grid-cols-[1fr_280px] gap-8">
      <PageToolbar>
        <Button size="lg" form="project-form" type="submit" disabled={!formContext.formState.isValid}>
          Publish Project
        </Button>
      </PageToolbar>
      <FormProvider {...formContext}>
        <form id="project-form" className="project-details w-full flex flex-col gap-4" onSubmit={formContext.handleSubmit(submitProject)}>
          <FormField
            control={formContext.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="p-4 w-full border-none border-b font-bold text-3xl"
                    placeholder="Project Title (e.g Fintrack Saas)"
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
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={formContext.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <textarea className="w-full h-30 p-4 bg-background" placeholder="Project Description" {...field} />
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
              <CardTitle>Project Details (Architecture, challenges, diagrams, impact etc.)</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={formContext.control}
                name="html"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <HtmlEditor onProcessEnd={content => field.onChange(content)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              >
              </FormField>
            </CardContent>
          </Card>
        </form>
        <section className="project-meta flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="pb-4 border-b border-input">Tech Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={formContext.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Combobox
                        items={filteredSkills.map(item => ({ value: item.name, label: item.name }))}
                        multiple
                        value={field.value}
                        onValueChange={(values) => {
                          console.log({ values })
                          field.onChange(values)
                        }}
                        onInputValueChange={setSkillsSearch}
                      >
                        <ComboboxChips ref={anchorRef}>
                          {field.value?.map(item => (
                            <ComboboxChip key={item.label}>
                              {item.label}
                            </ComboboxChip>
                          ))}
                          <ComboboxChipsInput placeholder="Add..." />
                          {isLoadingSkills && <Loader2Icon className="ml-auto text-primary animate-spin" />}
                        </ComboboxChips>

                        <ComboboxContent anchor={anchorRef}>
                          <ComboboxList>
                            {((item: Value) => (
                              <ComboboxItem key={item.value} value={item}>
                                {item.label}
                              </ComboboxItem>
                            ))}
                          </ComboboxList>
                        </ComboboxContent>
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
              <CardTitle className="pb-4 border-b border-input">Project Links</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <FormField
                control={formContext.control}
                name="projectUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project URL</FormLabel>
                    <FormControl>
                      <Input className="bg-background" placeholder="https://example.com" prefixEl={<ExternalLinkIcon className="size-3.5" />} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              >
              </FormField>
              <FormField
                control={formContext.control}
                name="repoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repo</FormLabel>
                    <FormControl>
                      <Input className="bg-background" placeholder="https://github.com/..." prefixEl={<GithubIcon className="size-3.5" />} {...field} />
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
                      <FileUploader noContent shouldUpload onUrlChange={urls => field.onChange(urls[0])} triggerEl={({ trigger }) => <Button className="w-full" onClick={trigger}>Upload Cover Image</Button>} />
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
