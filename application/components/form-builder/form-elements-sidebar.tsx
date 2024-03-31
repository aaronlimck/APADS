import { FormElements } from "./form-elements";
import SidebarBtnElement from "./sidebar-btn-element";

export default function FormElementSidebar() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium  text-muted-foreground mb-2">
          Display Elements
        </p>
        <div className="grid grid-cols-3">
          <SidebarBtnElement formElement={FormElements.TitleField} />
          <SidebarBtnElement formElement={FormElements.SubTitleField} />
          <SidebarBtnElement formElement={FormElements.ParagraphField} />
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">
          Question Elements
        </p>
        <div className="grid grid-cols-3 gap-y-3">
          <SidebarBtnElement formElement={FormElements.TextField} />
          <SidebarBtnElement formElement={FormElements.TextAreaField} />
          <SidebarBtnElement formElement={FormElements.SelectField} />
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">
          Layout Elements
        </p>
        <div className="grid grid-cols-3 ">
          <SidebarBtnElement formElement={FormElements.SeparatorField} />
        </div>
      </div>
    </div>
  );
}
