import React from "react";
import { TextFieldFormElement} from "./fields/textfield";
import { TitleFieldFormElement } from "./fields/titlefield";
import { SubTitleFieldFormElement } from "./fields/subtitlefield";
import { SeparatorFieldFormElement } from "./fields/separatorfield";
import { ParagraphFieldFormElement } from "./fields/paragraphfield";
import { TextAreaFormElement } from "./fields/textareafield";
import { SelectFieldFormElement } from "./fields/selectfield";

export type ElementsType =
  | "TextField"
  | "TitleField"
  | "SubTitleField"
  | "SeparatorField"
  | "ParagraphField"
  | "TextAreaField"
  | "SelectField";

export type SubmitFunction = (key: string, value: string) => void;

export type FormElement = {
  type: ElementsType;

  construct: (id: string) => FormElementInstance;

  designerBtnElement: {
    icon: React.ElementType;
    label: string;
  };

  designerComponent: React.FC<{ elementInstance: FormElementInstance }>;
  formComponent: React.FC<{
    elementInstance: FormElementInstance;
    submitValue?: (key: string, value: string) => void;
    isInvalid?: boolean;
    defaultValue?: string;
  }>;
  propertiesComponent: React.FC<{ elementInstance: FormElementInstance }>;
  validate: (formElement: FormElementInstance, currentValue: string) => boolean;
};

export type FormElementInstance = {
  id: string;
  type: ElementsType;
  extraAttributes?: Record<string, any>;
};

type FormElementsType = {
  [key in ElementsType]: FormElement;
};

export const FormElements: FormElementsType = {
  TextField: TextFieldFormElement,
  TitleField: TitleFieldFormElement,
  SubTitleField: SubTitleFieldFormElement,
  SeparatorField: SeparatorFieldFormElement,
  ParagraphField: ParagraphFieldFormElement,
  TextAreaField: TextAreaFormElement,
  SelectField: SelectFieldFormElement
};
