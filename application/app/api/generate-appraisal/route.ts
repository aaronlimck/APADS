import { createAppraisalFromTemplate } from "@/actions/template.action";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { templateId } = await request.json();

  try {
    const response = await createAppraisalFromTemplate(templateId);
    if (response && response.status === 201) {
      return new Response(JSON.stringify(response.data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Failed to create appraisal");
  }
}
