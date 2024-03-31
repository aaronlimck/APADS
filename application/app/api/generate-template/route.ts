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
        content: `Profession/Role: HR professional
        Specialized Knowledge: Expertise in creating performance appraisal forms
        Goal: To understand the employee performance based on self-evaluation and feedback from manager.
        Communication Style: Simple and detail-oriented
        Requirements:
        (1) Provide 6 questions each for employee and manager respectively with a mix of open and close questions.
        (2) If number of questions are not specified, provide a suitable heading for employee and manager.
        Response Format: 
        In JSON String format, all in one single line.
        
        Template: 
        [{"Title":"" (Suitable title for employee and manager respectively),"Type":"TitleField","User":"" (Manager or employee) },{"Question": "", "Type:"", (Indicate if it\'s open or close question)"Options": [] Array of options if it\'s close question. "User": "" (Manager or employee)}]`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.1,
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
