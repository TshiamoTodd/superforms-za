import { GetFormById } from '@/actions/form';
import FormLinkShare from '@/components/form-link-share';
import { StatsCard } from '@/components/stats/stats-card';
import SubmissionsTable from '@/components/submissions-table';
import VisitBtn from '@/components/visits-btn';
import React from 'react';

import { FaWpforms } from 'react-icons/fa';
import { HiCursorClick } from 'react-icons/hi';
import { LuView } from 'react-icons/lu';
import { TbArrowBounce } from 'react-icons/tb';

const FormDetailsPage = async ({
    params
}: {
    params: {
        id: string
    }
}) => {
    const { id } = params;
    const form = await GetFormById(Number(id));

    if (!form) throw new Error('Form not found');

    const {visits, submissions} = form;

    const submissionRate = visits > 0 ? (submissions / visits) * 100 : 0;

    const bounceRate = 100 - submissionRate;

    return (
        <>
            <div className='py-10 border-t border-b border-muted'>
                <div className='flex justify-between container'>
                    <h1 className='text-4xl font-bold truncate'>
                        {form.name}
                    </h1>
                    <VisitBtn
                        shareUrl={form.shareURL}
                    />
                </div>
            </div>

            <div className='py-4 border-b border-muted'>
                <div className='container flex gap-2 items-center justify-between'>
                    <FormLinkShare
                        shareUrl={form.shareURL}
                    />
                </div>
            </div>

            <div className='w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 container'>
                <StatsCard
                    title="Total visits"
                    icon={<LuView className="w-6 h-6 text-blue-500" />}
                    helperText="All time form visits"
                    value={visits.toLocaleString() || ""}
                    loading={false}
                    className="shadow-md shadow-blue-600"
                />

                <StatsCard
                    title="Total submissions"
                    icon={<FaWpforms className="w-6 h-6 text-yellow-500" />}
                    helperText="All time form submissions"
                    value={submissions.toLocaleString() || ""}
                    loading={false}
                    className="shadow-md shadow-yellow-600"
                />

                <StatsCard
                    title="Submission rate"
                    icon={<HiCursorClick className="w-6 h-6 text-green-500" />}
                    helperText="Visits that result in form submissions"
                    value={submissionRate.toLocaleString() + "%" || ""}
                    loading={false}
                    className="shadow-md shadow-green-600"
                />

                <StatsCard
                    title="Bounce rate"
                    icon={<TbArrowBounce className="w-6 h-6 text-red-500" />}
                    helperText="Visits that leave without interacting"
                    value={bounceRate.toLocaleString() + "%" || ""}
                    loading={false}
                    className="shadow-md shadow-red-600"
                />
            </div>

            <div className='container pt-10'>
                <SubmissionsTable id={form.id} />
            </div>
            
        </>
        
    );
}

export default FormDetailsPage