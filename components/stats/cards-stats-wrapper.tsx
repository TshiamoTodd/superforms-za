import { GetFormStats } from "@/actions/form";
import StatsCards from "./stats-cards";

const CardsStatsWrapper = async () => {
    const stats = await GetFormStats();

    return (
        <StatsCards data={stats} loading={false}/>
    )
};

export default CardsStatsWrapper;