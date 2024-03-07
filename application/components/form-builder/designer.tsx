"use client";

import { cn, idGenerator } from "@/lib/utils";
import { useDndMonitor, useDraggable, useDroppable } from "@dnd-kit/core";
import AppraisalDesignerSidebar from "./designer-sidebar";
import {
  ElementsType,
  FormElementInstance,
  FormElements,
} from "./form-elements";
import useDesigner from "./hooks/useDesigner";
import { useState } from "react";
import { Button } from "../ui/button";
import { TrashIcon } from "lucide-react";

export default function AppraisalDesigner() {
  const {
    elements,
    addElement,
    selectedElement,
    setSelectedElement,
    removeElement,
  } = useDesigner();

  const droppable = useDroppable({
    id: "designer-droppable",
    data: {
      isDesignerDropArea: true,
    },
  });

  useDndMonitor({
    onDragEnd: (event) => {
      const { active, over } = event;
      if (!active || !over) return;

      const isDesignerBtnElement = active.data?.current?.isDesignerBtnElement;
      const isDroppingOverDesignerDropArea =
        over.data?.current?.isDesignerDropArea;

      const droppingSidebarBtnOverDesginerDropArea =
        isDesignerBtnElement && isDroppingOverDesignerDropArea;
      if (droppingSidebarBtnOverDesginerDropArea) {
        const type = active.data?.current?.type;
        const newElement = FormElements[type as ElementsType].construct(
          idGenerator()
        );
        addElement(elements.length, newElement);
        return;
      }

      const isDroppingOverDesignerElementTopHalf =
        over.data?.current?.isTopHalfDesignerElement;

      const isDroppingOverDesignerElementBottomHalf =
        over.data?.current?.isBottomHalfDesignerElement;

      const isDroppingOverDesignerElement =
        isDroppingOverDesignerElementTopHalf ||
        isDroppingOverDesignerElementBottomHalf;

      const droppingSidebarBtnOverDesignerElement =
        isDesignerBtnElement && isDroppingOverDesignerElement;
      if (droppingSidebarBtnOverDesignerElement) {
        const type = active.data?.current?.type;
        const newElement = FormElements[type as ElementsType].construct(
          idGenerator()
        );

        const overId = over.data?.current?.elementId;

        const overElementIndex = elements.findIndex((el) => el.id === overId);
        if (overElementIndex === -1) {
          throw new Error("Element not found");
        }
        let indexForNewElement = overElementIndex;

        if (isDroppingOverDesignerElementBottomHalf) {
          indexForNewElement = overElementIndex + 1;
        }

        addElement(indexForNewElement, newElement);
        return;
      }

      const isDraggingDesignerElement = active.data?.current?.isDesignerElement;

      const draggingDesignerElementOverAnotherDesignerElement =
        isDroppingOverDesignerElement && isDraggingDesignerElement;

      if (draggingDesignerElementOverAnotherDesignerElement) {
        const activeId = active.data?.current?.elementId;
        const overId = over.data?.current?.elementId;

        const activeElementIndex = elements.findIndex(
          (el) => el.id === activeId
        );
        const overElementIndex = elements.findIndex((el) => el.id === overId);

        if (activeElementIndex === -1 || overElementIndex === -1) {
          throw new Error("Element not found");
        }

        const activeElement = { ...elements[activeElementIndex] };
        removeElement(activeId);

        let indexForNewElement = overElementIndex;
        if (isDroppingOverDesignerElementBottomHalf) {
          indexForNewElement = overElementIndex + 1;
        }
        addElement(indexForNewElement, activeElement);
      }
    },
  });

  return (
    <div className="flex w-full ">
      <div
        id="designer"
        className="w-full p-4"
        onClick={() => {
          if (selectedElement) setSelectedElement(null);
        }}
      >
        <div className="h-[calc(100dvh-88px)] overflow-y-auto rounded-xl border bg-accent p-6 shadow-lg">
          <div
            ref={droppable.setNodeRef}
            className={cn(
              "m-auto flex min-h-full max-w-3xl flex-1 flex-grow flex-col items-center justify-start rounded-lg bg-white",
              droppable.isOver && "ring-2 ring-primary/20",
            )}
          >
            {!droppable.isOver && elements.length === 0 && (
              <p className="flex flex-grow items-center text-base text-muted-foreground">
                Drop Here
              </p>
            )}
            {droppable.isOver && elements.length === 0 && (
              <div className="w-full p-4">
                <div className="h-[120px] rounded-md bg-primary/20"></div>
              </div>
            )}
            {elements.length > 0 && (
              <div className="flex w-full flex-col gap-2 p-4">
                {elements.map((element) => (
                  <DesignerElementWrapper key={element.id} element={element} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <AppraisalDesignerSidebar />
    </div>
  );
}

export function DesignerElementWrapper({
  element,
}: {
  element: FormElementInstance;
}) {
  const { removeElement, selectedElement, setSelectedElement } = useDesigner();
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const topHalf = useDroppable({
    id: element.id + "-top",
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true,
    },
  });

  const bottomHalf = useDroppable({
    id: element.id + "-bottom",
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfDesignerElement: true,
    },
  });

  const draggable = useDraggable({
    id: element.id,
    data: {
      type: element.type,
      elementId: element.id,
      isDesignerElement: true,
    },
  });

  if (draggable.isDragging) return null;

  const DesignerElement = FormElements[element.type].designerComponent;
  return (
    <div
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      className="relative min-h-[120px] flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
      onClick={(event) => {
        event.stopPropagation();
        setSelectedElement(element);
      }}
    >
      <div ref={topHalf.setNodeRef} className="absolute w-full h-1/2"></div>
      <div
        ref={bottomHalf.setNodeRef}
        className="absolute w-full bottom-0 h-1/2"
      ></div>

      {mouseIsOver && (
        <>
          <div className="absolute right-0 h-full">
            <Button
              className="flex justify-center h-full border rounded-md rounded-l-none bg-red-500"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                removeElement(element.id);
              }}
            >
              <TrashIcon size={16} />
            </Button>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
            <p className="text-muted-foreground text-sm">
              Click for properties or drag to move
            </p>
          </div>
        </>
      )}

      {topHalf.isOver && (
        <div className="absolute top-0 w-full rounded-md h-[5px] bg-primary rounded-b-none" />
      )}
      <div
        className={cn(
          "flex w-full min-h-[120px] items-center rounded-md bg-accent/40 px-4 py-4 pointer-events-none opacity-100",
          mouseIsOver && "opacity-30"
        )}
      >
        <DesignerElement elementInstance={element} />
      </div>
      {bottomHalf.isOver && (
        <div className="absolute bottom-0 w-full rounded-md h-[5px] bg-primary rounded-t-none" />
      )}
    </div>
  );
}
