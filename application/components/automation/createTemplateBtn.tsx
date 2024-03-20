"use client";
import { Button } from "../ui/button";

export default function CreateTemplateBtn() {
  const createAppraisal = async (templateId: any) => {
    try {
      const response = await fetch("/api/generate-appraisal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify({templateId:templateId}), 
      });

      // Handle response here
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <Button onClick={() => createAppraisal("cltrijafa000vbz633cglc4gd")} />
    </>
  );
}
