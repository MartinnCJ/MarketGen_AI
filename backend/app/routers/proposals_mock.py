from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies.db import get_db
from app.models.proposal import Proposal
import re
from pathlib import Path
from fastapi.responses import FileResponse
from bs4 import BeautifulSoup
from reportlab.pdfgen import canvas
from docx import Document
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import LETTER
from app.services.gemini_service import (
    generate_proposal_draft as gemini_generate_proposal_draft
)
router = APIRouter(
    prefix="/proposals",
    tags=["Proposals"],
)


def serialize_proposal(proposal: Proposal):
    return {
        "id": proposal.id_propuesta,
        "title": proposal.titulo,
        "description": proposal.contenido,
        "status": getattr(proposal, "estado", "draft"),
        "totalAmount": getattr(proposal, "monto_total", 0),
    }


@router.get("")
def list_proposals(db: Session = Depends(get_db)):
    proposals = db.query(Proposal).all()
    return [serialize_proposal(p) for p in proposals]


@router.post("")
def create_proposal(proposal: dict, db: Session = Depends(get_db)):
    new_proposal = Proposal(
        titulo=proposal.get("title", "Nueva Proposal"),
        contenido=proposal.get("description", "")
    )

    db.add(new_proposal)
    db.commit()
    db.refresh(new_proposal)

    return serialize_proposal(new_proposal)


@router.get("/{proposal_id}")
def get_proposal(proposal_id: int, db: Session = Depends(get_db)):
    proposal = db.query(Proposal).filter(
        Proposal.id_propuesta == proposal_id
    ).first()

    if not proposal:
        return {"error": "Proposal no encontrada"}

    return serialize_proposal(proposal)


@router.put("/{proposal_id}")
def update_proposal(proposal_id: int, proposal: dict, db: Session = Depends(get_db)):
    item = db.query(Proposal).filter(
        Proposal.id_propuesta == proposal_id
    ).first()

    if not item:
        return {"error": "Proposal no encontrada"}

    item.titulo = proposal.get("title", item.titulo)
    item.contenido = proposal.get("description", item.contenido)

    db.commit()
    db.refresh(item)

    return serialize_proposal(item)


@router.delete("/{proposal_id}")
def delete_proposal(proposal_id: int, db: Session = Depends(get_db)):
    item = db.query(Proposal).filter(
        Proposal.id_propuesta == proposal_id
    ).first()

    if not item:
        return {"error": "Proposal no encontrada"}

    db.delete(item)
    db.commit()

    return {"message": f"Proposal {proposal_id} eliminada"}

@router.post("/{proposal_id}/upload-to-crm")
def upload_proposal_to_crm(proposal_id: int):
    return {
        "crmRecordId": f"crm-{proposal_id}",
        "crmUrl": "https://crm.example.com/proposals/demo",
        "status": "uploaded",
    }

# =========================
# GEMINI GENERATE DRAFT
# =========================

@router.post("/{proposal_id}/generate-draft")
async def generate_proposal_draft(
    proposal_id: int,
    db: Session = Depends(get_db)
):
    proposal = db.query(Proposal).filter(
        Proposal.id_propuesta == proposal_id
    ).first()

    if not proposal:
        return {"error": "Proposal no encontrada"}

    generated_content = await gemini_generate_proposal_draft(
        template_content="""
        <h1>{{proposal_name}}</h1>
        <h2>Resumen ejecutivo</h2>
        <p>{{business_context}}</p>

        <h2>Alcance</h2>
        <p>Describe los servicios propuestos.</p>

        <h2>Beneficios</h2>
        <p>Explica los beneficios para el cliente.</p>

        <h2>Próximos pasos</h2>
        <p>Indica las acciones recomendadas.</p>
        """,
        proposal_name=proposal.titulo,
        customer_name="Cliente",
        customer_company="Empresa cliente",
        proposal_date="2026-05-18",
        line_items=[],
        subtotal=0,
        discount=0,
        tax_rate=0,
        total=0,
        business_process=proposal.contenido or "",
    )

    proposal.contenido = generated_content
    proposal.estado = "generado"

    db.commit()
    db.refresh(proposal)

    return {
        "message": "Proposal generada con Gemini",
        "proposal": serialize_proposal(proposal),
    }


# =========================
# DOWNLOAD
# =========================

@router.get("/{proposal_id}/download")
def download_proposal(
    proposal_id: int,
    format: str = "pdf",
    db: Session = Depends(get_db)
):
    proposal = db.query(Proposal).filter(
        Proposal.id_propuesta == proposal_id
    ).first()

    if not proposal:
        return {"error": "Proposal no encontrada"}

    output_dir = Path("generated_files")
    output_dir.mkdir(exist_ok=True)

    title = proposal.titulo or "Proposal"
    content = proposal.contenido or "Sin contenido"

    clean_content = re.sub(r"<[^>]+>", "", content)

    file_path = output_dir / f"proposal_{proposal_id}.pdf"

    doc_pdf = SimpleDocTemplate(
        str(file_path),
        pagesize=LETTER,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72,
    )

    styles = getSampleStyleSheet()
    story = []

    story.append(Paragraph(title, styles["Title"]))
    story.append(Spacer(1, 18))

    for line in clean_content.split("\n"):
        line = line.strip()

        if not line:
            story.append(Spacer(1, 8))
            continue

        if line.lower() in [
            "resumen ejecutivo",
            "alcance",
            "beneficios",
            "servicios propuestos",
            "próximos pasos",
        ]:
            story.append(Spacer(1, 12))
            story.append(Paragraph(line, styles["Heading2"]))
            story.append(Spacer(1, 6))
        else:
            story.append(Paragraph(line, styles["BodyText"]))
            story.append(Spacer(1, 6))

    doc_pdf.build(story)

    return FileResponse(
        path=file_path,
        filename=f"proposal_{proposal_id}.pdf",
        media_type="application/pdf",
    )