import { faker } from '@faker-js/faker';

interface Question {
  id: string;
  options: string[] | null;
}

const questions: Question[] = [
  {
    id: "9223",
    options: ["Excellent", "Good", "Satisfactory", "Needs Improvement"]
  },
  {
    id: "8400",
    options: ["Exceptional", "Competent", "Adequate", "Requires Improvement"]
  },
  {
    id: "2571",
    options: ["Always collaborative", "Usually collaborative", "Occasionally collaborative", "Rarely collaborative"]
  },
  {
    id: "3033",
    options: ["Very well", "Well", "Somewhat", "Not well"]
  },
  {
    id: "9771",
    options: null
  },
  {
    id: "6311",
    options: null
  }
];

const responses1: Response[] = [
  {
    "2571": "Usually collaborative",
    "3033": "Not well",
    "6311":
      "Learning a new development language was challenging but through peer programming I was able to overcome it.",
    "8400": "Competent",
    "9223": "Good",
    "9771":
      "I developed the dashboard which provided many useful insights to upper management which resulted in us saving thousands of dollars.",
  },
  {
    "2571": "Always collaborative",
    "3033": "Well",
    "6311":
      "I have faced some difficulties to find and get some instruments and proper tools when I’m going to do and set a job.",
    "8400": "Competent",
    "9223": "Excellent",
    "9771":
      "I accomplished all my goals and learnt alot of new technical skills.",
  },
  {
    "2571": "Occasionally collaborative",
    "3033": "Not well",
    "6311": "I have experienced some interpersonal challenges within my team",
    "8400": "Adequate",
    "9223": "Good",
    "9771": "I achieved the most productive employee award.",
  },
];
interface Response {
  [key: string]: string;
}

// Generate 30 random responses

for (let i = 0; i < 30; i++) {
  const response: Response = {};
  for (const question of questions) {
    if (question.options) {
      const randomIndex = Math.floor(Math.random() * question.options.length);
      response[question.id] = question.options[randomIndex];
    } else {
      response[question.id] = faker.lorem.sentences();
    }
  }
  responses1.push(response);
}


export const responses = responses1;
