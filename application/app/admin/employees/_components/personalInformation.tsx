"use client";
import { updateUserById } from "@/actions/user.action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { convertTextToTitleCase } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function PersonalInformation({ data }: { data: any }) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState<"DEFAULT" | "EDIT">(
    "DEFAULT",
  );
  const [form, setForm] = useState({
    name: data.name,
    gender: data.gender,
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

    const payload = { name: form.name, gender: form.gender };
    // Call the API to update the user's personal information
    try {
      const response = await updateUserById(data.id, payload);
      if (response.status === 200) {
        toast.success("Personal information updated successfully");
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
            <div className="font-medium">Personal Information</div>
            <div
              className="text-muted-foreground"
              onClick={() => setCurrentStatus("EDIT")}
            >
              Edit
            </div>
          </div>

          <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm leading-6 text-muted-foreground">
              Full name
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {data.name}
            </dd>

            <dt className="text-sm leading-6 text-muted-foreground">Gender</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {data.gender ? convertTextToTitleCase(data.gender) : "N/A"}
            </dd>
          </div>
        </Card>
      )}

      {currentStatus === "EDIT" && (
        <Card>
          <form onSubmit={handleSaveChanges}>
            <div className="flex items-center justify-between border-b p-4 text-sm">
              <div className="font-medium">Personal Information</div>
            </div>

            <div className="grid p-4 sm:grid-cols-3 sm:gap-6">
              <dt className="text-sm leading-6 text-muted-foreground">
                Full name
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <Input
                  name="name"
                  className="focus-visible:border-[1.5px] focus-visible:border-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                />
              </dd>

              <dt className="text-sm leading-6 text-muted-foreground">
                Gender
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <RadioGroup
                  name="gender"
                  defaultValue={data.gender}
                  onChange={handleInputChange}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="MALE" id="r1" />
                    <Label htmlFor="r1">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="FEMALE" id="r2" />
                    <Label htmlFor="r2">Female</Label>
                  </div>
                </RadioGroup>
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
