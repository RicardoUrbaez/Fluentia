import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const apiBase = `http://localhost:${process.env.PORT || 4000}`;

async function run() {
  const user = await axios.post(`${apiBase}/api/users`, { name: "MVP Tester", language: "Spanish" });
  const topics = await axios.get(`${apiBase}/api/topics`);
  const travel = topics.data.find((topic: { name: string }) => topic.name === "Travel");

  const lessons = await axios.get(`${apiBase}/api/lessons`, {
    params: { topicId: travel.id }
  });

  const firstLesson = lessons.data[0];

  const session = await axios.post(`${apiBase}/api/session/start`, {
    userId: user.data.id,
    topicId: travel.id,
    lessonId: firstLesson.id
  });

  const chat = await axios.post(`${apiBase}/api/chat/send`, {
    sessionId: session.data.id,
    message: "Hola, estoy en el aeropuerto y estoy un poco nervioso."
  });

  console.log("Assistant Reply:\n", chat.data.assistantMessage.content || chat.data.assistantMessage);
  console.log("Evaluation JSON:\n", JSON.stringify(chat.data.evaluationJSON, null, 2));
}

run().catch((error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.error("Request failed:", error.response?.data || error.message);
  } else {
    console.error(error);
  }
  process.exit(1);
});
