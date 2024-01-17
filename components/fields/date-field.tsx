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
import { BsFillCalendarDateFill } from "react-icons/bs";
import { Button } from "../ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";

const type: ElementsType = "DateField";

const extraAttributes = {
    label: "Date field",
    helperText: "Pick a date",
    required: false,
};

const propertiesSchema = z.object({
    label: z.string().min(2).max(50),
    helperText: z.string().max(200),
    required: z.boolean().default(false),

});

export const DateFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id,
        type,
        extraAttributes, 
    }),
    designerBtnElelment: {
        icon: BsFillCalendarDateFill,
        label: "Date field",
    },

    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,

    validate: (
        formElement: FormElementInstance, 
        currentValue: string
    ): boolean => {
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
            <Button
                variant={'outline'}
                className="w-full justify-start text-left font-normal"
            >
                <CalendarIcon className="w-4 h-4 mr-2"/>
                <span>Pick a date</span>
            </Button>
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


    const [date , setDate] = useState<Date | undefined>(defaultValue ? new Date(defaultValue) : undefined);
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
            <Popover>
                <PopoverTrigger>
                    <Button
                        variant={'outline'}
                        className={cn("w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground",
                            error && "border-red-500"
                        )}
                    >
                        <CalendarIcon className="w-4 h-4 mr-2"/>
                        {date ? format(date, "PPP"): <span>Pick a date</span>}
                        
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => {
                            setDate(date);
                            if(!submitValue) return;

                            const value = date?.toUTCString() || "";
                            const valid = DateFieldFormElement.validate(element, value);
                            setError(!valid);
                            submitValue(element.id, value);

                            //submitValue && submitValue(element.id, date ? date.toISOString() : "");
                        }}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
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