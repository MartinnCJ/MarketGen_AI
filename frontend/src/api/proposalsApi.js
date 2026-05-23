const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1";

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
  const response = await fetch(
    `${PROPOSALS_URL}/${proposalId}/generate-draft`,
    {
      method: "POST",
    }
  );

  return response.json();
};

export const generateProposalDraft = generateDraft;

export const downloadProposalPdf = (id) => {
  window.open(`${PROPOSALS_URL}/${id}/download?format=pdf`, "_blank");
};

export const downloadProposalDocx = (id) => {
  window.open(`${PROPOSALS_URL}/${id}/download?format=docx`, "_blank");
};