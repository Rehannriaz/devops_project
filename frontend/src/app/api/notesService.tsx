import axios from "axios";

const API_BASE_URL = "http://localhost:3000"; // Adjust this to your API's base URL
const API_KEY = "abc123";

interface Note {
  _id: string;
  title: string;
  description: string;
}

interface NewNote {
  title: string;
  description: string;
}

export const notesService = {
  getNotes: async () => {
    try {
      const token = localStorage.getItem("userToken");
      console.log("Token from localStorage:", token); // Add this line
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        `${API_BASE_URL}/notes?api_key=${API_KEY}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data.message ||
            "An error occurred while fetching notes"
        );
      }
      throw error;
    }
  },

  addNote: async (noteData: NewNote) => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        `${API_BASE_URL}/notes?api_key=${API_KEY}`,
        noteData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data.message ||
            "An error occurred while adding the note"
        );
      }
      throw error;
    }
  },

  updateNote: async (noteId: string, noteData: Partial<NewNote>) => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.put(
        `${API_BASE_URL}/notes/${noteId}?api_key=${API_KEY}`,
        noteData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data.message ||
            "An error occurred while updating the note"
        );
      }
      throw error;
    }
  },

  deleteNote: async (noteId: string) => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.delete(
        `${API_BASE_URL}/notes/${noteId}?api_key=${API_KEY}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data.message ||
            "An error occurred while deleting the note"
        );
      }
      throw error;
    }
  },
};
