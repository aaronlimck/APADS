import { publishAppraisalFormByDepartments } from "@/actions/appraisal.action";
import { createAppraisalFromTemplate } from "@/actions/template.action";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { templateId,departments } = await request.json();

  try {
    const response = await createAppraisalFromTemplate(templateId);
    
    if (response && response.status === 201) {
      const payload = {
        id: response.data.id,
        content: response.data.content,
        recipientsDepartment: departments,
      };
      const publish = await publishAppraisalFormByDepartments(payload)
      console.log(publish)
      return new Response(JSON.stringify(publish.data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Failed to create appraisal");
  }
}
