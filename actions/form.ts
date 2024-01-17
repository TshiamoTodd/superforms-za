"use server";

import { currentUser } from "@clerk/nextjs";
import prisma  from "../lib/prisma";
import { formSchema, formSchemaType } from "@/schemas/form";

class UserNotFoundError extends Error {
}

export const GetFormStats = async() => {
    const user = await currentUser();

    if(!user) throw new UserNotFoundError();

    const stats = await prisma.form.aggregate({
        where: {
            userId: user.id,
        },
        _sum: {
            visits: true,
            submissions: true,
        }
    });

    const visits = stats._sum.visits || 0;
    const submissions = stats._sum.submissions || 0;

    const submissionRate = visits > 0 ? (submissions / visits) * 100 : 0;

    const bounceRate = 100 - submissionRate;

    return {
        visits,
        submissions,
        submissionRate,
        bounceRate,
    };
}

export const CreateForm = async(data: formSchemaType) => {
    const validation = formSchema.safeParse(data);

    if(!validation.success) throw new Error("Invalid form data");
    
    const user = await currentUser();

    if(!user) throw new UserNotFoundError();

    const { name, description } = validation.data;

    const form = await prisma.form.create({
        data: {
            userId: user.id,
            name: name,
            description: description,
        }
    });

    if(!form) throw new Error("Failed to create form");

    return form.id;
}

export const GetForms = async() => {
    const user = await currentUser();

    if(!user) throw new UserNotFoundError();

    return await prisma.form.findMany({
        where: {
            userId: user.id,
        },
        orderBy: {
            createdAt: "desc",
        }
    });
}

export const GetFormById = async (id: number) => {
    const user = await currentUser();

    if(!user) throw new UserNotFoundError();

    return await prisma.form.findUnique({
        where: {
            userId: user.id,
            id: id,
        }
    });
}

export const UpdateFormContent = async (id: number, jsonContent: string) => {
    const user = await currentUser();

    if(!user) throw new UserNotFoundError();

    return await prisma.form.update({
        where: {
            userId: user.id,
            id,
        },
        data: {
            content: jsonContent,
        }
    });
}

export const PublishForm = async (id: number) => {
    const user = await currentUser();

    if(!user) throw new UserNotFoundError();

    return await prisma.form.update({
        where: {
            userId: user.id,
            id,
        },
        data: {
            published: true,
        }
    });
}

export const GetFormContentByUrl = async (formUrl:string) => {
    return await prisma.form.update({
        select: {
            content: true
        },
        data: {
            visits: {
                increment: 1,
            }
        },
        where: {
            shareURL: formUrl,
        }
    });
}

export const SubmitForm = async (formUrl: string, content: any) => {
    return await prisma.form.update({
        data: {
            submissions: {
                increment: 1,
            },
            formSubmissions : {
                create: {
                    content: content,
                }
            }
        },
        where: {
            shareURL: formUrl,
            published: true,
        }
    });
}

export const GetFormWithSubmissions = async (id: number) => {
    const user = await currentUser();

    if(!user) throw new UserNotFoundError();

    return await prisma.form.findUnique({
        where: {
            userId: user.id,
            id,
        },
        include: {
            formSubmissions: true,
        }
    });
}
