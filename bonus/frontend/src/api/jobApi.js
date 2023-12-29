import httpClient from "../lib/httpClient";

const jobApi = {
  getSingleJob: async (id) => {
    try {
      const res = await httpClient.get(`/api/job/applicants/${id}`);
      return res.data.applicants;
    } catch (error) {
      return error;
    }
  },
  getHistoryApplicants: async () => {
    try {
      const res = await httpClient.get(`/api/job/history`);
      return res.data.applicants;
    } catch (error) {
      return error;
    }
  },
  getJobbyCreateUser: async (pageNumber, keyword, cat, location) => {
    try {
      const { data } = await httpClient.get(
        `/api/jobs/show-create/?pageNumber=${pageNumber}&keyword=${keyword}&cat=${cat}&location=${location}`
      );
      return data.jobs;
    } catch (error) {
      return error;
    }
  },
  acceptJob: async (id, email, subject, htmlForm) => {
    console.log(id, email, subject, htmlForm);
    try {
      const res = await httpClient.post("/api/job/accept", {
        id,
        email,
        subject,
        htmlForm,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  rejectJob: async (id, email, subject, htmlForm) => {
    try {
      const res = await httpClient.post(`/api/job/reject`, {
        id,
        email,
        subject,
        htmlForm,
      });
      return res.data;
    } catch (error) {
      return error;
    }
  },
  getJobbyId: async (id) => {
    try {
      const res = await httpClient.get(`/api/job/${id}`);
      return res.data;
    } catch (error) {
      return error;
    }
  },
  updateJobbyId: async (id, title, description, salary, location, jobType) => {
    try {
      const res = await httpClient.put(`/api/job/update/${id}`, {
        title,
        description,
        salary,
        location,
        jobType,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },
};

export default jobApi;
