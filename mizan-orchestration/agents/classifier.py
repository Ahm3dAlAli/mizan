"""
Classifier Agent
Part of Mizan extension to ArcPay

Analyzes invoices and extracts payment data
"""

from typing import Dict, Any, List
from anthropic import Anthropic
from models import AgentState, AgentAction, Invoice


class ClassifierAgent:
    """Classifies and validates invoices"""

    def __init__(self, anthropic_client: Anthropic):
        self.client = anthropic_client

    async def classify(self, state: AgentState) -> Dict[str, Any]:
        """
        Classify invoices and determine corridors
        """

        classified = []

        for invoice in state.invoices:
            # Determine corridor
            corridor = self._determine_corridor(invoice.country)

            # Validate invoice
            is_valid, validation_msg = self._validate_invoice(invoice)

            classified.append({
                "invoice_id": invoice.id or f"inv_{invoice.recipient}",
                "recipient": invoice.recipient,
                "amount": invoice.amount,
                "country": invoice.country,
                "corridor": corridor,
                "valid": is_valid,
                "validation_message": validation_msg,
                "email": invoice.email,
                "memo": invoice.memo
            })

        # Use Claude to generate classification reasoning
        valid_count = sum(1 for c in classified if c["valid"])
        invalid_count = len(classified) - valid_count

        corridors_used = list(set(c["corridor"] for c in classified if c["valid"]))

        reasoning = await self._generate_reasoning(
            len(classified),
            valid_count,
            invalid_count,
            corridors_used,
            state.rules
        )

        # Log action
        action = AgentAction(
            agent="classifier",
            action="classify_invoices",
            reasoning=reasoning,
            tools_called=["corridor_resolver", "invoice_validator"],
            metadata={
                "total": len(classified),
                "valid": valid_count,
                "invalid": invalid_count,
                "corridors": corridors_used
            }
        )

        state.actions.append(action)
        state.classified_invoices = classified

        return {
            "classified_invoices": classified,
            "reasoning": reasoning
        }

    def _determine_corridor(self, country: str) -> str:
        """Map country code to corridor ID"""
        corridor_map = {
            "PH": "uae-to-philippines",
            "IN": "uae-to-india",
            "EG": "uae-to-egypt",
            "PK": "uae-to-pakistan",
            "NG": "uae-to-nigeria"
        }
        return corridor_map.get(country.upper(), "unknown")

    def _validate_invoice(self, invoice: Invoice) -> tuple[bool, str]:
        """Validate invoice data"""

        # Check required fields
        if not invoice.recipient:
            return False, "Missing recipient address"

        if invoice.amount <= 0:
            return False, "Invalid amount"

        if not invoice.country:
            return False, "Missing country"

        # Check if corridor exists
        corridor = self._determine_corridor(invoice.country)
        if corridor == "unknown":
            return False, f"Unsupported corridor for country {invoice.country}"

        return True, "Valid"

    async def _generate_reasoning(
        self,
        total: int,
        valid: int,
        invalid: int,
        corridors: List[str],
        rules: str
    ) -> str:
        """Generate classification reasoning using Claude"""

        prompt = f"""You are the Classifier Agent. Summarize your classification work:

Processed {total} invoices:
- Valid: {valid}
- Invalid: {invalid}
- Corridors identified: {corridors}
- Rules mode: {rules}

Explain what you did in 2 sentences. Be specific about any exclusions."""

        message = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=200,
            messages=[{"role": "user", "content": prompt}]
        )

        return message.content[0].text.strip()
