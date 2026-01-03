import { useQuery } from "@tanstack/react-query";
import { getEmployerStatsApi } from "../api/jobApi";
import { profileApi } from "../api/authApi";

export const useEmployerStats = () => {
  return useQuery({
    queryKey: ["employerStats"],
    queryFn: getEmployerStatsApi,
  });
};

export const useEmployerProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: profileApi,
  });
};

export const useEmployerDashboardData = () => {
  const profileQuery = useEmployerProfile();
  const statsQuery = useEmployerStats();

  const user = profileQuery.data || {
    fullname: "Employer",
    role: "employer",
  };

  const stats = statsQuery.data?.stats || {
    activeJobs: 0,
    totalApplications: 0,
    newApplications: 0,
    viewsThisWeek: 0,
  };

  const recentJobs = statsQuery.data?.recentJobs || [];

  return {
    user,
    stats,
    recentJobs,
    isLoading: profileQuery.isLoading || statsQuery.isLoading,
    isError: profileQuery.isError || statsQuery.isError,
    refetch: () => {
      profileQuery.refetch();
      statsQuery.refetch();
    },
  };
};
