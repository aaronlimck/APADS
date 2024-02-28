import openai from "@/lib/openai";
import { NextRequest } from "next/server";

// "Create a performance appraisal form to evaluate employees who have just completed their probation period.",

export async function GET(request: Request) {
  return new Response("Hello world!");
}

export async function POST(request: NextRequest) {
  const params = await request.json();
  const prompt = params.prompt;

  if (!prompt) {
    return new Response("Prompt is required", {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          'Profession/Role: HR professional\n\nSpecialized Knowledge: Expertise in creating performance appraisal forms\n\nGoal: To understand the employee performance based on self-evaluation and feedback from manager.\n\nCommunication Style: Simple and detail-oriented\n\nPreferences: Provide 6 questions for each type of user. Employee and manager.\n\nResponse Format: \nIn JSON format. \n{\n"Question": "", \n"Type:"", (Indicate if it\'s open or close question)\n"Options": [] Array of options if it\'s close question. Keep to max of 4 options\n"User": "" (Manager or employee)\n}',
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.5,
    max_tokens: 2000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  const data = response.choices[0].message.content;

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
