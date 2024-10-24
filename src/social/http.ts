import { API_BASE_URL } from "./SocialConfig";

export const fetchWithToken = async (endpoint: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.json();
};

export const httpConfig = (token: string) => ({
  headers: {
    Authorization: "Bearer " + token,
  },
});
