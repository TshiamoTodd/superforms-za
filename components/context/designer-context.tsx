"use client";

import { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react";
import { FormElementInstance } from "../form-elements";

type DesignerContextType = {
    elements: FormElementInstance[];

    setElements: Dispatch<SetStateAction<FormElementInstance[]>>;
    addElement: (index: number, element: FormElementInstance) => void;
    removeElemet: (id: string) => void;

    selectedElement: FormElementInstance | null;
    setSelectedElement: Dispatch<SetStateAction<FormElementInstance | null>>;

    updateElement: (id: string, element: FormElementInstance) => void;
};

export const DesignerContext = createContext<DesignerContextType | null>(null);

const DesignerContextProvider = ({
    children
}: { 
    children: ReactNode
}) => {
    const [elements, setElements] = useState<FormElementInstance[]>([]);
    const [selectedElement, setSelectedElement] = useState<FormElementInstance | null>(null);

    const addElement = (index: number, element: FormElementInstance) => {
        setElements(prev => {
            const newElements = [...prev];
            newElements.splice(index, 0, element);
            return newElements;
        });
    };

    const removeElemet = (id: string) => {
        setElements(prev => prev.filter((element) => element.id !== id));
    }

    const updateElement = (id: string, element: FormElementInstance) => {
        setElements(prev => {
            const newElements = [...prev];
            const index = newElements.findIndex((element) => element.id === id);
            newElements[index] = element;
            return newElements;
        });
    };

    return (
        <DesignerContext.Provider
            value={{
                elements,
                setElements,
                addElement,
                removeElemet,
                selectedElement,
                setSelectedElement,
                updateElement,
            }}
        >
            {children}
        </DesignerContext.Provider>
    );
}; 

export default DesignerContextProvider;