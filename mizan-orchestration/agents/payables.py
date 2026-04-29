"""
Payables Agent
Part of Mizan extension to ArcPay

Executes payments via ArcPay
"""

from typing import Dict, Any
import time
from anthropic import Anthropic
from models import AgentState, AgentAction, TransactionResult


class PayablesAgent:
    """Executes payments"""

    def __init__(self, anthropic_client: Anthropic):
        self.client = anthropic_client

    async def execute_payments(self, state: AgentState) -> Dict[str, Any]:
        """
        Execute all approved payments
        """

        transactions = []
        successful = 0
        failed = 0

        for route in state.routing_plan:
            # Find corresponding invoice
            invoice = next(
                (inv for inv in state.classified_invoices
                 if inv["invoice_id"] == route["invoice_id"]),
                None
            )

            if not invoice:
                continue

            # Execute payment (or simulate in dry run mode)
            tx_result = await self._execute_single_payment(
                invoice,
                route,
                state.dry_run
            )

            transactions.append(tx_result)

            if tx_result.status == "success":
                successful += 1
            else:
                failed += 1

        reasoning = await self._generate_reasoning(
            len(transactions),
            successful,
            failed,
            state.dry_run
        )

        # Log action
        action = AgentAction(
            agent="payables",
            action="execute_payments",
            reasoning=reasoning,
            tools_called=["arcpay.sendUSDC", "corridor.pay"],
            metadata={
                "total": len(transactions),
                "successful": successful,
                "failed": failed,
                "dry_run": state.dry_run
            }
        )

        state.actions.append(action)
        state.transactions = transactions

        return {
            "transactions": transactions,
            "successful": successful,
            "failed": failed,
            "reasoning": reasoning
        }

    async def _execute_single_payment(
        self,
        invoice: Dict[str, Any],
        route: Dict[str, Any],
        dry_run: bool
    ) -> TransactionResult:
        """Execute a single payment"""

        start_time = time.time()

        if dry_run:
            # Simulate transaction
            tx_hash = f"0xdryrun_{invoice['invoice_id']}"
            settlement_time = 0.1
        else:
            # In production, this would call:
            # result = await arcpay.corridor(invoice['corridor']).pay({
            #     'to': invoice['recipient'],
            #     'amount': invoice['amount']
            # })

            # For demo, simulate successful transaction
            tx_hash = f"0xa3f{invoice['invoice_id'][-8:]}"
            time.sleep(0.1)  # Simulate network latency
            settlement_time = time.time() - start_time

        return TransactionResult(
            invoice_id=invoice["invoice_id"],
            recipient=invoice["recipient"],
            amount=invoice["amount"],
            corridor=invoice["corridor"],
            chain=route["chain"],
            tx_hash=tx_hash,
            status="success",
            fee=route["estimated_fee"],
            settlement_time=settlement_time
        )

    async def _generate_reasoning(
        self,
        total: int,
        successful: int,
        failed: int,
        dry_run: bool
    ) -> str:
        """Generate payment execution reasoning"""

        mode = "Simulated" if dry_run else "Executed"

        prompt = f"""You are the Payables Agent. Explain what you did:

{mode} {total} payments:
- Successful: {successful}
- Failed: {failed}
- Dry run mode: {dry_run}

Explain in 1-2 sentences."""

        message = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=150,
            messages=[{"role": "user", "content": prompt}]
        )

        return message.content[0].text.strip()
