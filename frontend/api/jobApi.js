import API from "./axios.js";

export const getAllJobs = () => API.get("/jobs").then((res) => res.data.data);
export const getJobById = (id) =>
  API.get(`/jobs/${id}`).then((res) => res.data);
export const getNearbyJobs = (lat, lng, radius) =>
  API.get("/jobs/nearby", { params: { lat, lng, radius } }).then(
    (res) => res.data.data
  );

export const createJob = (data) =>
  API.post("/jobs", data).then((res) => res.data);
export const updateJob = (id, data) =>
  API.put(`/jobs/${id}`, data).then((res) => res.data);
export const deleteJob = (id) =>
  API.delete(`/jobs/${id}`).then((res) => res.data);
export const getEmployerJobs = () =>
  API.get("/jobs/my-jobs").then((res) => res.data.data);
export const getEmployerStatsApi = () =>
  API.get("/jobs/stats").then((res) => res.data.data);
