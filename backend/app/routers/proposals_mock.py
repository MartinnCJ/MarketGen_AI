from fastapi import APIRouter

router = APIRouter(
    prefix="/proposals",
    tags=["Proposals"],
)


@router.get("")
def list_proposals():
    return [
        {
            "id": 1,
            "name": "Propuesta Demo",
            "customer": "Empresa Alpha",
            "status": "draft",
            "totalAmount": 250000,
        }
    ]


@router.post("")
def create_proposal():
    return {"message": "Proposal creada correctamente"}


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
def update_proposal(proposal_id: int):
    return {"message": f"Proposal {proposal_id} actualizada"}


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
    return {"message": f"Proposal {proposal_id} eliminada"}