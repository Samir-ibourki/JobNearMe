import API from "./axios";

export const getAllJobs = () => API.get("/jobs");
export const getJobById = (id) => API.get(`/jobs/${id}`);
export const getNearbyJobs = (lat, lng, raduis) =>
  API.get("/job/nearby", { params: { lat, lng, raduis } });
export const createJob = (data) => API.post("/jobs", data);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);
export const getEmployerJobs = () =>
  API.get("/jobs/my-jobs").then((res) => res.data.data);
export const getEmployerStatsApi = () =>
  API.get("/jobs/stats").then((res) => res.data.data);
