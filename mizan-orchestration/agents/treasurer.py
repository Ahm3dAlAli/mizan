"""
Treasurer Agent
Part of Mizan extension to ArcPay

Checks balances and optimizes routing
"""

from typing import Dict, Any
from anthropic import Anthropic
from models import AgentState, AgentAction


class TreasurerAgent:
    """Manages treasury and routing optimization"""

    def __init__(self, anthropic_client: Anthropic):
        self.client = anthropic_client

    async def check_balance(self, state: AgentState) -> Dict[str, Any]:
        """
        Check if we have sufficient balance for payroll
        """

        # Calculate total required
        valid_invoices = [inv for inv in state.classified_invoices if inv["valid"]]
        total_required = sum(inv["amount"] for inv in valid_invoices)

        # In production, this would call ArcPay to get real balance
        # For demo, we'll simulate sufficient balance
        current_balance = 100000.0  # Demo: $100k treasury

        # Add 5% buffer for fees
        total_with_buffer = total_required * 1.05

        is_sufficient = current_balance >= total_with_buffer

        reasoning = await self._generate_reasoning(
            current_balance,
            total_required,
            total_with_buffer,
            is_sufficient
        )

        # Log action
        action = AgentAction(
            agent="treasurer",
            action="check_balance",
            reasoning=reasoning,
            tools_called=["arcpay.getBalance"],
            metadata={
                "balance": current_balance,
                "required": total_required,
                "with_buffer": total_with_buffer,
                "sufficient": is_sufficient
            }
        )

        state.actions.append(action)
        state.balance = current_balance
        state.balance_sufficient = is_sufficient

        return {
            "balance": current_balance,
            "sufficient": is_sufficient,
            "reasoning": reasoning
        }

    async def optimize_routing(self, state: AgentState) -> Dict[str, Any]:
        """
        Determine optimal routing for each payment
        """

        routing_plan = []

        for inv in state.classified_invoices:
            if not inv["valid"]:
                continue

            # Determine routing strategy
            route = self._determine_route(inv["corridor"], inv["amount"])

            routing_plan.append({
                "invoice_id": inv["invoice_id"],
                "corridor": inv["corridor"],
                "chain": route["chain"],
                "method": route["method"],
                "estimated_fee": route["estimated_fee"],
                "estimated_time": route["estimated_time"]
            })

        # Group by routing method
        methods = {}
        for route in routing_plan:
            method = route["method"]
            methods[method] = methods.get(method, 0) + 1

        reasoning = await self._generate_routing_reasoning(
            len(routing_plan),
            methods,
            state.classified_invoices
        )

        # Log action
        action = AgentAction(
            agent="treasurer",
            action="optimize_routing",
            reasoning=reasoning,
            tools_called=["corridor_resolver", "gas_estimator"],
            metadata={
                "routes": len(routing_plan),
                "methods": methods
            }
        )

        state.actions.append(action)
        state.routing_plan = routing_plan

        return {
            "routing_plan": routing_plan,
            "reasoning": reasoning
        }

    def _determine_route(self, corridor: str, amount: float) -> Dict[str, Any]:
        """Determine best route for a payment"""

        # Default: Arc direct transfer (fastest, cheapest)
        return {
            "chain": "arc",
            "method": "direct",
            "estimated_fee": amount * 0.01,  # 1%
            "estimated_time": 3.0  # 3 seconds
        }

    async def _generate_reasoning(
        self,
        balance: float,
        required: float,
        with_buffer: float,
        sufficient: bool
    ) -> str:
        """Generate balance check reasoning"""

        status = "sufficient" if sufficient else "insufficient"

        prompt = f"""You are the Treasurer Agent. Explain your balance check:

Current treasury: ${balance:,.2f}
Required for payroll: ${required:,.2f}
With 5% fee buffer: ${with_buffer:,.2f}
Status: {status}

Explain in 1-2 sentences."""

        message = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=150,
            messages=[{"role": "user", "content": prompt}]
        )

        return message.content[0].text.strip()

    async def _generate_routing_reasoning(
        self,
        total_routes: int,
        methods: Dict[str, int],
        invoices: list
    ) -> str:
        """Generate routing optimization reasoning"""

        prompt = f"""You are the Treasurer Agent. Explain your routing optimization:

Optimized {total_routes} payment routes:
{methods}

Explain your routing strategy in 2 sentences. Mention if you used CCTP or direct transfers."""

        message = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=150,
            messages=[{"role": "user", "content": prompt}]
        )

        return message.content[0].text.strip()
