export type Faculty = {
  slug: string;
  name: string;
  honorific: string;
  subject: string;
  constellationName: string;
  lesson: string;
  memory: string;
  qualities: string[];
  message: string;
  signature: string;
};

export const facultyList: Faculty[] = [
  {
    slug: "anitha",
    name: "Anitha Ma'am",
    honorific: "Prof.",
    subject: "Computer Science & Engineering",
    constellationName: "ANITHA",
    lesson:
      "You taught us more than Computer Science.\nYou taught us how to think, how to question,\nhow to keep learning, and how to believe in ourselves.",
    memory:
      "I'll always remember the way you explained difficult concepts\nuntil every single person in the room understood.\nThose moments made your classes something we looked forward to.",
    qualities: ["GUIDANCE", "PATIENCE", "KNOWLEDGE", "INSPIRATION", "SUPPORT", "KINDNESS"],
    message:
      "Dear Ma'am,\n\nThank you for every lesson, every correction,\nevery encouragement, and every moment you gave us.\n\nYour classes may have ended, but the lessons you've given us\nwill continue far beyond the classroom.",
    signature: "Santhosh",
  },
  {
    slug: "ramesh",
    name: "Ramesh Sir",
    honorific: "Dr.",
    subject: "Data Structures & Algorithms",
    constellationName: "RAMESH",
    lesson:
      "You taught us more than Data Structures.\nYou taught us that a hard problem is only\na simple problem that hasn't been broken down yet.",
    memory:
      "I'll always remember the day you stayed back after class\njust to walk one doubt through, step by step,\nuntil it finally clicked for all of us.",
    qualities: ["CLARITY", "PATIENCE", "LOGIC", "INSPIRATION", "DISCIPLINE", "WARMTH"],
    message:
      "Dear Sir,\n\nThank you for the patience you showed us\non the days we understood nothing at all.\n\nYou made difficult things feel possible,\nand that confidence stayed with us.",
    signature: "Santhosh",
  },
  {
    slug: "priya",
    name: "Priya Ma'am",
    honorific: "Prof.",
    subject: "Database Management Systems",
    constellationName: "PRIYA",
    lesson:
      "You taught us more than Databases.\nYou taught us that structure, honesty and care\nmatter as much in life as they do in design.",
    memory:
      "I'll always remember how your classes never felt like a lecture —\nthey felt like a conversation where every question was welcome.",
    qualities: ["ENCOURAGEMENT", "CURIOSITY", "KNOWLEDGE", "TRUST", "SUPPORT", "KINDNESS"],
    message:
      "Dear Ma'am,\n\nThank you for making the classroom a place\nwhere it was safe to be wrong and to try again.\n\nThat lesson will outlive every syllabus.",
    signature: "Santhosh",
  },
];

export const defaultFaculty: Faculty = {
  slug: "teacher",
  name: "Dear Teacher",
  honorific: "",
  subject: "For every lesson that never ended",
  constellationName: "TEACHER",
  lesson:
    "You taught us more than a subject.\nYou taught us how to think, how to question,\nhow to keep learning, and how to believe in ourselves.",
  memory:
    "I'll always remember the patience in your voice\non the days we understood nothing at all —\nand how you explained it once more anyway.",
  qualities: ["GUIDANCE", "PATIENCE", "KNOWLEDGE", "INSPIRATION", "SUPPORT", "KINDNESS"],
  message:
    "Thank you for every lesson, every correction,\nevery encouragement, and every moment you gave us.\n\nYour classes may have ended, but the lessons you've given us\nwill continue far beyond the classroom.",
  signature: "Your students",
};

export function getFaculty(slug?: string | null): Faculty {
  if (!slug) return defaultFaculty;
  const key = slug.toLowerCase().trim();
  return facultyList.find((f) => f.slug === key) ?? defaultFaculty;
}
