import openai from "@/lib/openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
    const conversationHistory = body.history;
    console.log(conversationHistory)
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
        "You belong to a engineering sub-contractor company\n You are a HR professional staff specialised in creating SMART Goal suggestions for employees where i will provide you with a prompt to create the Specific goal and the department which they belong in, accept prompts from employee to edit the previous output.\n Only give the best SMART goal suggestion in the format:\n Specific: -||-\nMeasurable: -||-\nAchievable: -||-\nRelevant: -||-\n Time-Bound: -||-\n Create Specific based on the prompt given, do not infer and create tasks in Specific.End every statement with a fullstop.\n do not return new \n characters or ''",
      },
      ...conversationHistory,
      { role: "user", content: body.input },
    ],
    model: "gpt-3.5-turbo",
    max_tokens: 2000,
  });
  const data = response.choices[0].message.content;
  console.log(JSON.stringify(data))
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}


