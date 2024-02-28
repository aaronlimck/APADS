import { FormElement } from "@/components/form-builder/form-elements";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";

export default function SidebarBtnElement({
  formElement,
}: {
  formElement: FormElement;
}) {
  const { icon: Icon, label } = formElement.designerBtnElement;

  const draggable = useDraggable({
    id: `designer-btn-${formElement.type}`,
    data: {
      type: formElement.type,
      isDesignerBtnElement: true,
    },
  });

  return (
    <Button
      ref={draggable.setNodeRef}
      variant="outline"
      className={cn(
        "flex flex-col gap-2 h-[80px] w-[80px] cursor-grab",
        draggable.isDragging && "ring-2 ring-primary"
      )}
      {...draggable.listeners}
      {...draggable.attributes}
    >
      <Icon className="h-6 w-6 text-muted-foreground" />
      <p className="text-xs text-gray-800">{label}</p>
    </Button>
  );
}

export function SidebarBtnElementDragOverlay({
  formElement,
}: {
  formElement: FormElement;
}) {
  const { icon: Icon, label } = formElement.designerBtnElement;

  return (
    <Button
      variant="outline"
      className={cn("flex flex-col gap-2 h-[80px] w-[80px] cursor-grab")}
    >
      <Icon className="h-10 w-10 text-primary" />
      <p className="text-xs">{label}</p>
    </Button>
  );
}
