import API from "./api";

const authService = {
  login: async (email, password) => {
    const response = await API.post("/auth/login", { email, password });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await API.post("/auth/register", userData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },

  getProfile: async () => {
    const response = await API.get("/auth/profile");
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await API.put("/auth/profile", profileData);
    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await API.post("/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (token, newPassword) => {
    const response = await API.post("/auth/reset-password", { token, newPassword });
    return response.data;
  },
};

export default authService;
