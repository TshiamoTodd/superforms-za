"use client";
import { zodResolver } from '@hookform/resolvers/zod';

import { ImSpinner2 } from "react-icons/im";
import { BsFileEarmarkPlus } from "react-icons/bs";

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel
} from '@/components/ui/form';
import { formSchema, formSchemaType } from '@/schemas/form';
import { useForm } from 'react-hook-form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from './ui/use-toast';
import { CreateForm } from '@/actions/form';
import { useRouter } from 'next/navigation';


const CreateFormDialog = () => {
    const router = useRouter();
    const form = useForm<formSchemaType>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (values: formSchemaType) => {
        try {
            const formId = await CreateForm(values);
            toast({
                title: "Success",
                description: "Form created successfully.",
            });
            router.push(`/builder/${formId}`);
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong. Please try again later.",
                variant: "destructive"
            });
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant={'outline'} 
                    className='group border border-primary/20 h-[190px] items-center justify-center flex flex-col hover:border-primary hover:cursor-pointer border-dashed gap-4'
                >
                    <BsFileEarmarkPlus className='h-8 w-8 text-muted-foreground group-hover:text-primary'/>
                    <p className='font-bold text-xl text-muted-foreground group-hover:text-primary'>
                        Create new form
                    </p>
                </Button>
            </DialogTrigger>
            <DialogContent className='w-[80%]'>
                <DialogHeader>
                    <DialogTitle>Create form</DialogTitle>
                    <DialogDescription>
                        Create a new form to start collecting responses.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField 
                            control={form.control} 
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field}/>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        
                        <FormField 
                            control={form.control} 
                            name="description"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea rows={5} {...field}/>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <DialogFooter>
                    <Button 
                        onClick={form.handleSubmit(onSubmit)}
                        className='w-full mt-4'
                        disabled={form.formState.isSubmitting}
                    >
                        {!form.formState.isSubmitting && <span>Save</span>}
                        {form.formState.isSubmitting && (
                            <ImSpinner2 className="animate-spin"/>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default CreateFormDialog