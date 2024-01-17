"use client";

import { RxDropdownMenu } from "react-icons/rx";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { Separator } from "../ui/separator";
import { toast } from "../ui/use-toast";

const type: ElementsType = "SelectField";

const extraAttributes = {
    label: "Select field",
    helperText: "Helper text",
    required: false,
    placeholder: "Value here...",
    options: []
};

const propertiesSchema = z.object({
    label: z.string().min(2).max(50),
    helperText: z.string().max(200),
    required: z.boolean().default(false),
    placeholder: z.string().max(50),
    options: z.array(z.string()).default([]),

});

export const SelectFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id,
        type,
        extraAttributes, 
    }),
    designerBtnElelment: {
        icon: RxDropdownMenu,
        label: "Select field",
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
            <Select>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeholder}/>
                </SelectTrigger>
            </Select>
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

    const {label, required, placeholder, helperText, options} = element.extraAttributes;

    return (
        <div className="flex flex-col gap-2 w-full">
            <Label className={cn(
                error && "text-red-500",
            )}>
                {label}
                {required && <span className="text-primary">*</span>}
            </Label>
            <Select
                defaultValue={value}
                onValueChange={(value) => {
                    setValue(value);

                    if(!submitValue) return;

                    const isValid = SelectFieldFormElement.validate(element, value);
                    setError(!isValid);

                    submitValue(element.id, value);
                }}
            >
                <SelectTrigger 
                    className={cn("w-full",
                        error && "border-red-500",
                    )}
                >
                    <SelectValue placeholder={placeholder}/>
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option} value={option}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
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
    const {updateElement, setSelectedElement} = useDesigner();
    const element = elementInstance as CustomeInstance;
    const {label, required, placeholder, helperText, options} = element.extraAttributes;

    const form = useForm<PropertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: "onSubmit",
        defaultValues: {
            label,
            required,
            placeholder,
            helperText,
            options,
        }
    });

    useEffect(() => {
        form.reset(element.extraAttributes);
    }, [element, form]);

    const applyChanges = (values: PropertiesFormSchemaType) => {
        const {label, required, placeholder, helperText, options} = values;
        updateElement(element.id, {
            ...element,
            extraAttributes: {
                label,
                required,
                placeholder,
                helperText,
                options,
            },
        });

        toast({
            title: "Success",
            description: "Properties saved successfully",
        });

        setSelectedElement(null);
    }

    return (
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(applyChanges)}
                
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

                <Separator/>

                <FormField
                    control={form.control}
                    name="options"
                    render={({field}) => (
                        <FormItem>
                            <div className="flex justify-between items-center">
                                <FormLabel>Options</FormLabel>
                                <Button 
                                    variant={'outline'}
                                    className="gap-2"
                                    onClick={e => {
                                        e.preventDefault();
                                        form.setValue("options", field.value.concat("New option"));
                                    }}
                                >
                                    <AiOutlinePlus/>
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-col gap-2">
                                {form.watch("options").map((option, index) => (
                                    <div 
                                        key={index}
                                        className="flex items-center justify-between gap-1"
                                    >
                                        <Input
                                            value={option}
                                            placeholder=""
                                            onChange={e => {
                                                field.value[index] = e.target.value;
                                                field.onChange(field.value);
                                            }}
                                        />
                                        <Button 
                                            variant={'ghost'}
                                            onClick={e => {
                                                e.preventDefault();

                                                const newOptions = [...field.value];
                                                newOptions.splice(index, 1);
                                                field.onChange(newOptions);

                                                //Almosgt does the same thing
                                                //form.setValue("options", field.value.filter((_, i) => i !== index));
                                            }}
                                        >
                                            <AiOutlineClose/>
                                        </Button>

                                    </div>
                                ))}
                            </div>
                            
                            <FormDescription>
                                The Helper text of the field. <br/> 
                                It will be displayed below the field.
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <Separator/>

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

                <Separator/>
                <Button
                    className="w-full"
                    type="submit"
                >
                    Save
                </Button>

            </form>
        </Form>
    );
}