import React from "react";
import SidebarBtnElement from "./SidebarBtnElement";
import { FormElements } from "./TemplateElements";
import { Separator } from "./ui/separator";

function FormElementsSidebar() {
  return (
    <div>
      <p className="text-sm text-foreground/70">Drag and drop elements</p>
      <Separator className="my-2" />
      <div className="mb-4">
        <p className="text-sm text-muted-foreground my-2">Layout elements</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 place-items-center">
          <SidebarBtnElement formElement={FormElements.TitleField} />
          <SidebarBtnElement formElement={FormElements.SubTitleField} />
          <SidebarBtnElement formElement={FormElements.ParagraphField} />
          <SidebarBtnElement formElement={FormElements.SeparatorField} />
          <SidebarBtnElement formElement={FormElements.SpacerField} />
        </div>
      </div>

      <div>
        <p className="text-sm text-muted-foreground my-2">Form elements</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 place-items-center">
          <SidebarBtnElement formElement={FormElements.TextField} />
          <SidebarBtnElement formElement={FormElements.NumberField} />
          <SidebarBtnElement formElement={FormElements.TextAreaField} />
          <SidebarBtnElement formElement={FormElements.DateField} />
          <SidebarBtnElement formElement={FormElements.SelectField} />
          <SidebarBtnElement formElement={FormElements.CheckboxField} />
        </div>
      </div>
    </div>
  );
}

export default FormElementsSidebar;
