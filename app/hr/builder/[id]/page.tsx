import { GetTemplateById } from "@/actions/template";
import FormBuilder from "@/components/TemplateBuilder";
import React from "react";

async function BuilderPage({
  params
}: {
  params: {
    id: string;
  };
}) {
  const { id } = params;
  const template = await GetTemplateById(Number(id));
  // console.log(form);
  if (!template) {
    throw new Error("form not found");
  }
  return <FormBuilder template={template} />;
}

export default BuilderPage;
