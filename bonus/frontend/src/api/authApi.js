import httpClient from "../lib/httpClient";

const authApi = {
  register: async (user) => {
    try {
      const { data } = await httpClient.post("/api/signup", user);
      return data;
    } catch (error) {
      throw error;
    }
  },
  updateUser: async (firstName, lastName, id) => {
    try {
      const { data } = await httpClient.put("/api/user/edit/" + id, {
        firstName,
        lastName,
      });
      return data;
    } catch (error) {
      throw error;
    }
  },
  changePassword: async (oldPassword, newPassword) => {
    try {
      const { data } = await httpClient.put("/api/user/change-password", {
        oldPassword,
        newPassword,
      });
      return data;
    } catch (error) {
      throw error;
    }
  },
};

export default authApi;
