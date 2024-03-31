"use client";
import { convertTextToTitleCase } from "@/lib/utils";
import { DotIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  FormElementInstance,
  FormElements,
} from "../form-builder/form-elements";
import { Card, CardHeader } from "../ui/card";
import StaffInfoSheet from "@/app/admin/employees/_components/staffInfoSheet";

export default function ResponseComponent({
  content,
  response,
  employeeData,
}: {
  content: FormElementInstance[];
  response: any;
  employeeData: any;
}) {
  return (
    <main className="flex h-dvh w-full flex-col overflow-hidden">
      <nav className="top-0 z-50 flex h-14 w-full items-center justify-between border-b bg-white p-4">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image src="/logo.svg" width={28} height={28} alt="logo" />
          </Link>
          <span className="rounded-lg border border-transparent px-2 py-1 font-semibold">
            <h1>Employee Response</h1>
          </span>
        </div>
      </nav>

      <div className="flex flex-grow flex-col items-center justify-center space-y-4 bg-accent p-4">
        <Card className="w-full max-w-3xl shadow-none">
          <CardHeader>
            <div className="flex flex-col space-y-1">
              <div className="text-2xl font-medium tracking-tight">
                {employeeData.name}
              </div>
              <div className="flex items-center space-x-0.5 text-sm text-muted-foreground">
                <span>
                  {convertTextToTitleCase(employeeData.departmentName) || "N.A"}
                </span>
                <DotIcon size={16} />
                <StaffInfoSheet
                  data={employeeData}
                  className="hover:underline hover:underline-offset-2"
                >
                  View Profile
                </StaffInfoSheet>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="flex h-[calc(100dvh-210px)] w-full max-w-3xl flex-grow flex-col gap-4 space-y-4 overflow-y-scroll rounded-lg border bg-white px-4 py-8">
          {content.map((element) => {
            // const FormElement = FormElements[element.type].formComponent;
            const ResponseElement =
              FormElements[element.type].responseFormComponent;

            if (element.id in response) {
              return (
                <ResponseElement
                  key={element.id}
                  elementInstance={element}
                  response={response[element.id]}
                />
              );
            }
            //  else {
            //   return <FormElement key={element.id} elementInstance={element} />;
            // }
          })}
        </div>
      </div>
    </main>
  );
}
