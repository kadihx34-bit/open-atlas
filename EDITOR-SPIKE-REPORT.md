

## Live built-in AI pilot result

A single live built-in LLM request was initiated from the editor through the server-side `ai.generatePatch` procedure. Model selection came from the live owner catalog: `gpt-6-luna` was chosen as the lowest-cost non-deprecated catalog model supporting structured JSON Schema. The request was constrained to one call, minimal reasoning, and a 1,200-token completion cap; no external API key, Wiro, image provider, MCP call, or subscription was used.

The returned response did **not** produce an ODA patch that reached the editor history, so there is no valid AI-generated Lunatic post to claim or export. The second click was blocked before any model call with the visible message `Built-in AI pilot budget reached; no further LLM request was made`, proving the one-call guard. The first failed attempt did not expose token usage in the client because the request failed before a structured patch result was returned; exact USD consumed and remaining free allowance are therefore **DENENMELİ in Usage & Billing > Websites & games** before any further attempt. Do not run another model request until that billing state and the structured-response failure are inspected.

Evidence screenshot for the budget guard: `/home/ubuntu/screenshots/3000-il9yojhtwmwpktl_2026-11-08_11-21-33_6614.webp`.

Status: live AI wiring exists, but successful editable Lunatic post generation and export are **not proven**. Mock AI remains explicitly labeled as mock. The prior checkpoint remains preserved at `7854b305`; this live pilot code is being pushed separately with the failed-pilot status documented.
