"use client";
import { EditIcon, MoreHorizontalIcon, Trash2Icon } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { deleteAppraisalById } from "@/actions/appraisal.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useState } from "react";

export default function AppraisalMoreBtn({ formId }: { formId: string }) {
  const router = useRouter();
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleDelete = async (formId: string) => {
    try {
      const response = await deleteAppraisalById(formId);
      if (response.status === 200) {
        router.replace(`/admin/appraisals`);
        router.refresh();
        toast.success(response.message);
      }
    } catch (error) {}
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="text-muted-foreground hover:text-primary aspect-square"
          >
            <MoreHorizontalIcon size={16} className="shrink-0" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem className="flex gap-2 text-muted-foreground hover:text-primary">
            <EditIcon size={16} />
            <span>Edit</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className={cn("flex gap-2 text-red-600 cursor-pointer")}
            onClick={() => setOpenDeleteAlert(!openDeleteAlert)}
          >
            <Trash2Icon size={16} />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={openDeleteAlert} onOpenChange={setOpenDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(formId)}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
