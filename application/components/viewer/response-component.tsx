"use client";

import React from "react";
import {
  FormElementInstance,
  FormElements,
} from "../form-builder/form-elements";
import Image from "next/image";
import Link from "next/link";
import { StringValidation } from "zod";



export default function ResponseComponent({
  content,
  response,
  appraisalName,
  employeeName,
}: {
  content: FormElementInstance[];
  response: any;
  appraisalName: string;
  employeeName: string;
}) {
  return (
    <main className="flex w-full flex-col ">
      <nav className="top-0 z-50 flex h-14 w-full items-center justify-between border-b bg-white p-4">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image src="/logo.svg" width={28} height={28} alt="logo" />
          </Link>
          <span className="rounded-lg border border-transparent px-2 py-1 font-semibold hover:border hover:border-gray-200">
            <h1>Employee Response</h1>
          </span>
        </div>
      </nav>

      <p>Appraisal Name: {appraisalName}</p>
      <p>Employee Name: {employeeName}</p>

      <div className="flex flex-grow flex-col items-center justify-center overflow-y-auto bg-accent p-4 pt-[35px]">
        <div className="flex min-h-screen w-full max-w-3xl flex-grow flex-col gap-4 space-y-4 rounded-md bg-white px-4 py-8">
          {content.map((element) => {
            const FormElement = FormElements[element.type].formComponent;
            const ResponseElement =
              FormElements[element.type].responseFormComponent;

            console.log(ResponseElement);
            if (element.id in response) {
              return (
                <ResponseElement
                  key={element.id}
                  elementInstance={element}
                  response={response[element.id]}
                />
              );
            } else {
              return <FormElement key={element.id} elementInstance={element} />;
            }
          })}
        </div>
      </div>
    </main>
  );
}
