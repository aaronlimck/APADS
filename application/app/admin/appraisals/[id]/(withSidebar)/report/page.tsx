import AppraisalReportClientPage from "./page-client";

export default async function AppraisalReportPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Report</h1>
      <AppraisalReportClientPage id={params.id} />
    </div>
  );
}
