# 🤖 AI Chat Bot — Full-Stack Conversational AI Application

A production-minded, full-stack AI chat application built with **React 19**, **Express 5**, **TypeScript (strict mode)**, and the **Groq inference API** (running `openai/gpt-oss-20b`). The backend is architected with **Clean Architecture principles** — a strict three-layer separation (Controller → Service → Repository) with dependency injection — and the frontend is a polished, accessible chat UI built with **Tailwind CSS v4** and **shadcn/ui**.

> This project demonstrates more than "calling an AI API". It demonstrates **software engineering discipline**: separation of concerns, testable design, input validation at every boundary, type safety end-to-end, and professional developer tooling (monorepo, git hooks, formatting pipelines).

---

## 📸 Features

### Chat Experience

- 💬 **Multi-turn conversations with memory** — the server maintains per-conversation message history, so the AI remembers context across messages
- ⌨️ **Smart input** — `Enter` to send, `Shift+Enter` for a new line, auto-growing textarea
- ⏳ **Real-time feedback** — animated typing indicator while the model is thinking
- ✨ **Empty state with suggestion chips** — one click to start a conversation
- 🔄 **"New chat" button** — generates a fresh conversation UUID and resets history
- 🕐 **Message timestamps**, smooth entry animations, and auto-scroll to the latest message
- 🌗 **Full dark/light mode support** via CSS custom properties (OKLCH color space)

### Engineering

- 🏛️ **Clean Architecture backend** — Controllers, Services, and Repositories with strict Single Responsibility Principle
- 💉 **Dependency Injection** — every layer depends on abstractions (interfaces), not concrete implementations
- ✅ **Zod schema validation** — request bodies are validated and typed at the HTTP boundary
- 🔒 **Defense in depth** — the repository layer independently validates UUID format, so bad data can never reach storage
- 📦 **Bun monorepo workspaces** — client and server share one lockfile and run with a single command
- 🧰 **Professional tooling** — Husky pre-commit hooks, lint-staged, Prettier, ESLint, strict TypeScript

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
│                                              │                  │
│                                              ▼                  │
│                                   Groq API (OpenAI SDK)         │
│                                   model: openai/gpt-oss-20b     │
└─────────────────────────────────────────────────────────────────┘
```

### Backend Layering (Clean Architecture)

The backend follows a strict three-layer architecture. **Dependencies only point inward/downward** — each layer knows nothing about the layer above it.

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
│    • Calls the Groq/OpenAI API                           │
│    • Extracts the assistant message (content or          │
│      reasoning fallback for reasoning models)            │
│    • Persists the updated conversation                   │
│    • ❌ Knows nothing about HTTP, req, or res            │
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
```

### Why This Architecture? (Design Decisions)

| Decision                                                                               | Rationale                                                                                                                                                                                      |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Interface-first design** (`ChatController`, `ChatService`, `ConversationRepository`) | Every layer depends on an abstraction. Swapping Groq for OpenAI, or the in-memory Map for Redis, requires changing **one file** and zero callers.                                              |
| **Constructor-based Dependency Injection**                                             | Services receive their dependencies through the constructor — no hidden globals. This makes every class trivially unit-testable with mocks.                                                    |
| **Composition root in `routes.ts`**                                                    | All wiring (repository → service → controller → router) happens in exactly one place. `index.ts` is pure application bootstrap.                                                                |
| **Zod validation at the HTTP boundary**                                                | Invalid requests are rejected with `400` + a structured error format **before** any business logic runs. TypeScript infers types from the schema — validation and types can never drift apart. |
| **UUID validation duplicated in the repository**                                       | Defense in depth. Even if a future caller forgets validation, corrupt keys can never enter the data store.                                                                                     |
| **Defensive copy on `saveHistory`**                                                    | The repository owns its state. Callers cannot mutate stored conversation history through a leaked array reference — a classic bug source.                                                      |
| **`getHistory()` returns `[]` instead of `undefined`**                                 | Eliminates null-checks in the service layer (null-object pattern), simplifying the happy path.                                                                                                 |

---

## 📁 Project Structure

```
chat-boot/
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
    │   ├── .env.example              # Required environment variables template
    │   └── package.json
    │
    └── client/                       # ─── React SPA ───
        ├── src/
        │   ├── App.tsx               # Root layout
        │   ├── main.tsx              # React entry point
        │   ├── index.css             # Design tokens (OKLCH), dark mode, fonts
        │   ├── components/
        │   │   ├── ChatBot.tsx       # The full chat experience (~350 lines)
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
git clone https://github.com/<your-username>/chat-boot.git
cd chat-boot

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

| Method | Path           | Description                                                          |
| ------ | -------------- | -------------------------------------------------------------------- |
| `GET`  | `/`            | Server health / key echo                                             |
| `GET`  | `/api/message` | Simple connectivity check → `{ "message": "Hello from the server" }` |

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
6. **Service** asks the **repository** to `createConversation` (idempotent) and `getHistory`, appends the user message, and calls the Groq API with the full message history, `temperature: 0.2`, `max_tokens: 2000`.
7. **Service** extracts the assistant text (`message.content`, falling back to `message.reasoning` for reasoning models), appends it to history, and persists via `saveHistory`.
8. **Repository** stores a **defensive copy** of the messages in its in-memory `Map`.
9. **Controller** responds `200` with `{ message }`; the client hides the indicator, appends the assistant bubble with an entry animation, and auto-scrolls.

Errors at any stage are caught by the controller's `try/catch` and translated into a clean `500` response with an error banner in the UI — the app never crashes or leaks stack traces to the client.

---

## 🧠 Key Implementation Highlights

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

- **Dotted background pattern** generated with a CSS `radial-gradient` (no image assets)
- **Bouncing typing indicator** using staggered `animation-delay` utilities
- **Message animations** via `tw-animate-css` (`fade-in slide-in-from-bottom`)
- **OKLCH design tokens** — perceptually uniform colors that adapt to light/dark themes automatically
- **Accessible states** — disabled inputs during loading, focus rings, semantic buttons

---

## 🛠️ Tech Stack

### Frontend

| Technology                | Purpose                                                      |
| ------------------------- | ------------------------------------------------------------ |
| **React 19**              | UI library (latest concurrent features)                      |
| **TypeScript 6 (strict)** | End-to-end type safety                                       |
| **Vite 8**                | Dev server, HMR, `/api` proxy, production builds             |
| **Tailwind CSS v4**       | Utility-first styling with the new CSS-first `@theme` config |
| **shadcn/ui + Base UI**   | Accessible, composable component primitives                  |
| **lucide-react**          | Icon system                                                  |
| **tw-animate-css**        | Declarative entry animations                                 |

### Backend

| Technology                | Purpose                                                      |
| ------------------------- | ------------------------------------------------------------ |
| **Bun**                   | Runtime — fast startup, native TS execution                  |
| **Express 5**             | HTTP framework (async error handling built in)               |
| **Zod 4**                 | Schema validation & type inference                           |
| **OpenAI SDK → Groq API** | LLM inference (`openai/gpt-oss-20b`, ~fast token throughput) |
| **dotenv**                | Environment configuration                                    |

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

- [ ] **Streaming responses** (SSE) for token-by-token output
- [ ] **Persistent storage** — implement a Redis `ConversationRepository` (the interface is already designed for it)
- [ ] **Unit & integration tests** (Vitest + Supertest) — the DI architecture makes services trivially mockable
- [ ] **Rate limiting & API key auth** on the chat endpoint
- [ ] **Docker Compose** for one-command deployment
- [ ] **Markdown + syntax highlighting** rendering for assistant messages

---

## 📄 License

MIT — free to use, modify, and learn from.

---

<p align="center">
  Built with ❤️ and ☕ by <strong>&lt;Ahmed Ibrahim&gt;</strong><br/>
  <em>If this project impressed you, let's talk — my inbox is open.</em>
</p>
