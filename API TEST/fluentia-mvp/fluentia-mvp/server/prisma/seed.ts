import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SeedLesson = {
  title: string;
  skillFocus: string;
  readingPassage: string;
  listeningText: string;
  vocab: Array<{ word: string; english: string; imageUrl: string }>;
  questions: Array<{
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    correctOption: "A" | "B" | "C";
  }>;
};

const lessonData: Record<string, SeedLesson[]> = {
  Travel: [
    {
      title: "At the Airport",
      skillFocus: "Verb 'to be' (ser/estar) in present tense",
      readingPassage:
        "Ana está en el aeropuerto de Madrid. Ella es turista y está nerviosa porque su puerta está lejos. El agente es amable y Ana está lista para viajar.",
      listeningText:
        "Hola, soy Ana. Estoy en el aeropuerto y mi vuelo está a tiempo.",
      vocab: [
        { word: "aeropuerto", english: "airport", imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05" },
        { word: "puerta", english: "gate", imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e" },
        { word: "vuelo", english: "flight", imageUrl: "https://images.unsplash.com/photo-1540339832862-474599807836" },
        { word: "pasaporte", english: "passport", imageUrl: "https://images.unsplash.com/photo-1528756514091-dee5ecaa3278" },
        { word: "maleta", english: "suitcase", imageUrl: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b" }
      ],
      questions: [
        {
          question: "Choose the correct sentence.",
          optionA: "Ana es en el aeropuerto.",
          optionB: "Ana está en el aeropuerto.",
          optionC: "Ana estar en el aeropuerto.",
          correctOption: "B"
        },
        {
          question: "What does 'vuelo' mean?",
          optionA: "flight",
          optionB: "ticket",
          optionC: "station",
          correctOption: "A"
        },
        {
          question: "Complete: El agente ___ amable.",
          optionA: "es",
          optionB: "está",
          optionC: "soy",
          correctOption: "A"
        }
      ]
    },
    {
      title: "Asking for Directions",
      skillFocus: "Present tense questions with estar and location words",
      readingPassage:
        "Luis está perdido en Sevilla. Él pregunta: ¿Dónde está el hotel? Una mujer responde: El hotel está cerca de la plaza. Luis está contento y camina rápido.",
      listeningText:
        "Perdón, ¿dónde está la estación de tren?",
      vocab: [
        { word: "mapa", english: "map", imageUrl: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff" },
        { word: "calle", english: "street", imageUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df" },
        { word: "plaza", english: "square", imageUrl: "https://images.unsplash.com/photo-1534430480872-3498386e7856" },
        { word: "estación", english: "station", imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3" },
        { word: "hotel", english: "hotel", imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945" }
      ],
      questions: [
        {
          question: "How do you ask 'Where is the hotel?'",
          optionA: "¿Dónde es el hotel?",
          optionB: "¿Dónde está el hotel?",
          optionC: "¿Dónde hotel está?",
          correctOption: "B"
        },
        {
          question: "Choose the best word for 'street'.",
          optionA: "calle",
          optionB: "plaza",
          optionC: "mapa",
          correctOption: "A"
        },
        {
          question: "Complete: Luis ___ perdido.",
          optionA: "es",
          optionB: "está",
          optionC: "soy",
          correctOption: "B"
        }
      ]
    }
  ],
  Home: [
    {
      title: "My Apartment Today",
      skillFocus: "Subject pronouns + present tense ser/estar at home",
      readingPassage:
        "Yo soy Carlos y vivo en un apartamento pequeño. Mi cocina está limpia y mi sala está tranquila. Nosotros somos vecinos amables en este edificio.",
      listeningText:
        "Mi habitación está ordenada y la cocina es moderna.",
      vocab: [
        { word: "cocina", english: "kitchen", imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f" },
        { word: "sala", english: "living room", imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85" },
        { word: "habitación", english: "bedroom", imageUrl: "https://images.unsplash.com/photo-1505693314120-0d443867891c" },
        { word: "edificio", english: "building", imageUrl: "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5" },
        { word: "vecino", english: "neighbor", imageUrl: "https://images.unsplash.com/photo-1511988617509-a57c8a288659" }
      ],
      questions: [
        {
          question: "Choose the correct pronoun sentence.",
          optionA: "Yo somos Carlos.",
          optionB: "Yo soy Carlos.",
          optionC: "Yo está Carlos.",
          correctOption: "B"
        },
        {
          question: "What does 'cocina' mean?",
          optionA: "kitchen",
          optionB: "bathroom",
          optionC: "window",
          correctOption: "A"
        },
        {
          question: "Complete: La sala ___ tranquila.",
          optionA: "soy",
          optionB: "es",
          optionC: "está",
          correctOption: "C"
        }
      ]
    },
    {
      title: "Yesterday at Home",
      skillFocus: "Simple past with estar/ser in home routines",
      readingPassage:
        "Ayer yo estuve en casa todo el día. La casa estuvo silenciosa y el clima fue perfecto. Mi familia fue muy amable durante la cena.",
      listeningText: "Ayer estuve en casa y fue un día muy tranquilo.",
      vocab: [
        { word: "ayer", english: "yesterday", imageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe" },
        { word: "cena", english: "dinner", imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd" },
        { word: "familia", english: "family", imageUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300" },
        { word: "silencioso", english: "quiet", imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688" },
        { word: "clima", english: "weather", imageUrl: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b" }
      ],
      questions: [
        {
          question: "Pick the past tense sentence.",
          optionA: "Yo estoy en casa.",
          optionB: "Yo estuve en casa.",
          optionC: "Yo ser en casa.",
          correctOption: "B"
        },
        {
          question: "What does 'ayer' mean?",
          optionA: "tomorrow",
          optionB: "yesterday",
          optionC: "today",
          correctOption: "B"
        },
        {
          question: "Complete: Mi familia ___ amable.",
          optionA: "fue",
          optionB: "está",
          optionC: "soy",
          correctOption: "A"
        }
      ]
    }
  ],
  Work: [
    {
      title: "Office Introductions",
      skillFocus: "Present tense ser/estar for identity and workplace status",
      readingPassage:
        "Sofía es diseñadora en una oficina internacional. Ella está en una reunión y sus compañeros están listos. El proyecto es importante esta semana.",
      listeningText: "Hola, soy Sofía y estoy en la oficina ahora.",
      vocab: [
        { word: "oficina", english: "office", imageUrl: "https://images.unsplash.com/photo-1497215842964-222b430dc094" },
        { word: "reunión", english: "meeting", imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d" },
        { word: "compañero", english: "coworker", imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f" },
        { word: "proyecto", english: "project", imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952" },
        { word: "correo", english: "email", imageUrl: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32" }
      ],
      questions: [
        {
          question: "Complete: Sofía ___ diseñadora.",
          optionA: "está",
          optionB: "es",
          optionC: "soy",
          correctOption: "B"
        },
        {
          question: "Which means 'meeting'?",
          optionA: "reunión",
          optionB: "proyecto",
          optionC: "correo",
          correctOption: "A"
        },
        {
          question: "Complete: Los compañeros ___ listos.",
          optionA: "es",
          optionB: "somos",
          optionC: "están",
          correctOption: "C"
        }
      ]
    },
    {
      title: "Next Week Plans",
      skillFocus: "Near future with ir a + infinitive in work context",
      readingPassage:
        "La próxima semana vamos a presentar un informe. Yo voy a preparar las diapositivas y mi jefe va a revisar los números. Vamos a trabajar en equipo.",
      listeningText: "Mañana voy a enviar un correo al equipo.",
      vocab: [
        { word: "informe", english: "report", imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40" },
        { word: "diapositiva", english: "slide", imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c" },
        { word: "jefe", english: "boss", imageUrl: "https://images.unsplash.com/photo-1573497491208-6b1acb260507" },
        { word: "equipo", english: "team", imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c" },
        { word: "número", english: "number", imageUrl: "https://images.unsplash.com/photo-1533750349088-cd871a92f312" }
      ],
      questions: [
        {
          question: "Choose the near-future sentence.",
          optionA: "Voy preparar el informe.",
          optionB: "Voy a preparar el informe.",
          optionC: "Yo preparando el informe.",
          correctOption: "B"
        },
        {
          question: "What is 'equipo'?",
          optionA: "meeting",
          optionB: "team",
          optionC: "office",
          correctOption: "B"
        },
        {
          question: "Complete: Mi jefe ___ a revisar los números.",
          optionA: "va",
          optionB: "es",
          optionC: "está",
          correctOption: "A"
        }
      ]
    }
  ]
};

async function seed() {
  await prisma.evaluation.deleteMany();
  await prisma.message.deleteMany();
  await prisma.session.deleteMany();
  await prisma.mistake.deleteMany();
  await prisma.lessonQuestion.deleteMany();
  await prisma.lessonVocabItem.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.topic.deleteMany();

  for (const [topicName, lessons] of Object.entries(lessonData)) {
    const topic = await prisma.topic.create({
      data: { name: topicName, language: "Spanish" }
    });

    for (const lesson of lessons) {
      await prisma.lesson.create({
        data: {
          topicId: topic.id,
          title: lesson.title,
          skillFocus: lesson.skillFocus,
          readingPassage: lesson.readingPassage,
          listeningText: lesson.listeningText,
          vocabItems: {
            create: lesson.vocab
          },
          questions: {
            create: lesson.questions
          }
        }
      });
    }
  }
}

seed()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed complete");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
