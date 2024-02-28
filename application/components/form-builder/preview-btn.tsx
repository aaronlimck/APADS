import { EyeIcon } from "lucide-react";
import { Button } from "../ui/button";
import useDesigner from "./hooks/useDesigner";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { FormElements } from "./form-elements";

export default function PreviewBtn() {
  const { elements } = useDesigner();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex text-muted-foreground gap-2"
        >
          <EyeIcon size={16} />
          <span>Preview</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="w-screen max-w-full h-dvh flex flex-col flex-grow p-0 gap-0">
        <div className="p-4 border-b">
          <p className="text-muted-foreground">Form Preview</p>
        </div>
        <div className="bg-accent flex flex-col flex-grow items-center justify-center p-4 overflow-y-auto pt-[76px]">
          <div className="max-w-3xl w-full bg-white flex flex-col gap-4 px-4 py-8 space-y-4 flex-grow min-h-dvh">
            {elements.map((element) => {
              const FormComponent = FormElements[element.type].formComponent;
              return (
                <FormComponent key={element.id} elementInstance={element} />
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
