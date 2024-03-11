"use client";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { AppraisalForm } from "@prisma/client";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ApprisalFormTitleRenameForm from "../form/appraisal-form-title-rename-form";
import AppraisalDesigner from "./designer";
import DragOverlayWrapper from "./drag-overlay-wrapper";
import useDesigner from "./hooks/useDesigner";
import PreviewBtn from "./preview-btn";
import PublishBtn from "./publish-btn";
import SaveBtn from "./save-btn";
import SaveTemplateBtn from "./save-template-btn";

export default function FormBuilder({
  form,
  isTemplate,
}: {
  form: AppraisalForm;
  isTemplate?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { setElements } = useDesigner();
  const [isReady, setIsReady] = useState(false);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensors = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300,
      tolerance: 5,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensors);

  useEffect(() => {
    if (isReady) return;
    const elements = JSON.parse(form.content);
    setElements(elements);
    const readTimeout = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(readTimeout);
  }, [form, setElements]);

  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-dvh">
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <Loader2Icon
            size={20}
            className="text-muted-foreground animate-spin"
          />
          <span className="animate-pulse">Getting your workspace ready...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col w-full h-dvh overflow-hidden">
      <nav className="sticky top-0 h-14 w-full flex items-center justify-between p-4 bg-white border-b z-50">
        <div className="flex gap-3 items-center">
          <Link href="/">
            <Image src="/logo.svg" width={28} height={28} alt="logo" />
          </Link>
          <span
            className="font-semibold border border-transparent hover:border hover:border-gray-200 px-2 py-1 rounded-lg"
            onClick={() => setOpen(true)}
          >
            {form.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <PreviewBtn />
          {!form.isPublished &&
            (isTemplate === false || isTemplate === undefined) && (
              <>
                <SaveBtn id={form.id} />
                <PublishBtn id={form.id} />
              </>
            )}
          {isTemplate === true && <SaveTemplateBtn id={form.id} />}
        </div>
      </nav>

      <DndContext sensors={sensors}>
        <AppraisalDesigner />
        <DragOverlayWrapper />
      </DndContext>

      <ApprisalFormTitleRenameForm
        open={open}
        setOpen={setOpen}
        formId={form.id}
        formName={form.name}
      />
    </main>
  );
}
