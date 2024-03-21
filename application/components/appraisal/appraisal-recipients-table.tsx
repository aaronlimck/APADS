import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default async function AppraisalRecipientsTable({
  formData,
  employeeCompletedManagerAppraisedObject,
}: {
  formData: any;
  employeeCompletedManagerAppraisedObject: any;
}) {

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader className="bg-[#f7f7f8]">
          <TableRow>
            <TableHead className="rounded-tl-lg">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Employee Completed</TableHead>
            <TableHead className="rounded-tr-lg">Manager Reviewed</TableHead>
            <TableHead className="rounded-tr-lg"> View Appraisal</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {formData.recipientsId.length > 0 ? (
            <>
              {formData.recipientsId.map((recipient: any) => {
                const employeeCompleted =
                  employeeCompletedManagerAppraisedObject?.[recipient.id]
                    ?.employeeCompleted;
                const managerAppraised =
                  employeeCompletedManagerAppraisedObject?.[recipient.id]
                    ?.managerCompleted;
                const buttonDisabled = !(employeeCompleted && managerAppraised);

                return (
                  <TableRow key={recipient.id}>
                    <TableCell>{recipient.name}</TableCell>
                    <TableCell>{recipient.email}</TableCell>
                    <TableCell>{employeeCompleted ? "Yes" : "No"}</TableCell>
                    <TableCell>{managerAppraised ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/appraisals/${formData.id}/${recipient.id}/response`}
                        className={buttonDisabled ? "pointer-events-none" : ""}
                        aria-disabled={buttonDisabled}
                        tabIndex={buttonDisabled ? -1 : undefined}
                      >
                        <Button variant="outline" size="icon" disabled={buttonDisabled}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
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
