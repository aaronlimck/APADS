import FormElementSidebar from "./form-elements-sidebar";
import useDesigner from "./hooks/useDesigner";
import PropertiesFormSidebar from "./properties-form-sidebar";

export default function AppraisalDesignerSidebar() {
  const { selectedElement } = useDesigner();

  return (
    <aside className="w-full max-w-[300px] flex flex-col flex-grow gap-2 border-l-2 border-muted p-4 overflow-y-auto min-h-dvh">
      {!selectedElement ? <FormElementSidebar /> : <PropertiesFormSidebar />}
    </aside>
  );
}
