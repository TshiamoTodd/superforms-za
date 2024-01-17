import { DateFieldFormElement } from "./fields/date-field";
import { NumberFieldFormElement } from "./fields/number-field";
import { ParagraphFieldFormElement } from "./fields/paragraph-field";
import { SelectFieldFormElement } from "./fields/select-field";
import { SeparatorFieldFormElement } from "./fields/separator-feild";
import { SpacerFieldFormElement } from "./fields/spacer-field";
import { SubTitleFieldFormElement } from "./fields/sub-titlefield";
import { TextAreaFieldFormElement } from "./fields/textarea-filed";
import { TextFieldFormElement } from "./fields/text-field";
import { TitleFieldFormElement } from "./fields/title-field";
import { CheckboxFieldFormElement } from "./fields/checkbox-field";

export type ElementsType = 
    | "TextField" 
    | "TitleField" 
    | "SubTitleField"
    | "ParagraphField"
    | "SeparatorField"
    | "SpacerField"
    | "NumberField"
    | "TextAreaField"
    | "DateField"
    | "SelectField"
    | "CheckboxField";

export type SubmitFunction = (key: string, value: string) => void;

export type FormElement = {
    type: ElementsType;

    construct: (id: string) => FormElementInstance;

    designerBtnElelment: {
        icon: React.ElementType;
        label: string;
    };

    designerComponent: React.FC<{
        elementInstance: FormElementInstance;
    }>;

    formComponent: React.FC<{
        elementInstance: FormElementInstance;
        submitValue?: (key: string, value: string) => void;
        isInvalid?: boolean;
        defaultValue?: string;
    }>;
    
    propertiesComponent: React.FC<{
        elementInstance: FormElementInstance;
    }>;

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
    ParagraphField: ParagraphFieldFormElement,
    SeparatorField: SeparatorFieldFormElement,
    SpacerField: SpacerFieldFormElement,
    NumberField: NumberFieldFormElement,
    TextAreaField: TextAreaFieldFormElement,
    DateField: DateFieldFormElement,
    SelectField: SelectFieldFormElement,
    CheckboxField: CheckboxFieldFormElement
};