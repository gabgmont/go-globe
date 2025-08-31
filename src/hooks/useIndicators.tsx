import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export interface Indicators {
    activeMissionaries: number;
    countriesAchieved: number,
    projectsCreated: number,
    amountFunded: number
}

export const useIndicators = () => {
    const [indicators, setIndicators] = useState<Indicators>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchIndicators = async () => {
        const { count: countMissionaries, error: countMissionariesError } = await supabase
            .from('missionary_applications')
            .select("*", { count: "exact", head: true });

        try {
            setLoading(true);
            setError(null);
            
            if (countMissionariesError) {
                throw countMissionariesError
            }

            const { data: countries, error: countriesError } = await supabase
                .from('missions')
                .select('location');

            if (countriesError) {
                throw countriesError
            }

            const countCountries = new Set(countries.map((c) => c.location)).size

            const { count: countProjects, error: countProjectsError } = await supabase
                .from('mission_projects')
                .select("*", { count: "exact", head: true });

            if (countProjectsError) {
                throw countProjectsError
            }

            const { data: missionarySupports, error: supportsError } = await supabase
                .from('missionary_supports')
                .select(`amount`);

            if (supportsError) {
                throw supportsError
            }

            const { data: projectDonations, error: donationsError } = await supabase
                .from('project_contributions')
                .select(`amount`);

            if (donationsError) {
                throw donationsError
            }

            const totalDonations = missionarySupports.map((ms) => ms.amount).reduce((ms) => ms) + projectDonations.map((pd) => pd.amount).reduce((pd) => pd)

            setIndicators({
                activeMissionaries: countMissionaries,
                countriesAchieved: countCountries,
                projectsCreated: countProjects,
                amountFunded: totalDonations
            })
        } catch (ex) {
            setError(ex)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchIndicators();
    }, []);

    return {
        indicators,
        loading,
        error,
        refetch: fetchIndicators
    };
}