"""
Mizan Orchestration API
Part of Mizan extension to ArcPay

FastAPI backend for agent-orchestrated payments
"""

import os
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from models import (
    PayrollRunRequest,
    PayrollRunResult,
    AgentState,
    CorridorInfo
)
from workflows.payroll import PayrollWorkflow

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Mizan Orchestration API",
    description="Agentic payment infrastructure for SME cross-border commerce",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize workflow
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
if not ANTHROPIC_API_KEY:
    raise RuntimeError("ANTHROPIC_API_KEY environment variable not set")

workflow = PayrollWorkflow(ANTHROPIC_API_KEY)


@app.get("/")
async def root():
    """API root"""
    return {
        "name": "Mizan Orchestration API",
        "version": "1.0.0",
        "description": "Agentic payment infrastructure for SMEs",
        "docs": "/docs",
        "built_on": "ArcPay (3 Arc Hackathon Awards)"
    }


@app.get("/health")
async def health():
    """Health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "anthropic_configured": ANTHROPIC_API_KEY is not None
    }


@app.post("/api/payroll/run", response_model=PayrollRunResult)
async def run_payroll(request: PayrollRunRequest):
    """
    Execute agent-orchestrated payroll run

    This endpoint triggers the 5-agent LangGraph workflow:
    1. Supervisor - Routes and coordinates
    2. Classifier - Analyzes invoices
    3. Treasurer - Checks balance and optimizes routing
    4. Gatekeeper - Enforces compliance
    5. Payables - Executes payments
    """

    try:
        # Create initial state
        state = AgentState(
            invoices=request.invoices,
            rules=request.rules,
            dry_run=request.dry_run
        )

        # Run workflow
        result = await workflow.run(state)

        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Payroll execution failed: {str(e)}"
        )


@app.get("/api/corridors", response_model=List[CorridorInfo])
async def get_corridors():
    """
    List all available payment corridors
    """

    # In production, this would call the TypeScript corridor resolver
    # For now, return the 5 UAE corridors

    corridors = [
        CorridorInfo(
            id="uae-to-philippines",
            name="UAE → Philippines",
            source_country="AE",
            destination_country="PH",
            source_currency="AED",
            destination_currency="PHP",
            average_fee=0.01,
            average_settlement_time=3.0,
            enabled=True
        ),
        CorridorInfo(
            id="uae-to-india",
            name="UAE → India",
            source_country="AE",
            destination_country="IN",
            source_currency="AED",
            destination_currency="INR",
            average_fee=0.01,
            average_settlement_time=3.0,
            enabled=True
        ),
        CorridorInfo(
            id="uae-to-egypt",
            name="UAE → Egypt",
            source_country="AE",
            destination_country="EG",
            source_currency="AED",
            destination_currency="EGP",
            average_fee=0.008,
            average_settlement_time=3.0,
            enabled=True
        ),
        CorridorInfo(
            id="uae-to-pakistan",
            name="UAE → Pakistan",
            source_country="AE",
            destination_country="PK",
            source_currency="AED",
            destination_currency="PKR",
            average_fee=0.012,
            average_settlement_time=3.0,
            enabled=True
        ),
        CorridorInfo(
            id="uae-to-nigeria",
            name="UAE → Nigeria",
            source_country="AE",
            destination_country="NG",
            source_currency="AED",
            destination_currency="NGN",
            average_fee=0.015,
            average_settlement_time=3.0,
            enabled=True
        )
    ]

    return corridors


@app.get("/api/corridors/{corridor_id}", response_model=CorridorInfo)
async def get_corridor(corridor_id: str):
    """Get specific corridor information"""

    corridors = await get_corridors()
    corridor = next((c for c in corridors if c.id == corridor_id), None)

    if not corridor:
        raise HTTPException(status_code=404, detail=f"Corridor {corridor_id} not found")

    return corridor


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
