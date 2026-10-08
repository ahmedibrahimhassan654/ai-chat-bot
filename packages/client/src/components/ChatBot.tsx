import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
   AlertCircle,
   Bot,
   Castle,
   Loader2,
   Plus,
   Send,
   Sparkles,
   Ticket,
   User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type Role = 'user' | 'assistant';

interface ChatMessage {
   id: string;
   role: Role;
   content: string;
   timestamp: Date;
}

const SUGGESTIONS = [
   { icon: Ticket, label: 'How much are tickets?' },
   { icon: Castle, label: 'Best rides for a 5-year-old?' },
   { icon: Sparkles, label: 'What time are the fireworks?' },
   { icon: Bot, label: 'Tell me about the hotel options' },
];

const ChatBot = () => {
   const [messages, setMessages] = useState<ChatMessage[]>([]);
   const [input, setInput] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const conversationIdRef = useRef<string>(crypto.randomUUID());
   const scrollRef = useRef<HTMLDivElement>(null);
   const textareaRef = useRef<HTMLTextAreaElement>(null);

   useEffect(() => {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
   }, [messages, isLoading]);

   const sendMessage = useCallback(
      async (text: string) => {
         const prompt = text.trim();
         if (!prompt || isLoading) return;

         setError(null);
         setInput('');
         if (textareaRef.current) textareaRef.current.style.height = 'auto';

         setMessages((prev) => [
            ...prev,
            {
               id: crypto.randomUUID(),
               role: 'user',
               content: prompt,
               timestamp: new Date(),
            },
         ]);
         setIsLoading(true);

         try {
            const res = await fetch('/api/chat', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                  prompt,
                  conversationId: conversationIdRef.current,
               }),
            });

            if (!res.ok) throw new Error(`Request failed (${res.status})`);

            const data = (await res.json()) as { message?: string };

            setMessages((prev) => [
               ...prev,
               {
                  id: crypto.randomUUID(),
                  role: 'assistant',
                  content: data.message ?? 'No response received.',
                  timestamp: new Date(),
               },
            ]);
         } catch (err) {
            setError(
               err instanceof Error ? err.message : 'Something went wrong'
            );
         } finally {
            setIsLoading(false);
            textareaRef.current?.focus();
         }
      },
      [isLoading]
   );

   const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         void sendMessage(input);
      }
   };

   const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
      const el = e.target;
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
   };

   const resetConversation = () => {
      conversationIdRef.current = crypto.randomUUID();
      setMessages([]);
      setError(null);
      setInput('');
   };

   const formatTime = (date: Date) =>
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

   const isEmpty = messages.length === 0;

   return (
      <div className="flex h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/10">
         <header className="relative flex items-center gap-3 border-b border-border/60 bg-linear-to-r from-violet-500/10 via-card to-card px-5 py-4">
            <div className="relative">
               <div className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25">
                  <Castle className="size-5" />
               </div>
               <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-card bg-emerald-500" />
            </div>

            <div className="min-w-0 flex-1">
               <h1 className="truncate text-sm font-semibold tracking-tight">
                  WonderWorld Guest Assistant
               </h1>
               <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {isLoading ? (
                     <>
                        <Loader2 className="size-3 animate-spin" />
                        Checking the park guide…
                     </>
                  ) : (
                     <>
                        <Sparkles className="size-3" />
                        Online · Tickets, rides, dining & more
                     </>
                  )}
               </p>
            </div>

            <Button
               variant="outline"
               size="sm"
               onClick={resetConversation}
               className="gap-1.5"
            >
               <Plus className="size-3.5" />
               New chat
            </Button>
         </header>

         <div
            ref={scrollRef}
            className="flex-1 space-y-5 overflow-y-auto px-5 py-6"
            style={{
               backgroundImage:
                  'radial-gradient(circle at 1px 1px, color-mix(in oklch, var(--foreground) 7%, transparent) 1px, transparent 0)',
               backgroundSize: '22px 22px',
            }}
         >
            {isEmpty && (
               <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
                  <div className="flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500/20 to-fuchsia-500/5 ring-1 ring-border">
                     <Castle className="size-7 text-violet-500" />
                  </div>
                  <div className="space-y-1.5">
                     <h2 className="text-lg font-semibold tracking-tight">
                        Welcome to WonderWorld! 🏰
                     </h2>
                     <p className="max-w-sm text-sm text-muted-foreground">
                        Ask me about tickets, rides, dining, shows, hotels or
                        accessibility — I remember the whole conversation.
                     </p>
                  </div>
                  <div className="grid w-full max-w-md grid-cols-1 gap-2 sm:grid-cols-2">
                     {SUGGESTIONS.map(({ icon: Icon, label }) => (
                        <button
                           key={label}
                           onClick={() => void sendMessage(label)}
                           className="flex cursor-pointer items-center gap-2 rounded-xl border border-border/70 bg-card/80 px-3.5 py-2.5 text-left text-xs text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-violet-500/40 hover:bg-accent hover:text-foreground hover:shadow-md"
                        >
                           <Icon className="size-3.5 shrink-0 text-violet-500" />
                           {label}
                        </button>
                     ))}
                  </div>
               </div>
            )}

            {messages.map((m) => (
               <div
                  key={m.id}
                  className={cn(
                     'flex animate-in fade-in slide-in-from-bottom-2 gap-3 duration-300',
                     m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
               >
                  <div
                     className={cn(
                        'flex size-8 shrink-0 items-center justify-center rounded-lg shadow-sm',
                        m.role === 'user'
                           ? 'bg-primary text-primary-foreground'
                           : 'bg-linear-to-br from-violet-500 to-fuchsia-500 text-white'
                     )}
                  >
                     {m.role === 'user' ? (
                        <User className="size-4" />
                     ) : (
                        <Castle className="size-4" />
                     )}
                  </div>

                  <div
                     className={cn(
                        'flex max-w-[78%] flex-col gap-1',
                        m.role === 'user' ? 'items-end' : 'items-start'
                     )}
                  >
                     <div
                        className={cn(
                           'rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm',
                           m.role === 'user'
                              ? 'rounded-tr-sm bg-primary text-primary-foreground whitespace-pre-wrap'
                              : 'chat-markdown rounded-tl-sm border border-border/60 bg-card text-card-foreground'
                        )}
                     >
                        {m.role === 'user' ? (
                           m.content
                        ) : (
                           <Markdown remarkPlugins={[remarkGfm]}>
                              {m.content}
                           </Markdown>
                        )}
                     </div>
                     <span className="px-1 text-[10px] text-muted-foreground">
                        {formatTime(m.timestamp)}
                     </span>
                  </div>
               </div>
            ))}

            {isLoading && (
               <div className="flex animate-in fade-in gap-3 duration-300">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-violet-500 to-fuchsia-500 text-white">
                     <Castle className="size-4" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-border/60 bg-card px-4 py-3.5 shadow-sm">
                     <span className="size-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
                     <span className="size-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
                     <span className="size-2 animate-bounce rounded-full bg-muted-foreground/60" />
                  </div>
               </div>
            )}
         </div>

         {error && (
            <div className="mx-5 mb-2 flex animate-in fade-in items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
               <AlertCircle className="size-4 shrink-0" />
               {error}
            </div>
         )}

         <footer className="border-t border-border/60 bg-card/80 p-4 backdrop-blur">
            <div className="flex items-end gap-2 rounded-xl border border-input bg-background p-2 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30">
               <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about tickets, rides, hours, dining…  (Enter to send, Shift+Enter for new line)"
                  rows={1}
                  disabled={isLoading}
                  className="max-h-40 min-h-9 flex-1 resize-none border-0 bg-transparent px-2 py-1.5 text-sm shadow-none focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent"
               />
               <Button
                  size="icon"
                  onClick={() => void sendMessage(input)}
                  disabled={isLoading || !input.trim()}
                  className="size-9 shrink-0 rounded-lg bg-linear-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25 transition-transform enabled:hover:scale-105 enabled:active:scale-95"
               >
                  {isLoading ? (
                     <Loader2 className="size-4 animate-spin" />
                  ) : (
                     <Send className="size-4" />
                  )}
               </Button>
            </div>
            <p className="mt-2 px-1 text-center text-[10px] text-muted-foreground">
               WonderWorld Guest Assistant · AI can make mistakes — verify
               prices and hours before your visit.
            </p>
         </footer>
      </div>
   );
};

export default ChatBot;
