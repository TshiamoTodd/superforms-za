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
import { LuHeading1 } from "react-icons/lu";
import { BsTextParagraph } from "react-icons/bs";
import { Textarea } from "../ui/textarea";

const type: ElementsType = "ParagraphField";

const extraAttributes = {
    text: "Text here",
};

const propertiesSchema = z.object({
    text: z.string().min(2).max(500),
});

export const ParagraphFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id,
        type,
        extraAttributes, 
    }),
    designerBtnElelment: {
        icon: BsTextParagraph,
        label: "Paragraph field",
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,

    validate: () => true,
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
    const {text} = element.extraAttributes;
    return (
        <div className="flex flex-col gap-2 w-full">
            <Label className="text-muted-foreground">
                Paragraph field
            </Label>
            <p>{text}</p>
        </div>
    );
}

function FormComponent ({
    elementInstance,
}: {
    elementInstance: FormElementInstance,
}) {
    const element = elementInstance as CustomeInstance;

    const {text} = element.extraAttributes;

    return (
        <p>
            {text}
        </p>
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
    const {text} = element.extraAttributes;

    const form = useForm<PropertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: "onBlur",
        defaultValues: {
            text,
        }
    });

    useEffect(() => {
        form.reset(element.extraAttributes);
    }, [element, form]);

    const applyChanges = (values: PropertiesFormSchemaType) => {
        const {text} = values;
        updateElement(element.id, {
            ...element,
            extraAttributes: {
                text,
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
                    name="text"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Text</FormLabel>
                            <FormControl>
                                <Textarea
                                    rows={5} 
                                    {...field}
                                    onKeyDown={(e) => {
                                        if(e.key === "Enter") e.currentTarget.blur();
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                Create a paragraph field.
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

            </form>
        </Form>
    );
}