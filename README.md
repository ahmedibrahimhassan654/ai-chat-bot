# 🤖 AI Chat Bot — Full-Stack Conversational AI Application

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white" />
  <img alt="Express" src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white" />
  <img alt="Bun" src="https://img.shields.io/badge/Bun-1.4-000000?logo=bun&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss&logoColor=white" />
  <img alt="shadcn/ui" src="https://img.shields.io/badge/shadcn%2Fui-latest-000000?logo=shadcnui&logoColor=white" />
  <img alt="Groq" src="https://img.shields.io/badge/Groq-gpt--oss--20b-F55036?logo=groq&logoColor=white" />
  <img alt="Architecture" src="https://img.shields.io/badge/Architecture-Clean_%7C_3--Layer-success" />
</p>

<p align="center">
  <strong>Multi-turn AI chat with server-side memory · Clean Architecture backend · Dependency Injection · Zod validation</strong>
</p>

A production-minded, full-stack AI chat application built with **React 19**, **Express 5**, **TypeScript (strict mode)**, and the **Groq inference API** (running `openai/gpt-oss-20b`). The bot acts as a **bilingual (English / Arabic), domain-scoped customer support agent for "WonderWorld", a fictional theme park** — answering questions about tickets, rides, dining, hotels and accessibility from an injected knowledge base, replying in the guest's own language, and politely refusing off-topic requests. The backend is architected with **Clean Architecture principles** — a strict three-layer separation (Controller → Service → Repository) plus an externalized prompt layer, all wired with dependency injection — and the frontend is a polished, accessible chat UI built with **Tailwind CSS v4** and **shadcn/ui**.

> This project demonstrates more than "calling an AI API". It demonstrates **software engineering discipline**: separation of concerns, testable design, input validation at every boundary, type safety end-to-end, prompt/knowledge externalization, LLM guardrails, and professional developer tooling (monorepo, git hooks, formatting pipelines).

---

## 🎢 The Domain: WonderWorld Guest Assistant

Rather than a generic chatbot that answers anything, this bot is **scoped to a single business domain** — exactly how real companies ship AI support agents.

The model is grounded by a **system prompt assembled at runtime** from two externalized files:

| File                     | Role                                                                                                         |
| ------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `prompts/chatbot.txt`    | The agent **persona + behavioral rules** (tone, scope, anti-hallucination guards, bilingual language policy) |
| `prompts/WonderWorld.md` | The **knowledge base** — pricing tables, park hours, rides, hotels, dining, accessibility                    |

`prompts/index.ts` loads both and interpolates the knowledge base into the `{{parkInfo}}` placeholder, producing a single ~6,600-character system prompt. **No prompt text is hardcoded in application logic** — editing the park's prices, the agent's tone, or its language policy requires zero code changes.

### 🌍 Bilingual: English + Arabic

The agent is **fully bilingual**. It accepts a guest's message in English or Arabic — including colloquial dialects (Egyptian, Gulf, Levantine, Maghrebi, Iraqi) — and mirrors the guest's language in its reply.

Arabic replies are held to a strict quality policy enforced entirely through the prompt:

| Requirement                                                                                     | Why it matters                                                                                                                                           |
| ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reply in **Modern Standard Arabic (فصحى)**, never a local dialect                               | One consistent voice readable by every Arabic-speaking guest                                                                                             |
| Correct **spelling, hamza forms (أ إ آ ؤ ئ ء), taa marbuta (ة)** and Arabic punctuation (؟ ، ؛) | "Readable and correct Arabic words" — no sloppy machine output                                                                                           |
| **No Arabizi / Franco-Arabic** (`3aizan`, `7abibi`, `kam al ticket`)                            | Latin-letter Arabic looks unprofessional and is hard to read                                                                                             |
| **No transliteration** of ordinary English words                                                | Forces real Arabic meaning: `مؤثرات متحركة` (animations), `منطقة رشاشات مائية` (splash pad), `أرض الجنيات` (fairyland) — instead of phonetic `أنيماتيون` |
| **No language mixing** inside a sentence, table cell or label                                   | Proper nouns stay English; everything else is Arabic                                                                                                     |
| Ride/hotel names: **Arabic description first, official English name in parentheses**            | Guests recognize the official name while still reading natural Arabic                                                                                    |
| **Self-review pass** before sending                                                             | The model re-reads its own answer and fixes spelling, grammar and leftover English                                                                       |

### Guardrails in action (verified against the live API)

| Guest asks                                                 | Bot behaviour                                                                                                                      |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| "How much is a general admission ticket?"                  | ✅ Answers **$129** from the knowledge base, with cheerful tone                                                                    |
| "and how much for seniors?"                                | ✅ Uses conversation memory to infer context → **$99, valid ID required**                                                          |
| "What thrill rides for teenagers?"                         | ✅ Lists the 4 attractions for ages 10+ from the knowledge base                                                                    |
| "Write me a Python function to reverse a linked list"      | 🚫 Politely declines and redirects to WonderWorld topics                                                                           |
| "كم سعر تذكرة الدخول العامة؟" _(MSA Arabic)_               | ✅ Replies in correct MSA → **١٢٩ دولاراً أمريكياً**                                                                               |
| "عايز اعرف أحسن الألعاب للأطفال…كام؟" _(Egyptian dialect)_ | ✅ Understands the dialect, replies in **fusha** with an Arabic price table                                                        |
| "إيه مواعيد الحديقة؟" → "والمطاعم بتفتح امتى؟"             | ✅ Arabic multi-turn memory works; **honestly says** other restaurant hours aren't in the knowledge base instead of inventing them |
| "اكتبلي كود بايثون" _(off-topic, Arabic)_                  | 🚫 Declines **in Arabic**: "عذراً، يمكنني المساعدة في موضوعات WonderWorld فقط."                                                    |

---

## 📸 Features

### Chat Experience

- 💬 **Multi-turn conversations with memory** — the server maintains per-conversation message history, so follow-ups like _"and for seniors?"_ work without repeating context
- 📝 **Markdown rendering** — assistant replies render bold text, bullet lists and GFM **tables** (prices/hours) via `react-markdown` + `remark-gfm`
- ⌨️ **Smart input** — `Enter` to send, `Shift+Enter` for a new line, auto-growing textarea
- ⏳ **Real-time feedback** — animated typing indicator while the model is thinking
- ✨ **Empty state with domain-specific suggestion chips** — one click to ask about tickets, kids' rides, fireworks or hotels
- 🔄 **"New chat" button** — generates a fresh conversation UUID and resets history
- 🕐 **Message timestamps**, smooth entry animations, and auto-scroll to the latest message
- 🌗 **Full dark/light mode support** via CSS custom properties (OKLCH color space)

### AI / Prompt Engineering

- 🧠 **Externalized prompt layer** — persona, rules and knowledge base live in `prompts/`, not in code
- 🔧 **Template interpolation** — `{{parkInfo}}` placeholder, with a build-time guard that throws if the placeholder is missing
- 🚫 **Domain guardrails** — the agent refuses off-topic requests and is instructed never to invent facts
- 🎭 **Reasoning-model aware** — falls back to `message.reasoning` when a model returns no `content`
- 🌍 **Bilingual English + Arabic** — accepts Arabic dialects, replies in correct Modern Standard Arabic, with explicit anti-Arabizi and anti-transliteration rules
- ✂️ **Conciseness guard** — returns only the rows that answer the question, and `max_tokens` is raised to 4000 because Arabic tokenizes less densely than English (prevents mid-table truncation)
- 🧵 **System prompt is injected per-request, never persisted** — stored history stays clean, so the prompt can be changed without migrating or corrupting existing conversations

### Engineering

- 🏛️ **Clean Architecture backend** — Controllers, Services, and Repositories with strict Single Responsibility Principle
- 💉 **Dependency Injection** — every layer depends on abstractions (interfaces), not concrete implementations; the system prompt is injected through the composition root
- ✅ **Zod schema validation** — request bodies are validated and typed at the HTTP boundary
- 🔒 **Defense in depth** — the repository layer independently validates UUID format, so bad data can never reach storage
- 🛡️ **No secret leakage** — the API key is never exposed by any endpoint; `.env` is git-ignored
- 📦 **Bun monorepo workspaces** — client and server share one lockfile and run with a single command
- 🧰 **Professional tooling** — Husky pre-commit hooks, lint-staged, Prettier, ESLint (zero warnings), strict TypeScript

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          Browser (Client)                       │
│                                                                 │
│   React 19 + Vite + Tailwind CSS v4 + shadcn/ui                 │
│                                                                 │
│   ChatBot.tsx  ── fetch POST /api/chat ──►  Vite Dev Proxy      │
│   (state, animations,                          │                │
│    auto-scroll, error UI)                      │                │
└────────────────────────────────────────────────┼────────────────┘
                                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Express 5 (Server)                        │
│                                                                 │
│   routes.ts ──► ChatController ──► ChatService ──► Repository   │
│   (routing &       (HTTP layer)     (business       (data       │
│    DI wiring)       validation)      logic + AI)     access)    │
│        │                                  │                     │
│        │ injects                          ▼                     │
│        ▼                        Groq API (OpenAI SDK)           │
│   ┌──────────────────┐          model: openai/gpt-oss-20b       │
│   │  prompts/        │                                          │
│   │  chatbot.txt     │──► system prompt (persona + rules        │
│   │  WonderWorld.md  │    + {{parkInfo}} knowledge base)        │
│   │  index.ts        │                                          │
│   └──────────────────┘                                          │
└─────────────────────────────────────────────────────────────────┘
```

### Backend Layering (Clean Architecture)

The backend follows a strict three-layer architecture. **Dependencies only point inward/downward** — each layer knows nothing about the layer above it. The prompt layer sits alongside as an injected configuration source.

```
HTTP Request
     │
     ▼
┌──────────────────────────────────────────────────────────┐
│ 1. CONTROLLER  (controllers/chat.controller.ts)          │
│    "The Receptionist"                                    │
│                                                          │
│    • Parses & validates request body with Zod            │
│    • Delegates to the ChatService interface              │
│    • Maps results/errors to HTTP status codes            │
│    • ❌ Contains ZERO business logic or AI calls         │
└──────────────────────────────────────────────────────────┘
     │  sendMessage(prompt, conversationId)
     ▼
┌──────────────────────────────────────────────────────────┐
│ 2. SERVICE  (services/chat.service.ts)                   │
│    "The Core Engine"                                     │
│                                                          │
│    • Orchestrates the chat flow                          │
│    • Loads history from the repository                   │
│    • Prepends the injected system prompt at call time    │
│      (never persisted into history)                      │
│    • Calls the Groq/OpenAI API                           │
│    • Extracts the assistant message (content or          │
│      reasoning fallback for reasoning models)            │
│    • Persists the updated conversation                   │
│    • ❌ Knows nothing about HTTP, req, or res            │
│    • ❌ Does not import the prompts module — the prompt  │
│      is injected, keeping the service fully testable     │
└──────────────────────────────────────────────────────────┘
     │  getHistory() / saveHistory() / createConversation()
     ▼
┌──────────────────────────────────────────────────────────┐
│ 3. REPOSITORY  (repositories/conversation.repository.ts) │
│    "The Storage Abstraction"                             │
│                                                          │
│    • In-memory Map<string, Message[]> implementation     │
│    • Validates conversationId is a real UUID             │
│    • Defensive copies prevent external state mutation    │
│    • Swap to Redis/Postgres by implementing the          │
│      same ConversationRepository interface               │
│    • ❌ Knows nothing about AI or HTTP                   │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ⟡ PROMPT LAYER  (prompts/) — injected configuration      │
│                                                          │
│    • chatbot.txt   → persona + behavioural guardrails    │
│    • WonderWorld.md → domain knowledge base              │
│    • index.ts      → buildSystemPrompt(): loads both as  │
│      raw text and interpolates {{parkInfo}}              │
│    • Wired in routes.ts (composition root), passed to    │
│      the service constructor as an option                │
└──────────────────────────────────────────────────────────┘
```

### Why This Architecture? (Design Decisions)

| Decision                                                                               | Rationale                                                                                                                                                                                                                                                                       |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Interface-first design** (`ChatController`, `ChatService`, `ConversationRepository`) | Every layer depends on an abstraction. Swapping Groq for OpenAI, or the in-memory Map for Redis, requires changing **one file** and zero callers.                                                                                                                               |
| **Constructor-based Dependency Injection**                                             | Services receive their dependencies through the constructor — no hidden globals. This makes every class trivially unit-testable with mocks.                                                                                                                                     |
| **Composition root in `routes.ts`**                                                    | All wiring (repository → service → controller → router) happens in exactly one place. `index.ts` is pure application bootstrap.                                                                                                                                                 |
| **Zod validation at the HTTP boundary**                                                | Invalid requests are rejected with `400` + a structured error format **before** any business logic runs. TypeScript infers types from the schema — validation and types can never drift apart.                                                                                  |
| **UUID validation duplicated in the repository**                                       | Defense in depth. Even if a future caller forgets validation, corrupt keys can never enter the data store.                                                                                                                                                                      |
| **Defensive copy on `saveHistory`**                                                    | The repository owns its state. Callers cannot mutate stored conversation history through a leaked array reference — a classic bug source.                                                                                                                                       |
| **`getHistory()` returns `[]` instead of `undefined`**                                 | Eliminates null-checks in the service layer (null-object pattern), simplifying the happy path.                                                                                                                                                                                  |
| **Prompts externalized into `prompts/` files**                                         | Persona, rules and the knowledge base are plain text/markdown, editable by non-engineers (product, support, marketing) without touching TypeScript. No redeploy of logic needed to change a price.                                                                              |
| **System prompt injected via constructor options**                                     | The service never imports the prompt module, so unit tests can inject a stub prompt. Swapping the whole domain (e.g. a hotel agent instead of a theme park) is a one-line wiring change in `routes.ts`.                                                                         |
| **System prompt prepended per-request, never stored**                                  | Persisting it would duplicate ~5KB in every conversation turn, inflating token cost and making stored history dependent on a prompt version. Injecting at call time keeps history clean and the prompt instantly upgradable.                                                    |
| **Raw-text imports (`with { type: 'text' }`) instead of `fs.readFileSync`**            | Avoids the `__dirname`-in-ESM crash, removes runtime file I/O and path resolution, and makes missing prompt files a **compile/bundle-time** error rather than a runtime surprise.                                                                                               |
| **`buildSystemPrompt()` throws if `{{parkInfo}}` is missing**                          | Fail-fast contract check — a typo in the template breaks the build loudly instead of silently shipping a bot with no knowledge base.                                                                                                                                            |
| **Language policy lives in the prompt, not in code**                                   | Arabic support was added by editing one text file — no service, controller or client change, and no redeploy of logic. This is the payoff for externalizing prompts.                                                                                                            |
| **Prompt rules state only the _correct_ form, never a bad example**                    | Measured behaviour: an early rule said _"write X rather than Y"_. The 20B model **copied the wrong form Y** verbatim into its refusal message. Replacing it with the single correct phrasing fixed it instantly — small models pattern-match, they don't reason about negation. |
| **`max_tokens` raised to 4000 for Arabic**                                             | Arabic is less token-dense than English. At 2000 tokens, long Arabic price tables were cut off mid-row (`Annual Pass \| 899` and nothing after), rendering as a broken table in the UI.                                                                                         |

---

## 📁 Project Structure

```
ai-chat-bot/
├── index.ts                          # Monorepo dev orchestrator (concurrently)
├── package.json                      # Workspace root — scripts, husky, prettier
├── tsconfig.json                     # Root TypeScript config (strict)
├── .lintstagedrc                     # Pre-commit formatting pipeline
├── .husky/                           # Git hooks
│
└── packages/
    ├── server/                       # ─── Express API ───
    │   ├── index.ts                  # App bootstrap: middleware, router mounting
    │   ├── routes.ts                 # Composition root: DI wiring + route table
    │   ├── controllers/
    │   │   └── chat.controller.ts    # HTTP layer: Zod validation, status codes
    │   ├── services/
    │   │   └── chat.service.ts       # Business logic: Groq API orchestration
    │   ├── repositories/
    │   │   └── conversation.repository.ts  # Data access: in-memory store + UUID guard
    │   ├── prompts/                  # ─── Prompt / knowledge layer ───
    │   │   ├── index.ts              # buildSystemPrompt(): template + knowledge merge
    │   │   ├── chatbot.txt           # Agent persona & behavioural guardrails
    │   │   ├── WonderWorld.md        # Domain knowledge base (prices, rides, hours…)
    │   │   └── assets.d.ts           # Ambient types for *.txt / *.md raw-text imports
    │   ├── .env.example              # Required environment variables template
    │   └── package.json
    │
    └── client/                       # ─── React SPA ───
        ├── src/
        │   ├── App.tsx               # Root layout
        │   ├── main.tsx              # React entry point
        │   ├── index.css             # Design tokens (OKLCH), dark mode, markdown styles
        │   ├── components/
        │   │   ├── ChatBot.tsx       # The full chat experience (~320 lines)
        │   │   └── ui/               # shadcn/ui primitives (Button, Textarea)
        │   └── lib/
        │       └── utils.ts          # cn() classname helper
        ├── vite.config.ts            # Dev server + /api proxy to :3000
        └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

| Tool                   | Version | Notes                                                          |
| ---------------------- | ------- | -------------------------------------------------------------- |
| [Bun](https://bun.com) | ≥ 1.4   | Runtime + package manager                                      |
| A Groq API key         | —       | Free at [console.groq.com/keys](https://console.groq.com/keys) |

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ahmedibrahimhassan654/ai-chat-bot.git
cd ai-chat-bot

# 2. Install all workspace dependencies (client + server)
bun install

# 3. Configure environment variables
cd packages/server
cp .env.example .env        # then paste your Groq API key into .env
cd ../..

# 4. Start both apps with one command
bun run dev
```

The server starts on **http://localhost:3000** and the client on **http://localhost:5173**.
Vite's dev proxy forwards all `/api/*` requests to the server, so there are **no CORS issues** in development.

### Environment Variables (`packages/server/.env`)

| Variable       | Required | Description                   |
| -------------- | -------- | ----------------------------- |
| `GROQ_API_KEY` | ✅       | Your Groq API key             |
| `PORT`         | ❌       | Server port (default: `3000`) |

---

## 🔌 API Reference

### `POST /api/chat`

Sends a message and receives an AI response. Conversation history is maintained server-side, keyed by `conversationId`.

**Request Body**

```json
{
   "prompt": "Explain the repository pattern in one sentence.",
   "conversationId": "3f2b8c1e-9d4a-4e6f-8b2c-1a5d7e9f0c3b"
}
```

| Field            | Type     | Rules                          |
| ---------------- | -------- | ------------------------------ |
| `prompt`         | `string` | 1–2000 characters, required    |
| `conversationId` | `string` | Must be a valid UUID, required |

**Success — `200 OK`**

```json
{
   "message": "The repository pattern abstracts data persistence behind an interface, so business logic never depends on the storage mechanism."
}
```

**Validation Error — `400 Bad Request`** (structured Zod error format)

```json
{
   "prompt": { "_errors": ["Prompt cannot be empty"] },
   "conversationId": { "_errors": ["Invalid uuid"] }
}
```

**Server Error — `500 Internal Server Error`**

```json
{ "error": "Something went wrong" }
```

### Other Endpoints

| Method | Path           | Description                                                                  |
| ------ | -------------- | ---------------------------------------------------------------------------- |
| `GET`  | `/`            | Health check → `{ status, service, configured }` (never exposes the API key) |
| `GET`  | `/api/message` | Simple connectivity check → `{ "message": "Hello from the server" }`         |

### cURL Example

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Hello! Who are you?",
    "conversationId": "3f2b8c1e-9d4a-4e6f-8b2c-1a5d7e9f0c3b"
  }'
```

---

## 🔄 Request Lifecycle (End-to-End Walkthrough)

Follow one message through the entire system:

1. **User types** a message in `ChatBot.tsx` and presses `Enter`.
2. **Client** optimistically appends the user bubble to local state, shows the typing indicator, and `POST`s `{ prompt, conversationId }` to `/api/chat` (the UUID is generated once per session with `crypto.randomUUID()`).
3. **Vite proxy** forwards the request to the Express server on port 3000.
4. **`routes.ts`** matches `POST /chat` on the `/api` router and invokes `ChatController.handleChat`.
5. **Controller** validates the body against the Zod schema. Invalid → immediate `400` with field-level errors. Valid → calls `chatService.sendMessage(prompt, conversationId)`.
6. **Service** asks the **repository** to `createConversation` (idempotent) and `getHistory`, then appends the user message.
7. **Service** prepends the **injected WonderWorld system prompt** (persona + guardrails + `{{parkInfo}}` knowledge base) to the message array — _for this request only_, it is **not** written to history — and calls the Groq API with `temperature: 0.2`, `max_tokens: 2000`.
8. **Service** extracts the assistant text (`message.content`, falling back to `message.reasoning` for reasoning models), appends it to the _prompt-free_ history, and persists via `saveHistory`.
9. **Repository** stores a **defensive copy** of the messages in its in-memory `Map`.
10.   **Controller** responds `200` with `{ message }`; the client hides the indicator, renders the reply as **Markdown** (bold, lists, tables), appends the bubble with an entry animation, and auto-scrolls.

Errors at any stage are caught by the controller's `try/catch` and translated into a clean `500` response with an error banner in the UI — the app never crashes or leaks stack traces to the client.

---

## 🧠 Key Implementation Highlights

### Externalized Prompt Assembly (the `prompts/` layer)

```ts
// prompts/index.ts
import chatbotTemplate from './chatbot.txt' with { type: 'text' };
import parkInfo from './WonderWorld.md' with { type: 'text' };

export const PARK_INFO_PLACEHOLDER = '{{parkInfo}}';

export function buildSystemPrompt(): string {
   if (!chatbotTemplate.includes(PARK_INFO_PLACEHOLDER)) {
      throw new Error(
         `Prompt template is missing the "${PARK_INFO_PLACEHOLDER}" placeholder`
      );
   }
   return chatbotTemplate.replaceAll(PARK_INFO_PLACEHOLDER, parkInfo.trim());
}
```

Two details worth calling out:

- **`with { type: 'text' }`** forces Bun's _raw text_ loader. Without it, Bun silently compiles `.md` imports into **HTML**, which would mangle the markdown tables the model is asked to quote. This was found by testing, not by assuming.
- **The fail-fast placeholder check** means a typo in the template breaks startup loudly instead of shipping a bot with an empty knowledge base.

The assembled prompt is injected at the composition root — the service stays completely unaware of where prompts come from:

```ts
// routes.ts (composition root)
const chatService = new GroqChatService(
   process.env.GROQ_API_KEY!,
   conversationRepository,
   {
      systemPrompt: buildSystemPrompt(),
   }
);
```

### Injected System Prompt, Clean Stored History

```ts
// services/chat.service.ts
const messages: Message[] = [...history, { role: 'user', content: prompt }];

const requestMessages: Message[] = this.systemPrompt
   ? [{ role: 'system', content: this.systemPrompt }, ...messages]
   : messages;

// API call uses requestMessages…
// …but only `messages` (system-prompt-free) is persisted:
this.repository.saveHistory(conversationId, [
   ...messages,
   { role: 'assistant', content: assistantMessage },
]);
```

Storing the system prompt would duplicate ~5KB **on every turn** — inflating token cost and permanently baking one prompt version into saved conversations. Separating "what we send" from "what we store" avoids both.

### Type-Safe Validation (Zod + TypeScript inference)

```ts
const chatRequestSchema = z.object({
   prompt: z.string().min(1).max(2000),
   conversationId: z.string().uuid(),
});
```

One schema provides **runtime validation and compile-time types** — `result.data` is fully typed, so invalid shapes are impossible to pass downstream.

### Swappable Storage via Interface

```ts
export interface ConversationRepository {
   getHistory(conversationId: string): Message[];
   saveHistory(conversationId: string, messages: Message[]): void;
   createConversation(conversationId: string): void;
   deleteConversation(conversationId: string): boolean;
   getAllConversationIds(): string[];
}
```

Today it's an in-memory `Map`. Tomorrow it can be Redis or Postgres — **no other file changes**, because the service only knows the interface.

### Resilient AI Response Parsing

Groq's `gpt-oss-20b` is a reasoning model that may return content in `message.content` **or** `message.reasoning`. The service handles both and throws a domain error if the model returns nothing — which the controller maps to a proper HTTP 500.

### UI Polish Details

- **Styled Markdown pipeline** — a dedicated `.chat-markdown` component layer styles headings, lists, blockquotes, inline code and **striped, scrollable GFM tables** so price/hour tables render cleanly inside chat bubbles
- **Dotted background pattern** generated with a CSS `radial-gradient` (no image assets)
- **Bouncing typing indicator** using staggered `animation-delay` utilities
- **Message animations** via `tw-animate-css` (`fade-in slide-in-from-bottom`)
- **OKLCH design tokens** — perceptually uniform colors that adapt to light/dark themes automatically
- **Accessible states** — disabled inputs during loading, focus rings, semantic buttons
- **User vs. assistant styling** — user text stays literal (`whitespace-pre-wrap`), only assistant output is parsed as Markdown, avoiding accidental formatting of what a guest typed

---

## 🛠️ Tech Stack

### Frontend

| Technology                      | Purpose                                                         |
| ------------------------------- | --------------------------------------------------------------- |
| **React 19**                    | UI library (latest concurrent features)                         |
| **TypeScript 6 (strict)**       | End-to-end type safety                                          |
| **Vite 8**                      | Dev server, HMR, `/api` proxy, production builds                |
| **Tailwind CSS v4**             | Utility-first styling with the new CSS-first `@theme` config    |
| **shadcn/ui + Base UI**         | Accessible, composable component primitives                     |
| **lucide-react**                | Icon system                                                     |
| **react-markdown + remark-gfm** | Renders assistant replies (bold, lists, GFM price/hours tables) |
| **tw-animate-css**              | Declarative entry animations                                    |

### Backend

| Technology                | Purpose                                                       |
| ------------------------- | ------------------------------------------------------------- |
| **Bun**                   | Runtime — fast startup, native TS execution, raw-text imports |
| **Express 5**             | HTTP framework (async error handling built in)                |
| **Zod 4**                 | Schema validation & type inference                            |
| **OpenAI SDK → Groq API** | LLM inference (`openai/gpt-oss-20b`, ~fast token throughput)  |
| **dotenv**                | Environment configuration                                     |
| **`prompts/` layer**      | Externalized persona, guardrails & domain knowledge base      |

### Tooling & Quality

| Tool                    | Purpose                                                       |
| ----------------------- | ------------------------------------------------------------- |
| **Bun workspaces**      | Monorepo management                                           |
| **Husky + lint-staged** | Pre-commit hooks — code is auto-formatted before every commit |
| **Prettier**            | Consistent code style across the repo                         |
| **ESLint**              | Static analysis (React Hooks rules, TS rules)                 |
| **concurrently**        | Single-command full-stack dev (`bun run dev` at root)         |

---

## 📜 Available Scripts

**Root (monorepo):**

```bash
bun run dev        # Start server (:3000) + client (:5173) together
bun run format     # Prettier-format the entire repo
```

**Server (`packages/server`):**

```bash
bun run dev        # Start with --watch (auto-reload)
bun run start      # Production start
```

**Client (`packages/client`):**

```bash
bun run dev        # Vite dev server
bun run build      # Type-check + production build
bun run lint       # ESLint
bun run preview    # Preview the production build
```

---

## 🗺️ Roadmap / Next Steps

Ideas I plan to explore next (contributions welcome!):

- [x] **Markdown rendering** for assistant messages (tables, lists, bold) — done
- [x] **Externalized prompt/knowledge layer** with domain guardrails — done
- [ ] **Streaming responses** (SSE) for token-by-token output
- [ ] **RAG upgrade** — replace the whole-knowledge-base prompt with embeddings + vector search over `WonderWorld.md`, so the park guide can scale to thousands of pages
- [ ] **Persistent storage** — implement a Redis `ConversationRepository` (the interface is already designed for it)
- [ ] **Unit & integration tests** (Vitest + Supertest) — the DI architecture makes services and prompts trivially mockable
- [ ] **Prompt regression tests** — assert guardrail behaviour ("refuses off-topic", "quotes exact prices") on every prompt edit
- [ ] **Rate limiting & API key auth** on the chat endpoint
- [ ] **Docker Compose** for one-command deployment

---

## 📄 License

MIT — free to use, modify, and learn from.

---

<p align="center">
  Built with ❤️ and ☕ by <strong>Ahmed Ibrahim</strong><br/>
  <em>If this project impressed you, let's talk — my inbox is open.</em>
</p>
