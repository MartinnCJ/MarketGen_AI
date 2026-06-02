const API_URL = "http://127.0.0.1:8000/api/v1/customers";

export const getCustomers = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

