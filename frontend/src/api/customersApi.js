const API_URL = "https://marketgen-ai.onrender.com/customers";

export const getCustomers = async () => {
  const response = await fetch(API_URL);
  return response.json();
};