import { getAllAppraisalTemplates } from "@/actions/template.action";
import CreateAppraisalFromTemplateBtn from "@/components/appraisal/appriasal-from-template-btn";
import CreateAppraisalTemplate from "@/components/form/create-appraisal-template";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Suspense } from "react";

export default async function AppraisalTemplates() {
  const templatesData = await getAllAppraisalTemplates();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Suspense
        fallback={[1, 2, 3, 4, 5].map((el) => (
          <>
            <CreateAppraisalTemplate />
            <Skeleton
              key={el}
              className="border-primary-/20 h-[200px] w-full animate-pulse border-2"
            />
          </>
        ))}
      >
        <CreateAppraisalTemplate />
        {templatesData != null &&
          templatesData.data.map((template) => (
            <div
              key={template.id}
              className="flex h-[200px] w-full flex-col items-center justify-center space-y-2 rounded-lg border bg-white p-4 font-normal capitalize shadow-sm"
            >
              <h1 className="font-medium">{template.name}</h1>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {template.description}
              </p>

              <div className="flex gap-2">
                <CreateAppraisalFromTemplateBtn templateId={template.id} />
                <Button className="font-normal" variant="outline">
                  <Link
                    href={`/admin/appraisals/${template.id}/builder?type=template`}
                  >
                    Edit Template
                  </Link>
                </Button>
              </div>
            </div>
          ))}
      </Suspense>
    </div>
  );
}
