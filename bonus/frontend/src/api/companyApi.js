import httpClient from "../lib/httpClient";

const companyApi = {
  getAllCompany: async () => {
    try {
      const res = await httpClient.get(`/api/company`);
      return res.data.company;
    } catch (error) {
      return [];
    }
  },
};
export default companyApi;
