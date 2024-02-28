import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export default async function AppraisalRecipientsTable({
  formData,
}: {
  formData: any;
}) {
  console.log(formData.recipientsId);

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader className="bg-[#f7f7f8]">
          <TableRow>
            <TableHead className="rounded-tl-lg">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Employee Completed</TableHead>
            <TableHead className="rounded-tr-lg">Manager Reviewed</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {formData.recipientsId.length > 0 ? (
            <>
              {formData.recipientsId.map((recipient: any) => {
                return (
                  <TableRow key={recipient.id}>
                    <TableCell>{recipient.name}</TableCell>
                    <TableCell>{recipient.email}</TableCell>
                    <TableCell>
                      {recipient.employeeCompleted ? "Yes" : "No"}
                    </TableCell>
                    <TableCell>
                      {recipient.managerReviewed ? "Yes" : "No"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </>
          ) : (
            <>
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No recipients found
                </TableCell>
              </TableRow>
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
