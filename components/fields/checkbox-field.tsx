"use client";

import { IoMdCheckbox } from "react-icons/io";
import { ElementsType, FormElement, FormElementInstance, SubmitFunction } from "../form-elements";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
    Form,
    FormControl,
    FormDescription,
    FormLabel,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import useDesigner from "../hooks/use-designer";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";

const type: ElementsType = "CheckboxField";

const extraAttributes = {
    label: "Checkbox field",
    helperText: "Helper text",
    required: false,
};

const propertiesSchema = z.object({
    label: z.string().min(2).max(50),
    helperText: z.string().max(200),
    required: z.boolean().default(false),

});

export const CheckboxFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id,
        type,
        extraAttributes, 
    }),
    designerBtnElelment: {
        icon: IoMdCheckbox,
        label: "Checkbox field",
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,
    validate: (formElement: FormElementInstance, currentValue: string): boolean => {
        const element = formElement as CustomeInstance;

        if(element.extraAttributes.required) 
            return currentValue === "true";

        return true;
    }
};

type CustomeInstance = FormElementInstance & {
    extraAttributes: typeof extraAttributes;
}

function DesignerComponent ({
    elementInstance
}: {
    elementInstance: FormElementInstance
}) {
    const element = elementInstance as CustomeInstance;
    const {label, required, helperText} = element.extraAttributes;
    const id = `checkbox-${element.id}`;

    return (
        <div className="flex items-top space-x-2">
            <Checkbox id={id}/>
            <div className="grid gap-1.5 leading-none">
                <Label htmlFor={id}>
                    {label}
                    {required && <span className="text-primary">*</span>}
                </Label>
                
                {helperText && 
                    <p className="text-[0.8rem] text-muted-foreground">
                        {helperText}
                    </p>
                }
            </div>
        </div>
    );
}

function FormComponent ({
    elementInstance,
    submitValue,
    isInvalid,
    defaultValue,
}: {
    elementInstance: FormElementInstance,
    submitValue?: SubmitFunction;
    isInvalid?: boolean;
    defaultValue?: string;
}) {
    const element = elementInstance as CustomeInstance;


    const [value, setValue] = useState<boolean>(
        defaultValue === "true" ? true : false
    );

    const [error, setError] = useState(false);

    useEffect(() => {
        setError(isInvalid === true);
    }, [isInvalid]);

    const {label, required, placeholder, helperText} = element.extraAttributes;
    const id = `checkbox-${element.id}`;

    return (
        <div className="flex items-top space-x-2">
            <Checkbox 
                id={id} 
                checked={value} 
                className={cn(error && "border-red-500")}
                onCheckedChange={(checked) => {
                    let value = false;

                    if(checked === true) value = true;

                    setValue(value);

                    if(!submitValue) return;

                    const stringValue = value ? "true": "false"

                    const isValid = CheckboxFieldFormElement.validate(
                        element, 
                        stringValue
                    );

                    setError(!isInvalid);
                    submitValue(element.id, stringValue);
                }}
            />
            <div className="grid gap-1.5 leading-none">
                <Label 
                    htmlFor={id} 
                    className={cn(
                        error && "text-red-500"
                    )}
                >
                    {label}
                    {required && <span className="text-primary">*</span>}
                </Label>
                
                {helperText && 
                    <p className={cn(
                        "text-[0.8rem] text-muted-foreground",
                        error && "text-red-500"
                    )}>
                        {helperText}
                    </p>
                }
            </div>
        </div>
    );
}

type PropertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent ({
    elementInstance
}: {
    elementInstance: FormElementInstance
}) {
    const {updateElement} = useDesigner();
    const element = elementInstance as CustomeInstance;
    const {label, required, helperText} = element.extraAttributes;

    const form = useForm<PropertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: "onBlur",
        defaultValues: {
            label,
            required,
            helperText,
        }
    });

    useEffect(() => {
        form.reset(element.extraAttributes);
    }, [element, form]);

    const applyChanges = (values: PropertiesFormSchemaType) => {
        const {label, required, helperText} = values;
        updateElement(element.id, {
            ...element,
            extraAttributes: {
                label,
                required,
                helperText,
            },
        })
    }

    return (
        <Form {...form}>
            <form 
                onBlur={form.handleSubmit(applyChanges)}
                onSubmit={(e) => {
                    e.preventDefault();
                }}
                className="space-y-3"
            >
                <FormField
                    control={form.control}
                    name="label"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Label</FormLabel>
                            <FormControl>
                                <Input 
                                    {...field}
                                    onKeyDown={(e) => {
                                        if(e.key === "Enter") e.currentTarget.blur();
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                The label of the field. <br/> It will be displayed above the field.
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="helperText"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Helper text</FormLabel>
                            <FormControl>
                                <Input 
                                    {...field}
                                    onKeyDown={(e) => {
                                        if(e.key === "Enter") e.currentTarget.blur();
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                The Helper text of the field. <br/> 
                                It will be displayed below the field.
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="required"
                    render={({field}) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>Required</FormLabel>
                                <FormDescription>
                                    Make this field required.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

            </form>
        </Form>
    );
}