export interface Lesson {
  id: number;
  title: string;
  youtubeId: string;
  description: string;
  duration?: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  currency: string;
  lessons: Lesson[];
  pdfUrl?: string;
}

export const COURSES: Course[] = [
  {
    id: "pds-foundations",
    slug: "pds-foundations",
    title: "Professional Delivery Skipper Foundations",
    subtitle: "Dein Fundament als bezahlter Delivery Skipper",
    description:
      "In diesem Kurs lernst du alles Wesentliche, um als Professional Delivery Skipper durchzustarten: von der Realität des Jobs über Markt und Wirtschaftlichkeit bis hin zu Haftung, Versicherung und deinem persönlichen nächsten Schritt.",
    price: 299,
    currency: "EUR",
    lessons: [
      {
        id: 1,
        title: "Session 1: Realität & Verantwortung",
        youtubeId: "hyjgNPGM6T8",
        description:
          "Was bedeutet es wirklich, als Delivery Skipper zu arbeiten? Wir sprechen über die tatsächliche Verantwortung, die du übernimmst – für Schiff, Crew und Auftraggeber.",
        duration: "ca. 45 Min.",
      },
      {
        id: 2,
        title: "Session 2: Markt & Wirtschaftlichkeit",
        youtubeId: "eCgtuOgvGCo",
        description:
          "Wie sieht der Markt für Delivery-Skipper aus? Welche Verdienstmöglichkeiten gibt es, und was musst du kalkulieren, um wirklich profitabel zu arbeiten?",
        duration: "ca. 50 Min.",
      },
      {
        id: 3,
        title: "Session 3: Haftung & Versicherung",
        youtubeId: "BeJwpqLZkOI",
        description:
          "Welche Haftungsrisiken trägst du als Delivery Skipper? Welche Versicherungen sind unverzichtbar, und wie schützt du dich rechtlich ab?",
        duration: "ca. 40 Min.",
      },
      {
        id: 4,
        title: "Session 4: Entscheidung & nächster Schritt",
        youtubeId: "ocGiT5bjUTo",
        description:
          "Du hast alle Grundlagen. Jetzt geht es darum: Wie triffst du die Entscheidung, und welches sind deine konkreten nächsten Schritte als Delivery Skipper?",
        duration: "ca. 35 Min.",
      },
    ],
  },
];

export function getCourseById(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id || c.slug === id);
}

export function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(price);
}
