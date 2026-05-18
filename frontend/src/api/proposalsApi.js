const API_URL = "http://127.0.0.1:8000/proposals";

export const getProposals = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

export const createProposal = async (proposal) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(proposal),
  });

  return response.json();
};

export const updateProposal = async (id, proposal) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(proposal),
  });

  return response.json();
};

export const deleteProposal = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  return response.json();
};

export const generateProposalDraft = async (proposalId) => {
  const response = await fetch(
    `http://127.0.0.1:8000/proposals/${proposalId}/generate-draft`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error("Error generating proposal draft");
  }

  return response.json();
};