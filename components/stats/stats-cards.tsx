import { GetFormStats } from "@/actions/form";

import {LuView} from "react-icons/lu";
import {FaWpforms} from "react-icons/fa";
import {HiCursorClick} from "react-icons/hi";
import {TbArrowBounce} from "react-icons/tb";

import React from "react";
import { StatsCard } from "./stats-card";

interface StatsCardProps {
    data?: Awaited<ReturnType<typeof GetFormStats>>;
    loading: boolean;
}

const StatsCards:React.FC<StatsCardProps> = ({
    data,
    loading,
}) => {
    
    return (
        <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
                title="Total visits"
                icon={<LuView className="w-6 h-6 text-blue-500" />}
                helperText="All time form visits"
                value={data?.visits.toLocaleString() || ""}
                loading={loading}
                className="shadow-md shadow-blue-600"
            />

            <StatsCard
                title="Total submissions"
                icon={<FaWpforms className="w-6 h-6 text-yellow-500" />}
                helperText="All time form submissions"
                value={data?.submissions.toLocaleString() || ""}
                loading={loading}
                className="shadow-md shadow-yellow-600"
            />

            <StatsCard
                title="Submission rate"
                icon={<HiCursorClick className="w-6 h-6 text-green-500" />}
                helperText="Visits that result in form submissions"
                value={data?.submissionRate.toLocaleString() + "%" || ""}
                loading={loading}
                className="shadow-md shadow-green-600"
            />

            <StatsCard
                title="Bounce rate"
                icon={<TbArrowBounce className="w-6 h-6 text-red-500" />}
                helperText="Visits that leave without interacting"
                value={data?.bounceRate.toLocaleString() + "%" || ""}
                loading={loading}
                className="shadow-md shadow-red-600"
            />
        </div>
    )
}

export default StatsCards;