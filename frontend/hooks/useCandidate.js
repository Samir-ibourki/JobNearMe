import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllJobs, getJobById, getNearbyJobs } from "../api/jobApi";
import { applyToJob, getMyApplications } from "../api/applicationApi";
import API from "../api/axios";
import { profileApi } from "../api/authApi";

export const useAllJobs = () => {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: getAllJobs,
  });
};

export const useNearbyJobs = (lat, lng, radius = 10) => {
  return useQuery({
    queryKey: ["jobs", "nearby", lat, lng, radius],
    queryFn: () => getNearbyJobs(lat, lng, radius),
    enabled: !!lat && !!lng,
  });
};

export const useJobDetails = (id) => {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => getJobById(id),
    enabled: !!id,
  });
};

export const useMyApplications = () => {
  return useQuery({
    queryKey: ["myApplications"],
    queryFn: getMyApplications,
  });
};

export const useApplyJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, coverLetter }) => applyToJob(jobId, coverLetter),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myApplications"] });
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile", "candidate"],
    queryFn: profileApi,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await API.put("/auth/profile", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
