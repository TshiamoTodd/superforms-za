import { GetFormById } from '@/actions/form';
import FormBuilder from '@/components/form-builder';
import React from 'react'

const BuilderPage = async ({
    params
}: {
    params: {
        id: string
    }
}) => {
    const { id } = params;
    const form = await GetFormById(Number(id));

    if (!form) throw new Error('Form not found');
    return (
        <FormBuilder form={form} />
    );
}

export default BuilderPage