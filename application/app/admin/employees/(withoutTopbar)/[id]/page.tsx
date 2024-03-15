import { getUserById } from "@/actions/user.action";
import EditEmployeeModal from "@/components/modal/edit-employee-modal";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { convertTextToTitleCase } from "@/lib/utils";

export default async function SpecificEmployeePage({
  params,
}: {
  params: { id: string };
}) {
  const { id: userId } = params;
  const userData = await getUserById(userId);

  return (
    <div className="w-full space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/employees">Staff</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/admin/employees/${userData.data?.id}`}>
              {userData.data?.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className="flex w-full flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
        <div className="flex w-full flex-col items-center gap-4 text-center md:flex-row md:text-left">
          <div className="h-28 w-28 rounded-full bg-accent" />
          <div className="space-y-1">
            <h1 className="text-2xl font-medium md:text-3xl">
              {userData.data?.name}
            </h1>
            <p className="text-muted-foreground">Team Manager</p>
          </div>
        </div>

        <EditEmployeeModal
          staffData={userData.data}
          action={
            <Button
              type="button"
              variant="default"
              className="h-fit w-fit justify-start font-normal"
            >
              Edit Profile
            </Button>
          }
        />
      </section>

      <section className="space-y-4 rounded-lg bg-gray-50 p-4 md:p-6">
        <Card className="space-y-4 p-4">
          <div className="text-lg font-medium">Personal Information</div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div className="space-y-0.5">
              <p className="text-sm text-muted-foreground">Email</p>
              <p>{userData.data?.email}</p>
            </div>

            <div className="space-y-0.5">
              <p className="text-sm text-muted-foreground">Phone</p>
              <p>Unavailable</p>
            </div>
          </div>
        </Card>

        <Card className="space-y-4 p-4">
          <div className="text-lg font-medium">Employment Details</div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div className="space-y-0.5">
              <p className="text-sm text-muted-foreground">Job Title</p>
              <p>Unavailable</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Department</p>
              <p>{convertTextToTitleCase(userData.data?.departmentName!)}</p>
            </div>

            <div className="space-y-0.5">
              <p className="text-sm text-muted-foreground">
                Employement Status
              </p>
              {userData.data?.isArchived && (
                <span className="me-2 rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                  Inactive
                </span>
              )}
              {!userData.data?.isArchived && (
                <span className="me-2 rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  Active
                </span>
              )}
            </div>

            <div className="space-y-0.5">
              <p className="text-sm text-muted-foreground">Reporting Manager</p>
              <p>
                {userData.data?.manager ? userData.data.manager.name : "NA"}
              </p>
            </div>
          </div>
        </Card>
      </section>

      <section className="space-y-4 rounded-lg bg-gray-50 p-4 md:p-6">
        <div className="text-lg font-medium">Appraisals</div>
      </section>
    </div>
  );
}
