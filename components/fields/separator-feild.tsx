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
import { RiSeparator } from "react-icons/ri";
import { Separator } from "../ui/separator";

const type: ElementsType = "SeparatorField";



export const SeparatorFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id,
        type,
    }),
    designerBtnElelment: {
        icon: RiSeparator,
        label: "Separator field",
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,

    validate: () => true,
};

function DesignerComponent ({
    elementInstance
}: {
    elementInstance: FormElementInstance
}) {

    return (
        <div className="flex flex-col gap-2 w-full">
            <Label className="text-muted-foreground">
                Separator field
            </Label>
            <Separator/>
        </div>
    );
}

function FormComponent ({
    elementInstance,
}: {
    elementInstance: FormElementInstance,
}) {

    return (
        <Separator/>
    );
}

function PropertiesComponent ({
    elementInstance
}: {
    elementInstance: FormElementInstance
}) {
    return (
        <p>No properties for this element</p>
    )
}