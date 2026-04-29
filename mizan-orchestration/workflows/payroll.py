"""
Payroll Workflow
Part of Mizan extension to ArcPay

LangGraph workflow for agent-orchestrated payroll execution
"""

from typing import Dict, Any
from datetime import datetime
from langgraph.graph import StateGraph, END
from anthropic import Anthropic

from models import AgentState, PayrollRunResult
from agents.supervisor import SupervisorAgent
from agents.classifier import ClassifierAgent
from agents.treasurer import TreasurerAgent
from agents.payables import PayablesAgent
from agents.gatekeeper import GatekeeperAgent


class PayrollWorkflow:
    """LangGraph workflow for payroll execution"""

    def __init__(self, anthropic_api_key: str):
        self.anthropic = Anthropic(api_key=anthropic_api_key)

        # Initialize agents
        self.supervisor = SupervisorAgent(self.anthropic)
        self.classifier = ClassifierAgent(self.anthropic)
        self.treasurer = TreasurerAgent(self.anthropic)
        self.payables = PayablesAgent(self.anthropic)
        self.gatekeeper = GatekeeperAgent(self.anthropic)

        # Build workflow graph
        self.workflow = self._build_workflow()

    def _build_workflow(self) -> StateGraph:
        """Build LangGraph state machine"""

        workflow = StateGraph(AgentState)

        # Add nodes (agents)
        workflow.add_node("supervisor_route", self._supervisor_route_node)
        workflow.add_node("classifier", self._classifier_node)
        workflow.add_node("treasurer_balance", self._treasurer_balance_node)
        workflow.add_node("treasurer_routing", self._treasurer_routing_node)
        workflow.add_node("gatekeeper", self._gatekeeper_node)
        workflow.add_node("payables", self._payables_node)
        workflow.add_node("supervisor_summarize", self._supervisor_summarize_node)

        # Set entry point
        workflow.set_entry_point("supervisor_route")

        # Add edges (workflow flow)
        workflow.add_edge("supervisor_route", "classifier")
        workflow.add_edge("classifier", "treasurer_balance")

        # Conditional: Only proceed if balance is sufficient
        workflow.add_conditional_edges(
            "treasurer_balance",
            self._check_balance_sufficient,
            {
                "sufficient": "treasurer_routing",
                "insufficient": END
            }
        )

        workflow.add_edge("treasurer_routing", "gatekeeper")

        # Conditional: Only proceed if compliance passed
        workflow.add_conditional_edges(
            "gatekeeper",
            self._check_compliance_passed,
            {
                "passed": "payables",
                "failed": END
            }
        )

        workflow.add_edge("payables", "supervisor_summarize")
        workflow.add_edge("supervisor_summarize", END)

        return workflow.compile()

    # Node implementations

    async def _supervisor_route_node(self, state: AgentState) -> AgentState:
        """Supervisor routing"""
        await self.supervisor.route(state)
        return state

    async def _classifier_node(self, state: AgentState) -> AgentState:
        """Classifier agent"""
        await self.classifier.classify(state)
        return state

    async def _treasurer_balance_node(self, state: AgentState) -> AgentState:
        """Treasurer balance check"""
        await self.treasurer.check_balance(state)
        return state

    async def _treasurer_routing_node(self, state: AgentState) -> AgentState:
        """Treasurer routing optimization"""
        await self.treasurer.optimize_routing(state)
        return state

    async def _gatekeeper_node(self, state: AgentState) -> AgentState:
        """Gatekeeper compliance check"""
        await self.gatekeeper.check_compliance(state)
        return state

    async def _payables_node(self, state: AgentState) -> AgentState:
        """Payables execution"""
        await self.payables.execute_payments(state)
        return state

    async def _supervisor_summarize_node(self, state: AgentState) -> AgentState:
        """Supervisor summarization"""
        await self.supervisor.summarize(state)
        return state

    # Conditional edge functions

    def _check_balance_sufficient(self, state: AgentState) -> str:
        """Check if balance is sufficient"""
        return "sufficient" if state.balance_sufficient else "insufficient"

    def _check_compliance_passed(self, state: AgentState) -> str:
        """Check if compliance passed"""
        return "passed" if state.compliance_passed else "failed"

    # Workflow execution

    async def run(self, state: AgentState) -> PayrollRunResult:
        """Execute the workflow"""

        started_at = datetime.utcnow()

        # Run workflow
        final_state = await self.workflow.ainvoke(state)

        completed_at = datetime.utcnow()
        duration = (completed_at - started_at).total_seconds()

        # Build result
        result = PayrollRunResult(
            run_id=f"pr_{int(started_at.timestamp())}",
            total=sum(t.amount for t in final_state.transactions),
            recipients=len(set(t.recipient for t in final_state.transactions)),
            corridors=list(set(t.corridor for t in final_state.transactions)),
            chains=list(set(t.chain for t in final_state.transactions)),
            reasoning=final_state.reasoning,
            agent_actions=final_state.actions,
            transactions=final_state.transactions,
            success=final_state.compliance_passed and final_state.balance_sufficient,
            errors=final_state.errors + final_state.compliance_issues,
            started_at=started_at,
            completed_at=completed_at,
            duration=duration
        )

        return result
