"use client";

import { MdTextFields } from "react-icons/md";
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

const type: ElementsType = "TextField";

const extraAttributes = {
    label: "Text field",
    helperText: "Helper text",
    required: false,
    placeholder: "Value here...",
};

const propertiesSchema = z.object({
    label: z.string().min(2).max(50),
    helperText: z.string().max(200),
    required: z.boolean().default(false),
    placeholder: z.string().max(50),

});

export const TextFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id,
        type,
        extraAttributes, 
    }),
    designerBtnElelment: {
        icon: MdTextFields,
        label: "Text field",
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,
    validate: (formElement: FormElementInstance, currentValue: string): boolean => {
        const element = formElement as CustomeInstance;

        if(element.extraAttributes.required) return currentValue.length > 0;

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
    const {label, required, placeholder, helperText} = element.extraAttributes;
    return (
        <div className="flex flex-col gap-2 w-full">
            <Label>
                {label}
                {required && <span className="text-primary">*</span>}
            </Label>
            <Input 
                readOnly 
                disabled={true} 
                placeholder={placeholder} 
            />
            {helperText && 
                <p className="text-[0.8rem] text-muted-foreground">
                    {helperText}
                </p>
            }
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


    const [value, setValue] = useState(defaultValue || "");
    const [error, setError] = useState(false);

    useEffect(() => {
        setError(isInvalid === true);
    }, [isInvalid]);

    const {label, required, placeholder, helperText} = element.extraAttributes;
    return (
        <div className="flex flex-col gap-2 w-full">
            <Label className={cn(
                error && "text-red-500",
            )}>
                {label}
                {required && <span className="text-primary">*</span>}
            </Label>
            <Input
                value={value} 
                className={cn(
                    error && "border-red-500",
                )}
                placeholder={placeholder}
                onChange={(e) => {
                    setValue(e.target.value);
                }} 
                onBlur={(e) => {
                    if(!submitValue) return;

                    const valid = TextFieldFormElement.validate(element, e.target.value);
                    setError(!valid);

                    if(!valid) return;

                    submitValue(element.id, e.target.value);
                
                }}
            />
            {helperText && 
                <p className={cn(
                    "text-[0.8rem] text-muted-foreground",
                    error && "text-red-500"
                )}>
                    {helperText}
                </p>
            }
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
    const {label, required, placeholder, helperText} = element.extraAttributes;

    const form = useForm<PropertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: "onBlur",
        defaultValues: {
            label,
            required,
            placeholder,
            helperText,
        }
    });

    useEffect(() => {
        form.reset(element.extraAttributes);
    }, [element, form]);

    const applyChanges = (values: PropertiesFormSchemaType) => {
        const {label, required, placeholder, helperText} = values;
        updateElement(element.id, {
            ...element,
            extraAttributes: {
                label,
                required,
                placeholder,
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
                    name="placeholder"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Placeholder</FormLabel>
                            <FormControl>
                                <Input 
                                    {...field}
                                    onKeyDown={(e) => {
                                        if(e.key === "Enter") e.currentTarget.blur();
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                The Placeholder of the field.
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