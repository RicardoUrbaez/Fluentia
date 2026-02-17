# Fluentia MVP

Fluentia is a Duolingo-style Spanish practice app with:
- Pre-made micro-lessons (non-AI lecture)
- Topic-based AI roleplay practice using local Ollama
- Per-message rubric evaluation and CEFR estimate
- Progress dashboard with trends and mistake tracking

## Stack

- `client/`: React + TypeScript + Vite + Tailwind
- `server/`: Node.js + Express + Prisma + SQLite
- Local LLM runtime: Ollama
  - Tutor model: `qwen2.5:7b-instruct`
  - Grader model: `qwen2.5:3b-instruct`

## Project structure

- `server/prisma/schema.prisma` data models
- `server/prisma/seed.ts` topics + lessons + vocab + MCQs
- `server/src/index.ts` API routes
- `server/src/prompts.ts` tutor + grader prompt builders
- `server/scripts/testChat.ts` minimal backend chat test script
- `client/src/pages/*` Landing, Onboarding, Dashboard, Lesson, Practice
- `client/src/components/*` TopicCard, LessonCard, ChatBubble, FeedbackPanel, ProgressCharts

## Setup

### Quick start (one command to run both)

From the workspace root:

```bash
npm install
npm run install:all
```

Then after Ollama + DB setup (below), run both backend and frontend with one command:

```bash
npm run dev
```

This starts:
- API on `http://localhost:4000`
- Web app on `http://localhost:5173`

### 1) Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### 2) Install and run Ollama

Install Ollama from https://ollama.com/download, then run:

```bash
ollama serve
```

### 3) Pull required models

```bash
ollama pull qwen2.5:7b-instruct
ollama pull qwen2.5:3b-instruct
```

### 4) Configure env files

```bash
cd server
copy .env.example .env

cd ../client
copy .env.example .env
```

### 5) Run migration and seed

```bash
cd server
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
```

### 6) Start backend and frontend

```bash
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:4000`

## API endpoints

- `POST /api/users` `{ name }`
- `GET /api/topics`
- `GET /api/lessons?topicId=1` or `GET /api/lessons?topic=Travel`
- `POST /api/session/start` `{ userId, topicId, lessonId }`
- `POST /api/chat/send` `{ sessionId, message }`
- `GET /api/dashboard/:userId`
- `GET /api/session/:id/messages`

## Ollama failure behavior

If Ollama is not running, `/api/chat/send` returns HTTP `503` with a helpful message indicating to start Ollama at `http://localhost:11434`.

## Minimal test script

With server running:

```bash
cd server
npm run test:chat
```

This script:
1. Creates a user
2. Loads Travel topic and first lesson
3. Starts a session
4. Sends a sample message
5. Prints assistant response + grader JSON
