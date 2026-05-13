from fastapi import APIRouter

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/dashboard")
def get_dashboard():
    return {
        "totalProposals": 12,
        "totalProposalValue": 250000,
        "totalBooks": 5,
        "topAsset": "BPO Guide for Finance",
        "detected": 999,
        "researched": 214,
        "contacted": 156,
        "pending_review": 12,
        "replied": 18,
        "won": 7,
    }