const BASE_URL = "http://127.0.0.1:8000";

const request = async (endpoint, options = {}) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await response.json();

  if (!response.ok) throw data;

  return data;
};

const authHeaders = token => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`
});

export const authApi = {
  register: userData => request("/register/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  }),

  login: credentials => request("/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  }),

  refreshToken: refresh_token => request("/token/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refresh_token })
  }),

  loginWithGoogle: googleToken => request("/log/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: googleToken })
  }),

  getProfile: token => request("/profil/", {
    headers: authHeaders(token)
  }),

  updateProfile: (token, profileData) => request("/profil-update/", {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(profileData)
  })
};