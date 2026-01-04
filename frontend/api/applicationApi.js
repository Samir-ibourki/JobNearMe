import API from "./axios.js";

export const applyToJob = (jobId, coverLetter) =>
  API.post(`/applications/${jobId}`, { jobId, coverLetter }).then(
    (res) => res.data
  );

export const getMyApplications = () =>
  API.get("/applications/my").then((res) => res.data.data);

export const getJobApplications = (jobId) =>
  API.get(`/applications/job/${jobId}`).then((res) => res.data.data);
