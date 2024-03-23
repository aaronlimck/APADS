"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EmployeeForm from "./new-employee-form";
import { useState } from "react";

export default function NewEmployeeModal({
  action,
}: {
  action: React.ReactNode;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{action}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Employee</DialogTitle>
          <DialogDescription>
            Fill in the form below to add a new employee.
          </DialogDescription>
        </DialogHeader>

        <EmployeeForm closeModal={handleDialogClose} />
      </DialogContent>
    </Dialog>
  );
}
