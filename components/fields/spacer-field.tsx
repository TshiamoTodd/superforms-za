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
import { LuHeading1, LuSeparatorHorizontal } from "react-icons/lu";
import { Slider } from "../ui/slider";

const type: ElementsType = "SpacerField";

const extraAttributes = {
    height: 20, // px
};

const propertiesSchema = z.object({
    height: z.number().min(5).max(200),
});

export const SpacerFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id,
        type,
        extraAttributes, 
    }),
    designerBtnElelment: {
        icon: LuSeparatorHorizontal,
        label: "Spacer field",
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
    const {height,} = element.extraAttributes;
    return (
        <div className="flex flex-col gap-2 w-full items-center">
            <Label className="text-muted-foreground">
                Spacer field {height}px
            </Label>
            <LuSeparatorHorizontal classNname="h-8 w-8"/>
        </div>
    );
}

function FormComponent ({
    elementInstance,
}: {
    elementInstance: FormElementInstance,
}) {
    const element = elementInstance as CustomeInstance;

    const {height} = element.extraAttributes;

    return (
        <div style={{height, width: '100%'}}>
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
    const {height} = element.extraAttributes;

    const form = useForm<PropertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: "onBlur",
        defaultValues: {
            height,
        }
    });

    useEffect(() => {
        form.reset(element.extraAttributes);
    }, [element, form]);

    const applyChanges = (values: PropertiesFormSchemaType) => {
        const {height} = values;

        updateElement(element.id, {
            ...element,
            extraAttributes: {
                height,
            },
        });
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
                    name="height"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Height (px): {form.watch("height")}</FormLabel>
                            <FormControl>
                                <Slider
                                    className="pt-2"
                                    defaultValue={[field.value]}
                                    min={5}
                                    max={200}
                                    step={1}
                                    onValueChange={(value) => field.onChange(value[0])}
                                />

                            </FormControl>
                            <FormDescription>
                                Create a spacer field.
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

            </form>
        </Form>
    );
}