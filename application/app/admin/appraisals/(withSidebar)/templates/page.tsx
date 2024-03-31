import { getAllAppraisalTemplates } from "@/actions/template.action";
import CreateAppraisalFromTemplateBtn from "@/components/appraisal/appriasal-from-template-btn";
import CreateAppraisalTemplate from "@/components/form/create-appraisal-template";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EditIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import PreviewTemplateModal from "../../_components/preview-template-modal";

export default async function AppraisalTemplates() {
  const templatesData = await getAllAppraisalTemplates();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Suspense
        fallback={[1, 2, 3, 4, 5, 6].map((el) => (
          <>
            <Skeleton
              key={el}
              className="border-primary-/20 h-[200px] w-full animate-pulse border-2"
            />
          </>
        ))}
      >
        <>
          <CreateAppraisalTemplate />
          {templatesData != null &&
            templatesData.data.map((template) => (
              <Card key={template.id} className="h-full max-h-[200px]">
                <CardHeader className="flex h-full flex-col justify-between">
                  <div className="flex flex-col gap-2">
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-base font-medium">
                        {template.name}
                      </span>
                      <Link
                        className="text-muted-foreground hover:text-primary"
                        href={`/admin/appraisals/${template.id}/builder?type=template`}
                      >
                        <EditIcon size={16} />
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      <p className="line-clamp-3 text-sm text-muted-foreground">
                        {template.description}
                      </p>
                    </CardDescription>
                  </div>

                  <div className="flex w-full gap-2">
                    <PreviewTemplateModal templateId={template.id}>
                      <Button className="w-full font-normal" variant="outline">
                        Preview
                      </Button>
                    </PreviewTemplateModal>

                    <CreateAppraisalFromTemplateBtn templateId={template.id} />
                  </div>
                </CardHeader>
              </Card>
            ))}
        </>
      </Suspense>
    </div>
  );
}
