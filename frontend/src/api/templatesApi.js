const API_URL = "http://127.0.0.1:8000/templates";

export const getTemplates = async () => {
  const response = await fetch(API_URL);
  return response.json();
};