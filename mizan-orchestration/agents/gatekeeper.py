"""
Gatekeeper Agent
Part of Mizan extension to ArcPay

Enforces compliance and budgets
"""

from typing import Dict, Any, List
from anthropic import Anthropic
from models import AgentState, AgentAction


class GatekeeperAgent:
    """Enforces compliance and business rules"""

    def __init__(self, anthropic_client: Anthropic):
        self.client = anthropic_client

    async def check_compliance(self, state: AgentState) -> Dict[str, Any]:
        """
        Verify compliance requirements before payment execution
        """

        issues = []
        passed = True

        # Check amount limits per corridor
        for inv in state.classified_invoices:
            if not inv["valid"]:
                continue

            # Check amount limits based on corridor
            limit = self._get_amount_limit(inv["corridor"])
            if inv["amount"] > limit:
                issues.append(
                    f"Invoice {inv['invoice_id']}: Amount ${inv['amount']} "
                    f"exceeds {inv['corridor']} limit of ${limit}"
                )
                passed = False

        # Check sanctions (simulated for demo)
        sanctioned = await self._check_sanctions(state.classified_invoices)
        if sanctioned:
            issues.extend(sanctioned)
            passed = False

        # Check velocity limits (simulated for demo)
        total_amount = sum(inv["amount"] for inv in state.classified_invoices if inv["valid"])
        if state.rules == "strict" and total_amount > 50000:
            issues.append(f"Total amount ${total_amount} exceeds daily velocity limit of $50,000")
            passed = False

        reasoning = await self._generate_reasoning(
            len(state.classified_invoices),
            len(issues),
            passed,
            state.rules
        )

        # Log action
        action = AgentAction(
            agent="gatekeeper",
            action="check_compliance",
            reasoning=reasoning,
            tools_called=["sanctions_api", "amount_validator", "velocity_checker"],
            metadata={
                "passed": passed,
                "issues_found": len(issues),
                "rules_mode": state.rules
            }
        )

        state.actions.append(action)
        state.compliance_passed = passed
        state.compliance_issues = issues

        return {
            "passed": passed,
            "issues": issues,
            "reasoning": reasoning
        }

    def _get_amount_limit(self, corridor: str) -> float:
        """Get amount limit for corridor"""

        limits = {
            "uae-to-philippines": 10000,
            "uae-to-india": 15000,
            "uae-to-egypt": 8000,
            "uae-to-pakistan": 10000,
            "uae-to-nigeria": 8000
        }

        return limits.get(corridor, 10000)

    async def _check_sanctions(self, invoices: List[Dict]) -> List[str]:
        """
        Check recipients against sanctions lists
        In production, this would call OFAC/UN sanctions APIs
        For demo, we pass all checks
        """

        # Simulated sanctions check
        # In production: await sanctions_api.check_batch([inv["recipient"] for inv in invoices])

        return []  # No sanctions issues in demo

    async def _generate_reasoning(
        self,
        total_invoices: int,
        issues_found: int,
        passed: bool,
        rules: str
    ) -> str:
        """Generate compliance check reasoning"""

        status = "Passed" if passed else "Failed"

        prompt = f"""You are the Gatekeeper Agent. Explain your compliance check:

Checked {total_invoices} invoices in {rules} mode.
Issues found: {issues_found}
Overall status: {status}

Explain what you checked and the result in 2 sentences."""

        message = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=150,
            messages=[{"role": "user", "content": prompt}]
        )

        return message.content[0].text.strip()

    async def audit_trail(self, state: AgentState) -> Dict[str, Any]:
        """
        Generate audit trail for the payroll run
        """

        audit = {
            "timestamp": state.actions[0].timestamp.isoformat() if state.actions else None,
            "total_actions": len(state.actions),
            "agents_involved": list(set(a.agent for a in state.actions)),
            "compliance_passed": state.compliance_passed,
            "invoices_processed": len(state.invoices),
            "transactions_executed": len(state.transactions),
            "total_amount": sum(t.amount for t in state.transactions),
            "actions_log": [
                {
                    "agent": a.agent,
                    "action": a.action,
                    "reasoning": a.reasoning,
                    "timestamp": a.timestamp.isoformat()
                }
                for a in state.actions
            ]
        }

        # Log action
        action = AgentAction(
            agent="gatekeeper",
            action="generate_audit_trail",
            reasoning=f"Generated audit trail with {len(state.actions)} actions",
            tools_called=[]
        )

        state.actions.append(action)

        return audit
