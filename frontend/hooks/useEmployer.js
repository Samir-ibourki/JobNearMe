import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEmployerStatsApi,
  getEmployerJobs,
  deleteJob,
  createJob,
  updateJob,
  getJobById,
} from "../api/jobApi";
import { profileApi } from "../api/authApi";
import { getJobApplications } from "../api/applicationApi";

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

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["myJobs"] });
      queryClient.invalidateQueries({ queryKey: ["employerStats"] });
    },
  });
};
export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateJob(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myJobs"] });
      queryClient.invalidateQueries({ queryKey: ["employerStats"] });
    },
  });
};
export const useMyJobs = () => {
  return useQuery({
    queryKey: ["myJobs"],
    queryFn: getEmployerJobs,
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myJobs"] });
      queryClient.invalidateQueries({ queryKey: ["employerStats"] });
    },
  });
};
export const useJobById = (id) => {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => getJobById(id),
    enabled: !!id,
  });
};

export const useJobApplications = (jobId) => {
  return useQuery({
    queryKey: ["jobApplications", jobId],
    queryFn: () => getJobApplications(jobId),
    enabled: !!jobId,
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ applicationId, status }) => {
      const { updateApplicationStatus } = await import("../api/applicationApi");
      return updateApplicationStatus(applicationId, status);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["jobApplications"] });
    },
  });
};
