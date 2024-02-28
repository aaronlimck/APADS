import { getAllAppraisals } from "@/actions/appraisal.action";
import AppraisalItem, {
  AppraisalItemSkeleton,
} from "@/components/appraisal/appraisal-Item";
import { Suspense } from "react";

export default function AdminFormsPage() {
  return (
    <main className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense
          fallback={[1, 2, 3, 4, 5, 6].map((el) => (
            <AppraisalItemSkeleton key={el} />
          ))}
        >
          <AppraisalForm />
        </Suspense>
      </div>
    </main>
  );
}

export async function AppraisalForm() {
  const appraisalForms = await getAllAppraisals();
  return appraisalForms.data.length > 0 ? (
    <>
      {appraisalForms.data.map((form) => (
        <AppraisalItem key={form.id} form={form} />
      ))}
    </>
  ) : (
    "No Appraisal"
  );
}
