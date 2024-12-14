import axios from "axios";

const API_BASE_URL = "http://localhost:3000"; // Adjust this to your API's base URL
const API_KEY = "abc123";

interface SignupData {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const userService = {
  signup: async (userData: SignupData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/signup?api_key=${API_KEY}`,
        userData
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data.message || "An error occurred during signup"
        );
      }
      throw error;
    }
  },

  login: async (loginData: LoginData) => {
    try {
      console.log("Attempting login with data:", loginData);

      const response = await axios.post(
        `${API_BASE_URL}/login?api_key=${API_KEY}`,
        loginData
      );

      console.log("Login response:", response.data);

      const { token, userId } = response.data;

      // Store token and userId in localStorage
      localStorage.setItem("userToken", token);
      localStorage.setItem("userId", userId);

      console.log("Stored in localStorage - Token:", token, "UserId:", userId);

      return response.data;
    } catch (error) {
      console.error("Login error:", error);

      if (axios.isAxiosError(error)) {
        console.error("Axios error response:", error.response);
        throw new Error(
          error.response?.data.message || "An error occurred during login"
        );
      }
      throw error;
    }
  },

  logout: async () => {
    try {
      const token = localStorage.getItem("userToken");

      if (!token) {
        throw new Error("No active session found");
      }

      const response = await axios.post(
        `${API_BASE_URL}/logout?api_key=${API_KEY}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("userToken");
      localStorage.removeItem("userId");

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data.message || "An error occurred during logout"
        );
      }
      throw error;
    }
  },
};
