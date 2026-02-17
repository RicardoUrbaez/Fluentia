import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { z } from "zod";
import { prisma } from "./prisma";
import { callOllamaChat } from "./ollama";
import { graderPrompt, tutorSystemPrompt } from "./prompts";
import { evaluationSchema } from "./types";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const tutorModel = process.env.TUTOR_MODEL || "qwen2.5:7b-instruct";
const graderModel = process.env.GRADER_MODEL || "qwen2.5:3b-instruct";

app.use(cors({ origin: clientOrigin }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    app: "Fluentia API",
    status: "ok",
    frontend: "http://localhost:5173",
    health: "/api/health"
  });
});

const parseGraderJson = (content: string) => {
  const trimmed = content.trim();
  const first = trimmed.indexOf("{");
  const last = trimmed.lastIndexOf("}");
  const rawJson = first >= 0 && last > first ? trimmed.slice(first, last + 1) : trimmed;
  const parsed = JSON.parse(rawJson);
  return evaluationSchema.parse(parsed);
};

app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true });
  } catch {
    res.status(500).json({ ok: false, error: "Database connection failed" });
  }
});

app.post("/api/users", async (req, res) => {
  const schema = z.object({ name: z.string().min(1), language: z.string().optional() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      language: parsed.data.language || "Spanish"
    }
  });

  return res.status(201).json(user);
});

app.get("/api/topics", async (_req, res) => {
  const topics = await prisma.topic.findMany({ orderBy: { id: "asc" } });
  res.json(topics);
});

app.get("/api/lessons", async (req, res) => {
  const topicName = typeof req.query.topic === "string" ? req.query.topic : undefined;
  const topicId = typeof req.query.topicId === "string" ? Number(req.query.topicId) : undefined;

  const where = topicId
    ? { topicId }
    : topicName
      ? { topic: { name: topicName } }
      : undefined;

  const lessons = await prisma.lesson.findMany({
    where,
    include: {
      vocabItems: true,
      questions: true,
      topic: true
    },
    orderBy: { id: "asc" }
  });

  res.json(lessons);
});

app.post("/api/session/start", async (req, res) => {
  const schema = z.object({
    userId: z.number().int(),
    topicId: z.number().int(),
    lessonId: z.number().int()
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const session = await prisma.session.create({
    data: parsed.data,
    include: {
      topic: true,
      lesson: true
    }
  });

  res.status(201).json(session);
});

app.post("/api/chat/send", async (req, res) => {
  const schema = z.object({
    sessionId: z.number().int(),
    message: z.string().min(1)
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { sessionId, message } = parsed.data;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      topic: true,
      lesson: true,
      messages: {
        orderBy: { createdAt: "asc" },
        take: 8
      }
    }
  });

  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }

  try {
    const userMessage = await prisma.message.create({
      data: {
        sessionId,
        role: "USER",
        content: message
      }
    });

    const tutorMessages = [
      {
        role: "system" as const,
        content: tutorSystemPrompt(session.topic.name, session.lesson.skillFocus, "Spanish")
      },
      ...session.messages.map((msg: { role: string; content: string }) => ({
        role: msg.role === "USER" ? ("user" as const) : ("assistant" as const),
        content: msg.content
      })),
      {
        role: "user" as const,
        content: message
      }
    ];

    const assistantMessageContent = await callOllamaChat(tutorModel, tutorMessages);

    const assistantMessage = await prisma.message.create({
      data: {
        sessionId,
        role: "ASSISTANT",
        content: assistantMessageContent
      }
    });

    const graderMessages = [
      {
        role: "system" as const,
        content: graderPrompt(session.topic.name, session.lesson.skillFocus, message)
      },
      {
        role: "user" as const,
        content: message
      }
    ];

    const graderResponse = await callOllamaChat(graderModel, graderMessages);
    const evaluation = parseGraderJson(graderResponse);

    await prisma.evaluation.create({
      data: {
        sessionId,
        messageId: userMessage.id,
        grammar: evaluation.grammar,
        vocabulary: evaluation.vocabulary,
        fluency: evaluation.fluency,
        taskCompletion: evaluation.taskCompletion,
        cefr: evaluation.cefr,
        evidenceJson: JSON.stringify(evaluation.evidence),
        nextExercise: evaluation.nextExercise,
        wordBankJson: JSON.stringify(evaluation.wordBank),
        feedbackJson: JSON.stringify(evaluation.feedbackBullets)
      }
    });

    if (evaluation.evidence.length > 0) {
      await prisma.mistake.createMany({
        data: evaluation.evidence
          .filter((item) => item.mistakeQuote.trim().length > 0)
          .map((item) => ({
            userId: session.userId,
            topicId: session.topicId,
            word: item.mistakeQuote,
            correction: item.correction,
            quote: message
          }))
      });
    }

    return res.json({
      assistantMessage,
      evaluationJSON: evaluation
    });
  } catch (error: unknown) {
    const text = error instanceof Error ? error.message : "Unexpected chat error";
    const isOllama = text.toLowerCase().includes("ollama");
    return res.status(isOllama ? 503 : 500).json({ error: text });
  }
});

app.get("/api/dashboard/:userId", async (req, res) => {
  const userId = Number(req.params.userId);

  if (Number.isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  const sessions = await prisma.session.findMany({
    where: { userId },
    include: {
      topic: true,
      evaluations: {
        orderBy: { createdAt: "asc" }
      }
    }
  });

  const topicCompletion = sessions.reduce((acc: Record<string, number>, session: { topic: { name: string } }) => {
    acc[session.topic.name] = (acc[session.topic.name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const cefrTrend = sessions.flatMap((session: { evaluations: Array<{ createdAt: Date; cefr: string; grammar: number; vocabulary: number; fluency: number; taskCompletion: number }> }) =>
    session.evaluations.map((evaluation: { createdAt: Date; cefr: string; grammar: number; vocabulary: number; fluency: number; taskCompletion: number }) => ({
      date: evaluation.createdAt.toISOString().slice(0, 10),
      cefr: evaluation.cefr,
      score: evaluation.grammar + evaluation.vocabulary + evaluation.fluency + evaluation.taskCompletion
    }))
  );

  const mistakes = await prisma.mistake.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20
  });

  const wordBank = Array.from(new Set(mistakes.map((item: { word: string }) => item.word))).slice(0, 20);

  return res.json({
    topicCompletion,
    cefrTrend,
    commonMistakes: mistakes.map((item: { word: string; correction: string; quote: string }) => ({
      word: item.word,
      correction: item.correction,
      quote: item.quote
    })),
    wordBank
  });
});

app.get("/api/session/:id/messages", async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid session id" });
  }

  const messages = await prisma.message.findMany({
    where: { sessionId: id },
    orderBy: { createdAt: "asc" }
  });

  res.json(messages);
});

app.listen(port, () => {
  console.log(`Fluentia API listening on http://localhost:${port}`);
});
