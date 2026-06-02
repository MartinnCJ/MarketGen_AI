<<<<<<< HEAD
const API_URL = "http://127.0.0.1:8000/templates";

export const getTemplates = async () => {
  const response = await fetch(API_URL);
  return response.json();
};
=======
import api from "./axios";

export const templatesApi = {
  list: () => api.get("/templates"),
};

export const getTemplates = () => api.get("/templates");
>>>>>>> 298ebad (Actualizacion de datos)
