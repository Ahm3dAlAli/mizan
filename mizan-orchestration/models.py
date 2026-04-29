"""
Mizan Orchestration Models
Part of Mizan extension to ArcPay

Pydantic models for API requests and responses
"""

from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class Invoice(BaseModel):
    """Invoice for payment"""
    id: Optional[str] = None
    recipient: str
    amount: float
    country: str
    currency: str = "USD"
    email: Optional[str] = None
    memo: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class PayrollRunRequest(BaseModel):
    """Request to run payroll"""
    invoices: List[Invoice]
    rules: str = Field(default="strict", description="Compliance rules: strict, lenient, custom")
    dry_run: bool = Field(default=False, description="Simulate without executing")


class AgentAction(BaseModel):
    """Agent action log entry"""
    agent: str
    action: str
    reasoning: str
    tools_called: List[str] = []
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: Optional[Dict[str, Any]] = None


class TransactionResult(BaseModel):
    """Transaction execution result"""
    invoice_id: Optional[str] = None
    recipient: str
    amount: float
    corridor: str
    chain: str
    tx_hash: str
    status: str = "success"
    fee: float = 0.0
    settlement_time: float = 0.0
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class PayrollRunResult(BaseModel):
    """Result of payroll run"""
    run_id: str
    total: float
    recipients: int
    corridors: List[str]
    chains: List[str]
    reasoning: str
    agent_actions: List[AgentAction]
    transactions: List[TransactionResult]
    success: bool = True
    errors: List[str] = []
    started_at: datetime
    completed_at: datetime
    duration: float  # seconds


class CorridorInfo(BaseModel):
    """Corridor information"""
    id: str
    name: str
    source_country: str
    destination_country: str
    source_currency: str
    destination_currency: str
    average_fee: float
    average_settlement_time: float
    enabled: bool


class AgentState(BaseModel):
    """LangGraph agent state"""
    invoices: List[Invoice]
    rules: str
    dry_run: bool

    # Classified invoices
    classified_invoices: List[Dict[str, Any]] = []

    # Treasury status
    balance: float = 0.0
    balance_sufficient: bool = False

    # Routing decisions
    routing_plan: List[Dict[str, Any]] = []

    # Transaction results
    transactions: List[TransactionResult] = []

    # Agent actions log
    actions: List[AgentAction] = []

    # Compliance flags
    compliance_passed: bool = False
    compliance_issues: List[str] = []

    # Final reasoning
    reasoning: str = ""

    # Error tracking
    errors: List[str] = []
