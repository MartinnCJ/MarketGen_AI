const API_URL = "https://marketgen-ai.onrender.com/templates";

export const getTemplates = async () => {
  const response = await fetch(API_URL);
  return response.json();
};