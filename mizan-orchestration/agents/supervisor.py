"""
Supervisor Agent
Part of Mizan extension to ArcPay

Routes requests and coordinates workflow between specialist agents
"""

from typing import Dict, Any
from datetime import datetime
from anthropic import Anthropic
from models import AgentState, AgentAction


class SupervisorAgent:
    """Coordinates multi-agent workflow"""

    def __init__(self, anthropic_client: Anthropic):
        self.client = anthropic_client

    async def route(self, state: AgentState) -> Dict[str, Any]:
        """
        Analyze request and determine workflow routing
        """

        prompt = f"""You are the Supervisor Agent in Mizan, an agentic payment infrastructure for SMEs.

Your job: Analyze this payroll request and determine the workflow routing.

Request:
- Invoices: {len(state.invoices)} payments
- Total recipients: {len(set(i.recipient for i in state.invoices))}
- Countries: {list(set(i.country for i in state.invoices))}
- Total amount: ${sum(i.amount for i in state.invoices):.2f}
- Rules: {state.rules}
- Dry run: {state.dry_run}

Determine:
1. Should we proceed with classification? (Yes if invoices present)
2. Are there any immediate blockers? (No if basic validation passes)
3. What's the recommended workflow path?

Respond in this format:
DECISION: [PROCEED/BLOCK]
NEXT_STEP: [CLASSIFIER/ERROR]
REASONING: [Your reasoning in 2-3 sentences]
"""

        message = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=500,
            messages=[{"role": "user", "content": prompt}]
        )

        response = message.content[0].text

        # Parse response
        decision = "PROCEED" if "DECISION: PROCEED" in response else "BLOCK"
        next_step = "classifier" if decision == "PROCEED" else "error"

        # Extract reasoning
        reasoning_lines = [line for line in response.split('\n') if line.startswith("REASONING:")]
        reasoning = reasoning_lines[0].replace("REASONING:", "").strip() if reasoning_lines else response

        # Log action
        action = AgentAction(
            agent="supervisor",
            action="route_request",
            reasoning=reasoning,
            tools_called=[],
            metadata={"decision": decision, "next_step": next_step}
        )

        state.actions.append(action)

        return {
            "next_step": next_step,
            "reasoning": reasoning
        }

    async def summarize(self, state: AgentState) -> str:
        """
        Generate final summary of payroll run
        """

        successful_txs = [t for t in state.transactions if t.status == "success"]
        failed_txs = [t for t in state.transactions if t.status != "success"]

        prompt = f"""Summarize this payroll run in 2-3 sentences.

Results:
- Total invoices: {len(state.invoices)}
- Successful payments: {len(successful_txs)}
- Failed payments: {len(failed_txs)}
- Corridors used: {list(set(t.corridor for t in state.transactions))}
- Chains used: {list(set(t.chain for t in state.transactions))}
- Total amount: ${sum(t.amount for t in successful_txs):.2f}
- Average settlement: {sum(t.settlement_time for t in successful_txs) / len(successful_txs) if successful_txs else 0:.1f}s

Agent actions taken: {len(state.actions)}

Write a concise executive summary."""

        message = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=300,
            messages=[{"role": "user", "content": prompt}]
        )

        summary = message.content[0].text.strip()

        # Log action
        action = AgentAction(
            agent="supervisor",
            action="summarize",
            reasoning=summary,
            tools_called=[]
        )

        state.actions.append(action)
        state.reasoning = summary

        return summary
