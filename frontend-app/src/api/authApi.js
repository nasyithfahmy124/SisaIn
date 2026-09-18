const BASE_URL = "http://127.0.0.1:8000";

export const authApi = {
  register: async (userData) => {
    const response = await fetch(`${BASE_URL}/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw data; 
    }
    return data;
  },

  login: async (credentials) => {
    const response = await fetch(`${BASE_URL}/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Username atau password tidak valid.");
    }
    return data;
  },

  refreshToken: async (refresh_token) => {
    const response = await fetch(`${BASE_URL}/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refresh_token }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error("Sesi telah habis, silakan login kembali.");
    }
    return data;
  }
};