import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function CreateProjectPage() {
  return (
    <main className="grid lg:grid-cols-[1fr_280px] gap-8">
      <section className="project-details w-full flex flex-col gap-4">
        <Input
          className="p-4 w-full border-none border-b font-bold text-3xl"
          placeholder="Project Title (e.g Fintrack Saas)"
        />
        <Card>
          <CardHeader>
            <CardTitle>Project Description</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea className="w-full h-30 p-4 bg-background" placeholder="Project Description" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Project Details (Architecture, challenges, diagrams, impact etc.)</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea className="w-full h-30 p-4 bg-background" placeholder="Project Details" />
          </CardContent>
        </Card>
      </section>
      <section className="project-meta"></section>
    </main>
  )
}
