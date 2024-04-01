"use client";
import { updateUserById } from "@/actions/user.action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function ContactDetails({ data }: { data: any }) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState<"DEFAULT" | "EDIT">(
    "DEFAULT",
  );
  const [form, setForm] = useState({
    email: data.email,
    mobileNumber: data.mobileNumber,
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

    const payload = { email: form.email, mobileNumber: form.mobileNumber };

    // Call the API to update the user's personal information
    try {
      const response = await updateUserById(data.id, payload);
      if (response.status === 200) {
        toast.success("Contact details updated successfully");
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
            <div className="font-medium">Contact Details</div>
            <div
              className="text-muted-foreground"
              onClick={() => setCurrentStatus("EDIT")}
            >
              Edit
            </div>
          </div>
          <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm leading-6 text-muted-foreground">Email</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {form.email}
            </dd>

            <dt className="text-sm leading-6 text-muted-foreground">
              Mobile Number
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {form.mobileNumber || "N.A"}
            </dd>
          </div>
        </Card>
      )}

      {currentStatus === "EDIT" && (
        <Card>
          <form onSubmit={handleSaveChanges}>
            <div className="flex items-center justify-between border-b p-4 text-sm">
              <div className="font-medium">Contact Details</div>
            </div>

            <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm leading-6 text-muted-foreground">Email</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <Input
                  type="email"
                  name="email"
                  className="focus-visible:border-[1.5px] focus-visible:border-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
              </dd>

              <dt className="text-sm leading-6 text-muted-foreground">
                Mobile Number
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <Input
                  name="mobileNumber"
                  className="focus-visible:border-[1.5px] focus-visible:border-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={form.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="Enter mobile number"
                />
              </dd>
            </div>

            <div className="flex w-full justify-end space-x-2 border-t px-4 py-3">
              <Button
                size="sm"
                variant="secondary"
                className="font-normal text-muted-foreground hover:text-gray-800"
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
