"use client";
import { updateUserById } from "@/actions/user.action";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { convertDateString, convertToSGTimeString } from "@/lib/utils";
import { ArchiveIcon, DotIcon, MailIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ContactDetails from "./contactDetails";
import EmploymentDetail from "./employmentDetails";
import PersonalInformation from "./personalInformation";
import Remuneration from "./remuneration";
import ReportingManger from "./reportingManger";

export default function StaffInfoSheet({
  className,
  children,
  data,
}: {
  className?: string;
  children: React.ReactNode;
  data: any;
}) {
  const router = useRouter();
  const handleUnarchiveItem = async (id: string) => {
    try {
      const response = await updateUserById(id, { isArchived: false });
      if (response.status === 200) {
        toast.success("User unarchived successfully");
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleArchiveItem = async (id: string) => {
    try {
      const response = await updateUserById(id, { isArchived: true });
      if (response.status === 200) {
        toast.success("User archived successfully");
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Sheet>
      <SheetTrigger className={className}>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-none md:max-w-[720px]">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-2xl font-medium tracking-tight">
                <span>{data.name}</span>
                {data.isArchived ? (
                  <span className="h-fit rounded bg-red-100 px-2.5 py-0.5 text-xs font-normal text-red-800">
                    Inactive
                  </span>
                ) : (
                  <span className="h-fit rounded bg-green-100 px-2.5 py-0.5 text-xs font-normal text-green-800">
                    Active
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-0.5 text-sm text-muted-foreground">
                <span>{data.jobTitle || "N.A"}</span>
                <DotIcon size={16} />
                <span>
                  Joined On{" "}
                  {convertDateString(convertToSGTimeString(data.createdAt))}
                </span>
              </div>
            </div>

            <div id="actions" className="flex justify-between">
              <Button
                size="sm"
                className="h-8 space-x-2 font-normal text-muted-foreground"
                variant="outline"
                onClick={() => window.open(`mailto:${data.email}`)}
              >
                <MailIcon size={16} />
                <span>Email</span>
              </Button>

              {data.isArchived ? (
                <Button
                  size="sm"
                  className="h-8 space-x-2 font-normal text-muted-foreground"
                  variant="outline"
                  onClick={() => handleUnarchiveItem(data.id)}
                >
                  <ArchiveIcon size={16} />
                  <span>Unarchive</span>
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="h-8 space-x-2 font-normal text-muted-foreground"
                  variant="outline"
                  onClick={() => handleArchiveItem(data.id)}
                >
                  <ArchiveIcon size={16} />
                  <span>Archive</span>
                </Button>
              )}
            </div>
          </div>

          <Tabs defaultValue="staff-details" className="w-full space-y-4">
            <TabsList>
              <TabsTrigger
                value="staff-details"
                className="text-sm font-normal"
              >
                Staff Details
              </TabsTrigger>
              <TabsTrigger
                value="employement-details"
                className="text-sm font-normal"
              >
                Employment Details
              </TabsTrigger>
              <TabsTrigger
                value="appraisal-history"
                className="text-sm font-normal"
              >
                Appraisal History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="staff-details" className="space-y-4">
              <PersonalInformation data={data} />
              <ContactDetails data={data} />
            </TabsContent>

            <TabsContent value="employement-details" className="space-y-4">
              <EmploymentDetail data={data} />
              <Remuneration data={data} />
              <ReportingManger data={data} />
            </TabsContent>

            <TabsContent value="appraisal-history">
              <div className="flex h-8 items-center rounded-md bg-accent px-4 text-sm text-muted-foreground">
                <div className="w-1/2">Name</div>
                <div>Assigned On</div>
              </div>

              {data.appraisals !== null && data.appraisals.length > 0 ? (
                data.appraisals.map((appraisal: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className="flex items-center border-b px-4 py-2 text-sm"
                    >
                      <span className="w-1/2">{appraisal.name}</span>
                      <span>{appraisal.createdAt.toISOString()}</span>
                    </div>
                  );
                })
              ) : (
                <div className="border-b p-4 text-center text-sm">
                  No appraisals assigned
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
