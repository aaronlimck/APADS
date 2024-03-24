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
          className="flex gap-2 text-muted-foreground"
        >
          <EyeIcon size={16} />
          <span>Preview</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="flex h-dvh w-screen max-w-full flex-grow flex-col gap-0 p-0">
        <div className="border-b p-4">
          <p className="text-muted-foreground">Form Preview</p>
        </div>
        <div className="flex flex-grow flex-col items-center justify-center overflow-y-auto bg-accent p-4 pt-[76px]">
          <div className="flex min-h-screen w-full max-w-3xl flex-grow flex-col gap-4 space-y-4 overflow-y-auto bg-white px-4 py-8">
            {elements.map((element) => {
              const FormComponent = FormElements[element.type].formComponent;
              return (
                <>
                  <FormComponent key={element.id} elementInstance={element} />
                </>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
