const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const PROPOSALS_URL = `${API_URL}/proposals`;

export const getProposals = async () => {
  const response = await fetch(PROPOSALS_URL);
  return response.json();
};

export const createProposal = async (proposal) => {
  const response = await fetch(PROPOSALS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(proposal),
  });

  return response.json();
};

export const updateProposal = async (id, proposal) => {
  const response = await fetch(`${PROPOSALS_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(proposal),
  });

  return response.json();
};

export const deleteProposal = async (id) => {
  const response = await fetch(`${PROPOSALS_URL}/${id}`, {
    method: "DELETE",
  });

  return response.json();
};

export const generateDraft = async (proposalId) => {
  const response = await fetch(`${PROPOSALS_URL}/${proposalId}/generate-draft`, {
    method: "POST",
  });

  return response.json();
};

export const generateProposalDraft = generateDraft;

export const downloadProposalPdf = (id) => {
  window.open(`${PROPOSALS_URL}/${id}/download?format=pdf`, "_blank");
};

export const downloadProposalDocx = (id) => {
  window.open(`${PROPOSALS_URL}/${id}/download?format=docx`, "_blank");
};
import api from "./axios";

export const proposalsApi = {
  list: () => api.get("/proposals"),
  create: (data) => api.post("/proposals", data),
  update: (id, data) => api.put(`/proposals/${id}`, data),
  delete: (id) => api.delete(`/proposals/${id}`),
  generateDraft: (data) => api.post("/proposals/generate-draft", data),
  downloadPdf: (id) =>
    api.get(`/proposals/${id}/pdf`, { responseType: "blob" }),
  downloadDocx: (id) =>
    api.get(`/proposals/${id}/docx`, { responseType: "blob" }),
};

export const getProposals = async () => {
  const response = await api.get("/proposals");
  return response.data;
};
export const createProposal = async (data) => {
  const response = await api.post("/proposals", data);
  return response.data;
};
export const updateProposal = (id, data) => api.put(`/proposals/${id}`, data);
export const deleteProposal = (id) => api.delete(`/proposals/${id}`);

export const generateProposalDraft = async (data) => {
  const response = await api.post("/proposals/generate-draft", data);
  return response.data;
};
export const downloadProposalPdf = (id) =>
  api.get(`/proposals/${id}/pdf`, { responseType: "blob" });

export const downloadProposalDocx = (id) =>
  api.get(`/proposals/${id}/docx`, { responseType: "blob" }); 
