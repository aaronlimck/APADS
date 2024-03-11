import { XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { FormElements } from "./form-elements";
import useDesigner from "./hooks/useDesigner";
import { Separator } from "../ui/separator";

export default function PropertiesFormSidebar() {
  const { selectedElement, setSelectedElement } = useDesigner();
  if (!selectedElement) return null;
  const PropertiesForm =
    FormElements[selectedElement?.type].propertiesComponent;

  return (
    <div className="h-[calc(100dvh-88px)] flex flex-col overflow-y-auto p-2 ">
      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground/70">Element Properties</p>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            setSelectedElement(null);
          }}
        >
          <XIcon size={16} />
        </Button>
      </div>
      <Separator className="mb-4" />
      <PropertiesForm elementInstance={selectedElement} />
    </div>
  );
}
