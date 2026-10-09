import { Link } from 'react-router-dom';
import {
   ArrowRight,
   Bot,
   Brain,
   Code2,
   Database,
   MessageSquare,
   Server,
   Sparkles,
   Star,
   Ticket,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const skills = [
   {
      icon: Brain,
      title: 'LLM Fundamentals',
      desc: 'Understanding Large Language Models, tokens, context windows, and model settings',
   },
   {
      icon: Sparkles,
      title: 'Prompt Engineering',
      desc: 'Writing effective prompts using proven techniques for reliable AI outputs',
   },
   {
      icon: Bot,
      title: 'Chatbot Development',
      desc: 'Building a full-stack chatbot with clean architecture from scratch',
   },
   {
      icon: Star,
      title: 'Review Summarizer',
      desc: 'Creating an AI tool that condenses customer reviews into actionable insights',
   },
   {
      icon: Server,
      title: 'Backend APIs',
      desc: 'Express, Prisma, and database design for AI-powered applications',
   },
   {
      icon: Code2,
      title: 'Modern Tooling',
      desc: 'Bun, Tailwind CSS, shadcn/ui, TanStack Query, and React 19',
   },
];

const projects = [
   {
      icon: MessageSquare,
      title: 'Theme Park Chatbot',
      desc: 'A bilingual (EN/AR) AI chatbot that answers questions about tickets, rides, dining, and hotels for an imaginary theme park.',
      to: '/chat',
      cta: 'Try the Chatbot',
   },
   {
      icon: Star,
      title: 'Review Summarizer',
      desc: 'Condenses customer reviews into clear, actionable insights with AI-generated summaries and caching.',
      to: '/summary',
      cta: 'View Reviews',
   },
];

export function HomePage() {
   return (
      <div className="space-y-12 py-8">
         <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25">
               <Ticket className="size-8" />
            </div>
            <div className="space-y-2">
               <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Build Full-Stack AI-Powered Apps
               </h1>
               <p className="max-w-lg text-muted-foreground">
                  A hands-on Udemy course by Code with Mosh that teaches you how
                  to build production-ready applications powered by AI — no ML
                  background needed.
               </p>
            </div>
         </div>

         <section className="space-y-4">
            <h2 className="text-center text-lg font-semibold tracking-tight">
               What You'll Learn
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
               {skills.map(({ icon: Icon, title, desc }) => (
                  <div
                     key={title}
                     className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm transition-all hover:border-violet-500/30 hover:shadow-md"
                  >
                     <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
                        <Icon className="size-4.5" />
                     </div>
                     <h3 className="mb-1 text-sm font-semibold">{title}</h3>
                     <p className="text-xs leading-relaxed text-muted-foreground">
                        {desc}
                     </p>
                  </div>
               ))}
            </div>
         </section>

         <section className="space-y-4">
            <h2 className="text-center text-lg font-semibold tracking-tight">
               What You'll Build
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
               {projects.map(({ icon: Icon, title, desc, to, cta }) => (
                  <div
                     key={title}
                     className="flex flex-col rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-all hover:border-violet-500/30 hover:shadow-md"
                  >
                     <div className="mb-3 flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-linear-to-br from-violet-500 to-fuchsia-500 text-white">
                           <Icon className="size-4" />
                        </div>
                        <h3 className="text-sm font-semibold">{title}</h3>
                     </div>
                     <p className="mb-4 flex-1 text-xs leading-relaxed text-muted-foreground">
                        {desc}
                     </p>
                     <Link to={to}>
                        <Button
                           size="sm"
                           variant="outline"
                           className="w-full gap-1.5"
                        >
                           {cta}
                           <ArrowRight className="size-3.5" />
                        </Button>
                     </Link>
                  </div>
               ))}
            </div>
         </section>

         <section className="space-y-4">
            <h2 className="text-center text-lg font-semibold tracking-tight">
               Course Certificate
            </h2>
            <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-border/60 bg-card/50 p-8 text-center">
               <Database className="size-10 text-muted-foreground/50" />
               <p className="text-sm text-muted-foreground">
                  Add your course certificate image here
               </p>
               <p className="text-xs text-muted-foreground/70">
                  Place the image in{' '}
                  <code className="rounded bg-muted px-1">
                     public/certificate.png
                  </code>{' '}
                  and update the src below
               </p>
               <img
                  src="/certificate.png"
                  alt="Course Certificate"
                  className="hidden max-w-full rounded-xl border border-border/60 shadow-lg"
                  onError={(e) => {
                     (e.target as HTMLImageElement).style.display = 'none';
                  }}
               />
            </div>
         </section>
      </div>
   );
}
