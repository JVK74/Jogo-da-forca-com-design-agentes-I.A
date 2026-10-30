---
name: project-planning
description: "Use when analyzing requirements, planning multiplayer rooms, optional Google OAuth, Cloudflare Workers architecture, dependencies, risks, implementation phases, or acceptance criteria for this Hangman project. Planning only: do not implement features."
---

# Project Planning

Use this Skill to turn a project request into a scoped, actionable plan aligned with the approved multiplayer architecture.

## Procedure

1. Read `.github/copilot-instructions.md` and `docs/PLANO.md` before planning.
2. Restate the requested outcome, scope, exclusions, and relevant approved decisions: cooperative rooms for 2-6 players, guest access, optional Google OAuth/OIDC, Workers/Vite, Durable Objects/WebSockets with persistent room state, D1, Wrangler, 1,200+ valid words, accent-insensitive guesses, and 10-minute empty-room expiration.
3. Inspect only relevant files and distinguish repository facts from assumptions. Do not treat proposed structure as implemented code.
4. Identify dependencies and risks across frontend, Worker APIs, room state/protocol, authentication, D1, word corpus, tests, and Cloudflare release.
5. Organize work into ordered phases, prioritizing a working local multiplayer game before optional login and public deployment.
6. Define observable acceptance criteria for each requested capability, including authorization prerequisites for production work.
7. Highlight unresolved game decisions (for example, miss limit, room start/abandon behavior) without reopening decisions already approved.
8. Present the plan, rationale, risks, and dependencies. Ask concise questions only when an unresolved choice blocks a useful plan.
9. Do not edit files or implement functionality when the request is exclusively planning.

## Examples

- Use for: “Planeje a entrega local de salas cooperativas usando Durable Objects e WebSockets.”
- Use for: “Revise dependências e critérios para adicionar login Google opcional e estatísticas em D1.”
- Do not use for: “Implemente a reconexão WebSocket”; use `game-development` instead.
