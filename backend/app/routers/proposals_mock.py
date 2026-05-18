from fastapi import APIRouter

router = APIRouter(
    prefix="/proposals",
    tags=["Proposals"],
)


proposals = [
    {
        "id": 1,
        "title": "Propuesta Demo",
        "description": "Empresa Alpha",
        "status": "draft",
        "totalAmount": 250000,
    }
]


@router.get("")
def list_proposals():
    return proposals

@router.post("")
def create_proposal(proposal: dict):

    new_proposal = {
        "id": len(proposals) + 1,
        "title": proposal.get("title", "Nueva Proposal"),
        "description": proposal.get("description", ""),
        "status": proposal.get("status", "draft"),
        "totalAmount": proposal.get("totalAmount", 0),
    }

    proposals.append(new_proposal)

    return new_proposal

@router.get("/{proposal_id}")
def get_proposal(proposal_id: int):
    return {
        "id": proposal_id,
        "name": "Propuesta Demo",
        "customer": "Empresa Alpha",
        "status": "draft",
        "totalAmount": 250000,
    }


@router.put("/{proposal_id}")
def update_proposal(proposal_id: int, proposal: dict):
    for item in proposals:
        if item["id"] == proposal_id:
            item["title"] = proposal.get("title", item["title"])
            item["description"] = proposal.get("description", item["description"])
            item["status"] = proposal.get("status", item["status"])
            item["totalAmount"] = proposal.get("totalAmount", item.get("totalAmount", 0))
            return item

    return {"error": "Proposal no encontrada"}


@router.post("/{proposal_id}/generate-draft")
def generate_proposal_draft(proposal_id: int):
    return {
        "jobId": f"job-proposal-{proposal_id}",
        "status": "pending",
    }


@router.post("/{proposal_id}/upload-to-crm")
def upload_proposal_to_crm(proposal_id: int):
    return {
        "crmRecordId": f"crm-{proposal_id}",
        "crmUrl": "https://crm.example.com/proposals/demo",
        "status": "uploaded",
    }


@router.get("/{proposal_id}/download")
def download_proposal(proposal_id: int):
    return {
        "message": f"Download mock para proposal {proposal_id}",
        "format": "pdf",
    }


@router.delete("/{proposal_id}")
def delete_proposal(proposal_id: int):
    for item in proposals:
        if item["id"] == proposal_id:
            proposals.remove(item)
            return {"message": f"Proposal {proposal_id} eliminada"}

    return {"error": "Proposal no encontrada"}