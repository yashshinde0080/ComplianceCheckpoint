from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from datetime import datetime
import os
import json
import zipfile
import markdown

from app.db.session import get_db
from app.db.models.user import User
from app.db.models.audit_export import AuditExport
from app.db.models.framework import Framework
from app.db.models.control import Control
from app.db.models.policy import Policy
from app.db.models.evidence import Evidence
from app.db.models.task import Task
from app.schemas.audit_export import AuditExportCreate, AuditExportRead
from app.core.dependencies import get_current_active_user, require_roles

router = APIRouter()

EXPORT_DIR = "exports"
os.makedirs(EXPORT_DIR, exist_ok=True)


@router.get("", response_model=List[AuditExportRead])
async def list_audit_exports(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(AuditExport)
        .where(AuditExport.organization_id == current_user.organization_id)
        .order_by(AuditExport.created_at.desc())
    )
    return result.scalars().all()


@router.post("/export", response_model=AuditExportRead)
async def create_audit_export(
    export_data: AuditExportCreate,
    current_user: User = Depends(require_roles(["Founder", "Admin"])),
    db: AsyncSession = Depends(get_db)
):
    org_id = current_user.organization_id

    # Get framework
    framework_result = await db.execute(
        select(Framework).where(Framework.id == export_data.framework_id)
    )
    framework = framework_result.scalar_one_or_none()

    if not framework:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Framework not found"
        )

    # Create export record
    audit_export = AuditExport(
        organization_id=org_id,
        framework_id=export_data.framework_id,
        export_type=export_data.export_type,
        status="Processing"
    )
    db.add(audit_export)
    await db.commit()
    await db.refresh(audit_export)

    try:
        # Get all relevant data
        controls_result = await db.execute(
            select(Control).where(Control.framework_id == export_data.framework_id)
        )
        controls = controls_result.scalars().all()

        policies_result = await db.execute(
            select(Policy).where(
                Policy.organization_id == org_id,
                Policy.framework_id == export_data.framework_id
            )
        )
        policies = policies_result.scalars().all()

        evidence_result = await db.execute(
            select(Evidence).where(Evidence.organization_id == org_id)
        )
        all_evidence = evidence_result.scalars().all()

        tasks_result = await db.execute(
            select(Task).where(Task.organization_id == org_id)
        )
        all_tasks = tasks_result.scalars().all()

        # Generate export
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        export_filename = f"audit_export_{org_id}_{framework.name.replace(' ', '_')}_{timestamp}"

        if export_data.export_type == "ZIP":
            export_path = os.path.join(EXPORT_DIR, f"{export_filename}.zip")

            with zipfile.ZipFile(export_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                # Add summary JSON
                summary = {
                    "framework": framework.name,
                    "export_date": datetime.utcnow().isoformat(),
                    "total_controls": len(controls),
                    "total_policies": len(policies),
                    "total_evidence": len(all_evidence),
                    "controls": [
                        {
                            "code": c.control_code,
                            "title": c.title,
                            "description": c.description,
                            "evidence_count": len([e for e in all_evidence if e.control_id == c.id]),
                            "task_count": len([t for t in all_tasks if t.control_id == c.id])
                        }
                        for c in controls
                    ]
                }
                zipf.writestr("summary.json", json.dumps(summary, indent=2))

                # Add policies as markdown
                for policy in policies:
                    zipf.writestr(f"policies/{policy.title}.md", policy.content)

                # Add evidence files
                for ev in all_evidence:
                    if os.path.exists(ev.file_url):
                        zipf.write(ev.file_url, f"evidence/{ev.file_name}")

            audit_export.download_url = export_path  # type: ignore
        else:
            # Generate HTML report for PDF-style viewing
            export_path = os.path.join(EXPORT_DIR, f"{export_filename}.html")

            html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <title>Compliance Audit Report - {framework.name}</title>
    <style>
        body {{ font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px; }}
        h1 {{ color: #1a1a1a; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }}
        h2 {{ color: #374151; margin-top: 30px; }}
        h3 {{ color: #4b5563; }}
        .control {{ background: #f9fafb; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #3b82f6; }}
        .control-code {{ font-weight: bold; color: #3b82f6; }}
        .policy {{ background: #f0f9ff; padding: 15px; margin: 10px 0; border-radius: 8px; }}
        .evidence {{ background: #f0fdf4; padding: 10px; margin: 5px 0; border-radius: 4px; }}
        .status-completed {{ color: #059669; }}
        .status-pending {{ color: #d97706; }}
        .meta {{ color: #6b7280; font-size: 0.9em; }}
    </style>
</head>
<body>
    <h1>Compliance Audit Report</h1>
    <p class="meta">Framework: {framework.name} | Generated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}</p>

    <h2>Summary</h2>
    <ul>
        <li>Total Controls: {len(controls)}</li>
        <li>Policies: {len(policies)}</li>
        <li>Evidence Items: {len(all_evidence)}</li>
    </ul>

    <h2>Controls</h2>
"""

            for control in controls:
                control_evidence = [e for e in all_evidence if e.control_id == control.id]
                control_tasks = [t for t in all_tasks if t.control_id == control.id]

                html_content += f"""
    <div class="control">
        <span class="control-code">{control.control_code}</span> - {control.title}
        <p>{control.description}</p>
        <p class="meta">Evidence: {len(control_evidence)} | Tasks: {len(control_tasks)}</p>
"""

                for ev in control_evidence:
                    html_content += f"""
        <div class="evidence">📎 {ev.file_name} - Status: {ev.status}</div>
"""

                html_content += "</div>"

            html_content += """
    <h2>Policies</h2>
"""

            for policy in policies:
                policy_html = markdown.markdown(policy.content)  # type: ignore
                html_content += f"""
    <div class="policy">
        <h3>{policy.title}</h3>
        <p class="meta">Status: {policy.status} | Version: {policy.version}</p>
        {policy_html}
    </div>
"""

            html_content += """
</body>
</html>
"""

            with open(export_path, 'w') as f:
                f.write(html_content)

            audit_export.download_url = export_path  # type: ignore

        audit_export.status = "Ready"  # type: ignore
        audit_export.generated_at = datetime.utcnow()  # type: ignore
        await db.commit()
        await db.refresh(audit_export)

        return audit_export

    except Exception as e:
        audit_export.status = "Failed"  # type: ignore
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Export failed: {str(e)}"
        )


@router.get("/{export_id}", response_model=AuditExportRead)
async def get_audit_export(
    export_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(AuditExport).where(
            AuditExport.id == export_id,
            AuditExport.organization_id == current_user.organization_id
        )
    )
    export = result.scalar_one_or_none()

    if not export:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Export not found"
        )

    return export


@router.get("/{export_id}/download")
async def download_audit_export(
    export_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(AuditExport).where(
            AuditExport.id == export_id,
            AuditExport.organization_id == current_user.organization_id
        )
    )
    export = result.scalar_one_or_none()

    if not export:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Export not found"
        )

    if export.status != "Ready" or not export.download_url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Export not ready for download"
        )

    if not os.path.exists(export.download_url):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Export file not found"
        )

    return FileResponse(
        export.download_url,
        filename=os.path.basename(export.download_url),
        media_type="application/octet-stream"
    )