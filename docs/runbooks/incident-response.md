# UniversiTEA — Incident Response Runbook

## Reporting a security issue

Email: `the.compstud.guy@universitea.shop`

Please include (when possible):
- what you found and why it matters,
- clear reproduction steps or a PoC,
- affected URLs/screens, environments, versions/commits,
- any data exposure indicators (PII, tokens, auth/session info),
- your contact info + preferred disclosure timeline.

## Scope

This runbook covers security and privacy incidents affecting UniversiTEA, including the Telegram Mini App front-end and any connected services that process or store user content.

## Roles (small team default)

- Incident commander: Maintainer on-call
- Investigator(s): Maintainer + any assigned engineer(s)
- Comms owner: Maintainer (or delegate)

## Severity guide

- **SEV0 (Critical):** active exploitation, credential/token leakage, large-scale PII exposure, unauthorized admin/mod access.
- **SEV1 (High):** likely exploitable vuln, limited PII exposure, broken auth boundaries, content integrity compromise.
- **SEV2 (Medium/Low):** non-exploitable bug, defense-in-depth gaps, minor misconfigurations.

## Response workflow

1. **Acknowledge & log**
   - Confirm receipt to reporter (if applicable).
   - Create a private tracking ticket with timestamps and initial notes.
2. **Triage**
   - Determine impact, scope, and severity.
   - Identify affected components and current exploitability.
3. **Contain**
   - Disable/flag features, rotate secrets, revoke sessions/tokens, block abusive actors, or temporarily take components offline as needed.
4. **Eradicate & fix**
   - Patch root cause, add regression tests where possible, and review adjacent risks.
5. **Recover**
   - Deploy fixes, monitor for recurrence, and validate that containment can be rolled back safely.
6. **Communicate**
   - Decide whether user notification is required (especially for PII exposure).
   - Coordinate any platform-level actions (e.g., Telegram bot/Mini App config changes) if relevant.
7. **Post-incident**
   - Write a brief postmortem (what happened, impact, root cause, actions, follow-ups).
   - Update relevant docs (ADR/moderation policy/runbooks) and backlog long-term improvements.

## Evidence & data handling

- Minimize access to sensitive logs/data; restrict to responders.
- Store incident artifacts securely and delete what you no longer need.
- Avoid copying PII into tickets; use redactions and references instead.

