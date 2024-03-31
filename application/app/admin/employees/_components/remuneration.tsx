"use client";
import { updateUserById } from "@/actions/user.action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function Remuneration({ data }: { data: any }) {
  const router = useRouter();
  const [hide, setHide] = useState<Boolean>(true);
  const [currentStatus, setCurrentStatus] = useState<"DEFAULT" | "EDIT">(
    "DEFAULT",
  );

  const [form, setForm] = useState({
    monthlySalary: data.monthlySalary,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSaveChanges = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents the default form submission behavior

    const payload = { monthlySalary: parseFloat(form.monthlySalary) };

    // Call the API to update the user's personal information
    try {
      const response = await updateUserById(data.id, payload);
      if (response.status === 200) {
        toast.success("Remuneration updated successfully");
        setCurrentStatus("DEFAULT");
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {currentStatus === "DEFAULT" && (
        <Card>
          <div className="flex items-center justify-between border-b p-4 text-sm">
            <div className="font-medium">Remuneration</div>
            <div
              className="text-muted-foreground"
              onClick={() => setCurrentStatus("EDIT")}
            >
              Edit
            </div>
          </div>

          <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm leading-6 text-muted-foreground">
              Monthly Salary
            </dt>

            <dd className="mt-1 flex space-x-2 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {hide ? (
                <span>********</span>
              ) : (
                <span>{`$${data.monthlySalary}` || "N.A"}</span>
              )}
              <span
                onClick={() => setHide(!hide)}
                className="cursor-pointer text-muted-foreground"
              >
                {hide ? "Show" : "Hide"}
              </span>
            </dd>
          </div>
        </Card>
      )}

      {currentStatus === "EDIT" && (
        <Card>
          <form onSubmit={handleSaveChanges}>
            <div className="flex items-center justify-between border-b p-4 text-sm">
              <div className="font-medium">Remuneration</div>
            </div>

            <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm leading-6 text-muted-foreground">
                Monthly Salary
              </dt>

              <dd className="mt-1 flex space-x-2 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <Input
                  type="number"
                  name="monthlySalary"
                  className="focus-visible:border-[1.5px] focus-visible:border-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={form.monthlySalary}
                  onChange={handleInputChange}
                />
              </dd>
            </div>

            <div className="flex w-full justify-end space-x-2 border-t px-4 py-3">
              <Button
                size="sm"
                variant="secondary"
                className="font-normal"
                onClick={() => setCurrentStatus("DEFAULT")}
              >
                Cancel
              </Button>

              <Button size="sm" className="font-normal">
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      )}
    </>
  );
}
