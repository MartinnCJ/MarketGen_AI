<<<<<<< HEAD
const API_URL = "http://127.0.0.1:8000/api/v1/customers";

export const getCustomers = async () => {
  const response = await fetch(API_URL);
  return response.json();
};
=======
import api from "./axios";

export const customersApi = {
  list: () => api.get("/customers"),
};

export const getCustomers = () => api.get("/customers");
>>>>>>> 298ebad (Actualizacion de datos)
