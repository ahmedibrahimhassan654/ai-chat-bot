# 🤖 AI Chat Bot — Full-Stack Conversational AI Application

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white" />
  <img alt="Express" src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white" />
  <img alt="Bun" src="https://img.shields.io/badge/Bun-1.4-000000?logo=bun&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss&logoColor=white" />
  <img alt="shadcn/ui" src="https://img.shields.io/badge/shadcn%2Fui-latest-000000?logo=shadcnui&logoColor=white" />
  <img alt="Groq" src="https://img.shields.io/badge/Groq-gpt--oss--20b-F55036?logo=groq&logoColor=white" />
  <img alt="TanStack Query" src="https://img.shields.io/badge/TanStack_Query-v5-FF4154?logo=reactquery&logoColor=white" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white" />
  <img alt="React Router" src="https://img.shields.io/badge/React_Router-v7-CA4245?logo=reactrouter&logoColor=white" />
  <img alt="Architecture" src="https://img.shields.io/badge/Architecture-Clean_%7C_3--Layer-success" />
</p>

<p align="center">
  <strong>Multi-turn AI chat with server-side memory · AI review summarizer with caching · Clean Architecture backend · TanStack Query · Prisma + MySQL</strong>
</p>

A production-minded, full-stack AI application built with **React 19**, **Express 5**, **TypeScript (strict mode)**, **TanStack Query v5**, **Prisma 7**, and the **Groq inference API** (running `openai/gpt-oss-20b`). The app features a **bilingual (English / Arabic), domain-scoped customer support chatbot for "WonderWorld", a fictional theme park**, and an **AI review summarizer** that condenses customer reviews into actionable insights with server-side caching.

> This project demonstrates more than "calling an AI API". It demonstrates **software engineering discipline**: separation of concerns, testable design, input validation at every boundary, type safety end-to-end, prompt/knowledge externalization, LLM guardrails, database persistence with Prisma, and professional developer tooling (monorepo, git hooks, formatting pipelines).

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

### Home Page

- 🎓 **Course showcase** — explains the Udemy course, skills gained, and projects built
- 📜 **Skills grid** — LLM fundamentals, prompt engineering, chatbot development, review summarizer, backend APIs, modern tooling
- 🗂️ **Project cards** — quick links to the chatbot and review summarizer
- 🏆 **Certificate section** — placeholder for the course completion certificate

### Chat Experience

- 💬 **Multi-turn conversations with memory** — the server maintains per-conversation message history, so follow-ups like _"and for seniors?"_ work without repeating context
- 📝 **Markdown rendering** — assistant replies render bold text, bullet lists and GFM **tables** (prices/hours) via `react-markdown` + `remark-gfm`
- ⌨️ **Smart input** — `Enter` to send, `Shift+Enter` for a new line, auto-growing textarea
- ⏳ **Real-time feedback** — animated typing indicator while the model is thinking
- ✨ **Empty state with domain-specific suggestion chips** — one click to ask about tickets, kids' rides, fireworks or hotels
- 🔄 **"New chat" button** — generates a fresh conversation UUID and resets history
- 🕐 **Message timestamps**, smooth entry animations, and auto-scroll to the latest message
- 🔊 **Sound effects** — send/receive audio with mute/unmute toggle
- 🌗 **Full dark/light mode support** via CSS custom properties (OKLCH color space)

### Review Summarizer

- 📦 **Product cards** — browse all products with a styled selector
- ⭐ **Star ratings** — visual 5-star rating display for each review
- 🤖 **AI summary generation** — one-click button to generate a concise summary
- 💾 **Server-side caching** — generated summaries are persisted in the database with a 7-day expiry
- 🔄 **Force regeneration** — `?force=true` query param bypasses the cache
- ⏳ **Loading skeletons** — animated placeholders while reviews and summaries load
- 🛡️ **Error handling** — graceful error states for missing products, empty reviews, and LLM failures
- 🏷️ **Externalized prompt** — summarization prompt lives in `prompts/summarize-reviews.txt` with `{{reviews}}` placeholder

### AI / Prompt Engineering

- 🧠 **Externalized prompt layer** — persona, rules and knowledge base live in `prompts/`, not in code
- 🔧 **Template interpolation** — `{{parkInfo}}` and `{{reviews}}` placeholders, with a build-time guard that throws if the placeholder is missing
- 🚫 **Domain guardrails** — the agent refuses off-topic requests and is instructed never to invent facts
- 🎭 **Reasoning-model aware** — falls back to `message.reasoning` when a model returns no `content`
- 🌍 **Bilingual English + Arabic** — accepts Arabic dialects, replies in correct Modern Standard Arabic, with explicit anti-Arabizi and anti-transliteration rules
- ✂️ **Conciseness guard** — returns only the rows that answer the question, and `max_tokens` is raised to 4000 because Arabic tokenizes less densely than English (prevents mid-table truncation)
- 🧵 **System prompt is injected per-request, never persisted** — stored history stays clean, so the prompt can be changed without migrating or corrupting existing conversations

### Engineering

- 🏛️ **Clean Architecture backend** — Controllers, Services, and Repositories with strict Single Responsibility Principle
- 💉 **Dependency Injection** — every layer depends on abstractions (interfaces), not concrete implementations
- ✅ **Zod schema validation** — request bodies are validated and typed at the HTTP boundary
- 🔒 **Defense in depth** — the repository layer independently validates UUID format
- 🛡️ **No secret leakage** — the API key is never exposed by any endpoint; `.env` is git-ignored
- 📦 **Bun monorepo workspaces** — client and server share one lockfile and run with a single command
- 🗄️ **Prisma 7 + MySQL** — database schema, migrations, and type-safe queries for products, reviews, and summaries
- 🔀 **React Router v7** — client-side routing with a shared layout and navigation
- ⚡ **TanStack Query v5** — declarative data fetching, caching, mutations, and loading/error states
- 🔌 **Extracted API layer** — centralized `api/` modules (`client.ts`, `chat.ts`, `products.ts`, `reviews.ts`, `summary.ts`) keep fetch logic out of components
- 🧰 **Professional tooling** — Husky pre-commit hooks, lint-staged, Prettier, ESLint (zero warnings), strict TypeScript

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          Browser (Client)                       │
│                                                                 │
│   React 19 + Vite + Tailwind CSS v4 + shadcn/ui                 │
│   React Router v7 + TanStack Query v5                          │
│                                                                 │
│   ┌──────────┐  ┌──────────┐  ┌──────────────┐                 │
│   │ HomePage │  │ ChatPage │  │ SummaryPage  │                 │
│   └──────────┘  └──────────┘  └──────────────┘                 │
│        │              │               │                        │
│        └──────────────┼───────────────┘                        │
│                       ▼                                        │
│              api/ (fetch layer)                                │
│                       │                                        │
│                       ▼  Vite Dev Proxy (/api → :3000)         │
└─────────────────────────────────────────────────────────────────┘
                       │
┌─────────────────────────────────────────────────────────────────┐
│                       Express 5 (Server)                        │
│                                                                 │
│   routes.ts                                                     │
│     ├── GET  /api/products                                      │
│     ├── GET  /api/products/:id/reviews                          │
│     ├── GET  /api/products/:id/summary                          │
│     ├── POST /api/products/:id/reviews/summarize                │
│     └── POST /api/chat                                          │
│                                                                 │
│   Controllers ──► Services ──► Repositories ──► Prisma ──► MySQL│
│                                                                 │
│   ┌──────────────────┐                                          │
│   │  prompts/        │                                          │
│   │  chatbot.txt     │──► system prompt                         │
│   │  WonderWorld.md  │──► {{parkInfo}} knowledge base          │
│   │  summarize-reviews.txt │──► {{reviews}} summarization     │
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
│ 1. CONTROLLER  (controllers/*.ts)                        │
│    • Parses & validates request body with Zod            │
│    • Delegates to the Service layer                      │
│    • Maps results/errors to HTTP status codes            │
│    • ❌ Contains ZERO business logic or AI calls         │
└──────────────────────────────────────────────────────────┘
     │  e.g. summarizeReviews(productId)
     ▼
┌──────────────────────────────────────────────────────────┐
│ 2. SERVICE  (services/*.ts)                              │
│    • Orchestrates the business flow                      │
│    • Checks product existence → NotFoundError            │
│    • Checks cached summary → returns early               │
│    • Fetches reviews, builds prompt from template        │
│    • Calls the Groq/OpenAI API                           │
│    • Persists summary via repository                     │
│    • Handles LLM errors with fallback message             │
│    • ❌ Knows nothing about HTTP, req, or res            │
└──────────────────────────────────────────────────────────┘
     │  getReviews() / saveSummary() / getProduct()
     ▼
┌──────────────────────────────────────────────────────────┐
│ 3. REPOSITORY  (repositories/*.ts)                       │
│    • Prisma 7 + MySQL (MariaDB adapter)                  │
│    • Type-safe queries via generated Prisma Client        │
│    • Upsert for summaries (7-day expiry)                 │
│    • Swap to another DB by changing the Prisma schema    │
│    • ❌ Knows nothing about AI or HTTP                   │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ⟡ PROMPT LAYER  (prompts/) — injected configuration      │
│                                                          │
│    • chatbot.txt           → persona + guardrails        │
│    • WonderWorld.md        → domain knowledge base       │
│    • summarize-reviews.txt → {{reviews}} template        │
│    • index.ts              → buildSystemPrompt()         │
│    • Wired in routes.ts (composition root)               │
└──────────────────────────────────────────────────────────┘
```

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
    │   │   ├── chat.controller.ts    # HTTP layer: Zod validation, status codes
    │   │   ├── review.controller.ts  # Review summarization endpoint
    │   │   └── summary.controller.ts # Summary retrieval endpoint
    │   ├── services/
    │   │   ├── chat.service.ts       # Business logic: Groq API orchestration
    │   │   ├── review.service.ts    # Review summarization flow + caching
    │   │   ├── summary.service.ts    # Summary retrieval flow
    │   │   └── llm.service.ts        # LLM API call abstraction
    │   ├── repositories/
    │   │   ├── conversation.repository.ts  # Data access: in-memory store + UUID guard
    │   │   ├── product.repository.ts        # Prisma: product queries
    │   │   ├── review.repository.ts         # Prisma: review queries
    │   │   └── summary.repository.ts        # Prisma: summary upsert/find
    │   ├── errors/
    │   │   └── NotFoundError.ts      # Custom 404 error class
    │   ├── prompts/                  # ─── Prompt / knowledge layer ───
    │   │   ├── index.ts              # buildSystemPrompt(): template + knowledge merge
    │   │   ├── chatbot.txt           # Agent persona & behavioural guardrails
    │   │   ├── WonderWorld.md        # Domain knowledge base (prices, rides, hours…)
    │   │   ├── summarize-reviews.txt # Review summarization prompt template
    │   │   └── assets.d.ts           # Ambient types for *.txt / *.md raw-text imports
    │   ├── prisma/
    │   │   ├── schema.prisma         # Database schema (Product, Review, Summary)
    │   │   └── seed.sql              # Sample data
    │   ├── .env.example              # Required environment variables template
    │   └── package.json
    │
    └── client/                       # ─── React SPA ───
        ├── src/
        │   ├── App.tsx               # Root router setup
        │   ├── main.tsx              # React entry point + QueryClientProvider
        │   ├── index.css             # Design tokens (OKLCH), dark mode, markdown styles
        │   ├── api/                  # ─── Extracted API layer ───
        │   │   ├── client.ts         # Base fetch wrapper with error handling
        │   │   ├── chat.ts           # POST /api/chat
        │   │   ├── products.ts       # GET /api/products
        │   │   ├── reviews.ts        # GET /api/products/:id/reviews
        │   │   └── summary.ts        # GET/POST summary endpoints
        │   ├── hooks/                # ─── TanStack Query hooks ───
        │   │   ├── useProducts.ts    # Query: fetch all products
        │   │   ├── useReviews.ts     # Query: fetch reviews for a product
        │   │   ├── useSummary.ts     # Query: fetch cached summary
        │   │   └── useGenerateSummary.ts  # Mutation: generate + cache summary
        │   ├── pages/                # ─── Route pages ───
        │   │   ├── HomePage.tsx      # Course overview, skills, projects, certificate
        │   │   ├── ChatPage.tsx      # Full chat experience (refactored ChatBot)
        │   │   └── SummaryPage.tsx   # Product cards, reviews, star ratings, AI summary
        │   ├── components/
        │   │   ├── Layout.tsx        # Shared layout with nav + Outlet
        │   │   └── ui/               # shadcn/ui primitives (Button, Textarea)
        │   ├── hooks/
        │   │   ├── useAudio.ts       # Audio playback utility
        │   │   └── useSoundEffects.ts # Sound effects with mute toggle
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
| MySQL or MariaDB       | —       | Database for Prisma                                            |

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

# 4. Run Prisma migrations (create database tables)
cd packages/server
bunx prisma migrate deploy
bunx prisma db seed         # optional: load sample data
cd ../..

# 5. Start both apps with one command
bun run dev
```

The server starts on **http://localhost:3000** and the client on **http://localhost:5173**.
Vite's dev proxy forwards all `/api/*` requests to the server, so there are **no CORS issues** in development.

### Environment Variables (`packages/server/.env`)

| Variable       | Required | Description                   |
| -------------- | -------- | ----------------------------- |
| `GROQ_API_KEY` | ✅       | Your Groq API key             |
| `DATABASE_URL` | ✅       | MySQL/MariaDB connection URL  |
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

**Validation Error — `400 Bad Request`**

```json
{
   "prompt": { "_errors": ["Prompt cannot be empty"] },
   "conversationId": { "_errors": ["Invalid uuid"] }
}
```

### `GET /api/products`

Returns all products.

**Success — `200 OK`**

```json
[
   {
      "id": 1,
      "name": "General Admission",
      "description": "...",
      "price": "129.00"
   }
]
```

### `GET /api/products/:id/reviews`

Returns all reviews for a product.

**Success — `200 OK`**

```json
[
   {
      "id": 1,
      "author": "Alice",
      "rating": 5,
      "content": "Amazing!",
      "createdAt": "...",
      "productId": 1
   }
]
```

### `GET /api/products/:id/summary`

Returns the cached AI summary for a product.

**Success — `200 OK`**

```json
{
   "summary": "Guests love the park for its thrilling rides and family-friendly atmosphere..."
}
```

**Not Found — `404 Not Found`**

```json
{ "error": "Product not found" }
// or
{ "error": "Summary not found" }
```

### `POST /api/products/:id/reviews/summarize`

Generates (or returns cached) AI summary for a product's reviews.

**Query Params**

| Param   | Type   | Description                        |
| ------- | ------ | ---------------------------------- |
| `force` | `bool` | Pass `?force=true` to bypass cache |

**Success — `200 OK`**

```json
{
   "summary": "Guests consistently praise the clean facilities and friendly staff..."
}
```

**Error Responses**

| Status | Body                                        | Reason                 |
| ------ | ------------------------------------------- | ---------------------- |
| `400`  | `{ "error": "Invalid product ID" }`         | Non-numeric product ID |
| `404`  | `{ "error": "Product not found" }`          | Product doesn't exist  |
| `500`  | `{ "error": "Failed to generate summary" }` | LLM or server error    |

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

### Chat Flow

1. **User types** a message in `ChatPage.tsx` and presses `Enter`.
2. **Client** optimistically appends the user bubble to local state, shows the typing indicator, and calls `sendChat()` from `api/chat.ts`.
3. **Vite proxy** forwards the request to the Express server on port 3000.
4. **`routes.ts`** matches `POST /chat` on the `/api` router and invokes `ChatController.handleChat`.
5. **Controller** validates the body against the Zod schema. Invalid → immediate `400` with field-level errors. Valid → calls `chatService.sendMessage(prompt, conversationId)`.
6. **Service** asks the **repository** to `createConversation` (idempotent) and `getHistory`, then appends the user message.
7. **Service** prepends the **injected WonderWorld system prompt** to the message array — _for this request only_, it is **not written to history** — and calls the Groq API with `temperature: 0.2`, `max_tokens: 2000`.
8. **Service** extracts the assistant text, appends it to the _prompt-free_ history, and persists via `saveHistory`.
9. **Repository** stores a **defensive copy** of the messages in its in-memory `Map`.
10.   **Controller** responds `200` with `{ message }`; the client renders the reply as **Markdown**, appends the bubble with an entry animation, and auto-scrolls.

### Summary Generation Flow

1. **User clicks** "Generate Summary" on the `SummaryPage`.
2. **Client** calls `useGenerateSummary(productId).mutate(false)` — a TanStack Query mutation.
3. **Mutation** calls `generateSummary(productId, force)` from `api/summary.ts`.
4. **Server** (`ReviewService.summarizeReviews`):
   - Checks product existence → throws `NotFoundError` if missing.
   - Checks cached summary → returns early if found (unless `force=true`).
   - Fetches latest 10 reviews from the database.
   - Loads the prompt template from `prompts/summarize-reviews.txt` and replaces `{{reviews}}` with joined review content.
   - Calls the LLM via `generateSummary()`.
   - Persists the result via `summaryRepository.storeReviewSummary()` (upsert with 7-day expiry).
   - Returns the summary string.
5. **TanStack Query** updates the `['summary', productId]` query cache with the new data.
6. **UI** re-renders with the generated summary displayed in a styled card.

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

### Review Summarization with Caching

```ts
// services/review.service.ts
export class ReviewService {
   async summarizeReviews(productId: number, force = false): Promise<string> {
      const product = await productRepository.getProduct(productId);
      if (!product) throw new NotFoundError('Product not found');

      if (!force) {
         const cached =
            await summaryRepository.getSummaryByProductId(productId);
         if (cached) return cached.content;
      }

      const reviews = await reviewRepository.getReviews(productId, 10);
      if (reviews.length === 0) return 'No reviews available to summarize.';

      const prompt = summarizeReviewsTemplate.replaceAll(
         '{{reviews}}',
         joinedReviews
      );

      try {
         const summary = await generateSummary(prompt);
         await summaryRepository.storeReviewSummary(productId, summary);
         return summary;
      } catch (error) {
         console.error('LLM generation failed:', error);
         return 'Unable to generate summary at this time. Please try again later.';
      }
   }
}
```

### TanStack Query Hooks

```ts
// hooks/useGenerateSummary.ts
export function useGenerateSummary(productId: number) {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: (force: boolean) => generateSummary(productId, force),
      onSuccess: (data) => {
         queryClient.setQueryData(['summary', productId], data);
      },
   });
}
```

### Extracted API Layer

```ts
// api/summary.ts
export function getSummary(productId: number) {
   return apiFetch<SummaryResponse>(`/products/${productId}/summary`);
}

export function generateSummary(productId: number, force = false) {
   return apiFetch<SummaryResponse>(
      `/products/${productId}/reviews/summarize${force ? '?force=true' : ''}`,
      { method: 'POST' }
   );
}
```

### UI Polish Details

- **Styled Markdown pipeline** — a dedicated `.chat-markdown` component layer styles headings, lists, blockquotes, inline code and **striped, scrollable GFM tables**
- **Dotted background pattern** generated with a CSS `radial-gradient` (no image assets)
- **Bouncing typing indicator** using staggered `animation-delay` utilities
- **Message animations** via `tw-animate-css` (`fade-in slide-in-from-bottom`)
- **OKLCH design tokens** — perceptually uniform colors that adapt to light/dark themes automatically
- **Accessible states** — disabled inputs during loading, focus rings, semantic buttons
- **User vs. assistant styling** — user text stays literal, only assistant output is parsed as Markdown
- **Loading skeletons** — animated pulse placeholders for reviews and summaries
- **Star ratings** — visual 5-star display using lucide-react Star/StarOff icons
- **Product selector** — pill-style product cards with active state highlighting

---

## 🛠️ Tech Stack

### Frontend

| Technology                      | Purpose                                                      |
| ------------------------------- | ------------------------------------------------------------ |
| **React 19**                    | UI library (latest concurrent features)                      |
| **TypeScript 6 (strict)**       | End-to-end type safety                                       |
| **Vite 8**                      | Dev server, HMR, `/api` proxy, production builds             |
| **Tailwind CSS v4**             | Utility-first styling with the new CSS-first `@theme` config |
| **shadcn/ui + Base UI**         | Accessible, composable component primitives                  |
| **React Router v7**             | Client-side routing with nested layouts                      |
| **TanStack Query v5**           | Declarative data fetching, caching, mutations                |
| **lucide-react**                | Icon system                                                  |
| **react-markdown + remark-gfm** | Renders assistant replies (bold, lists, GFM tables)          |
| **tw-animate-css**              | Declarative entry animations                                 |

### Backend

| Technology                | Purpose                                                       |
| ------------------------- | ------------------------------------------------------------- |
| **Bun**                   | Runtime — fast startup, native TS execution, raw-text imports |
| **Express 5**             | HTTP framework (async error handling built in)                |
| **Zod 4**                 | Schema validation & type inference                            |
| **Prisma 7**              | ORM — type-safe database queries, migrations                  |
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
bunx prisma generate   # Regenerate Prisma Client
bunx prisma migrate dev  # Create a new migration
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
- [x] **Review summarizer** with AI generation and caching — done
- [x] **TanStack Query** for data fetching and mutations — done
- [x] **Prisma + MySQL** persistence for products, reviews, summaries — done
- [x] **React Router** multi-page navigation — done
- [x] **Product cards** with reviews and star ratings — done
- [x] **Loading skeletons** and error states — done
- [ ] **Streaming responses** (SSE) for token-by-token output
- [ ] **RAG upgrade** — replace the whole-knowledge-base prompt with embeddings + vector search
- [ ] **Unit & integration tests** (Vitest + Supertest)
- [ ] **Prompt regression tests** — assert guardrail behaviour on every prompt edit
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
