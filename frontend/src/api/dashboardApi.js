import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/dashboard";

export const getDashboardData = async () => {
  const response = await fetch("http://127.0.0.1:8000/api/dashboard");
  const data = await response.json();
  return data;
};