import type { Metadata } from 'next'
import Image from 'next/image'
import { GithubIcon, LinkedinIcon, MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react'
import Me from '../../../../public/me.jpg'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact | Kasope Johnson',
  description: 'Get in touch with Kasope Johnson, a Full Stack Developer based in Lagos, Nigeria.',
}

export default function ContactPage() {
  return (
    <main className="w-full max-w-4xl mx-auto px-4 py-12 sm:px-8 sm:py-20">
      <section aria-labelledby="contact-heading" className="overflow-hidden rounded-2xl border bg-card text-card-foreground">
        <header className="border-b px-6 py-8 sm:px-10">
          <h1 id="contact-heading" className="text-3xl font-semibold tracking-tight">Contact details</h1>
        </header>

        <div className="space-y-10 p-6 sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <Image
              src={Me}
              alt="Kasope Johnson"
              width={144}
              height={144}
              sizes="144px"
              className="size-36 shrink-0 rounded-full border object-cover"
              priority
            />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Full name</p>
              <p className="text-2xl font-semibold">Kasope Johnson</p>
              <p className="text-muted-foreground">Full Stack Developer</p>
            </div>
          </div>

          <dl className="grid gap-8 sm:grid-cols-2">
            <div className="flex gap-4">
              <MapPinIcon aria-hidden="true" className="mt-1 size-5 shrink-0 text-muted-foreground" />
              <div className="space-y-1">
                <dt className="text-sm text-muted-foreground">Address / Location</dt>
                <dd>Lagos, Nigeria</dd>
              </div>
            </div>
            <div className="flex gap-4">
              <MailIcon aria-hidden="true" className="mt-1 size-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0 space-y-1">
                <dt className="text-sm text-muted-foreground">Email</dt>
                <dd><a href="mailto:kasopej@gmail.com" className="break-all hover:underline focus-visible:outline-offset-4">kasopej@gmail.com</a></dd>
              </div>
            </div>
          </dl>

          <div className="flex flex-wrap gap-4 border-t pt-8">
            <Link href="https://github.com/Kasopej" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium hover:bg-muted focus-visible:outline-offset-4">
              <GithubIcon aria-hidden="true" className="size-5" />
              GitHub
              <span className="sr-only"> (opens in Link new tab)</span>
            </Link>
            <Link href="https://www.linkedin.com/in/kasopejohnson" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium hover:bg-muted focus-visible:outline-offset-4">
              <LinkedinIcon aria-hidden="true" className="size-5" />
              LinkedIn
              <span className="sr-only"> (opens in Link new tab)</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
