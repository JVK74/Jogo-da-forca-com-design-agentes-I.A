---
name: game-development
description: "Use when implementing the cooperative multiplayer Hangman frontend or backend, game rules, WebSocket protocol, Cloudflare Workers, Durable Objects, optional Google authentication, or secure room behavior."
---

# Game Development

Use this Skill for scoped implementation work on the cooperative Hangman game. Follow the current project plan and keep browser presentation separate from server-authoritative gameplay.

## Procedure

1. Read `.github/copilot-instructions.md`, `docs/PLANO.md`, and relevant implementation/tests before editing.
2. Confirm expected behavior, affected modules, existing patterns, dependencies, and security implications.
3. Keep semantic HTML/CSS/client rendering separate from pure game rules, Worker routes, shared protocol, Durable Object room state, and authentication/data modules.
4. Treat the Durable Object as the authority for each room. Validate every HTTP/WebSocket action on the server; serialize concurrent guesses and broadcast only the resulting public state.
5. Keep the answer secret on the server until the game ends. Never trust client-supplied identity, room state, result, or guess count.
6. Preserve guest play and the 2-6 player limit. Any connected player may guess. Preserve the approved 10-minute expiration for rooms with no connected players.
7. Normalize guesses without accents while retaining the original spelling for display. Keep the word corpus server-side; do not expose it in public assets.
8. Use persistent Durable Object storage and WebSocket Hibernation when appropriate without losing room state, player association, or reconnect behavior.
9. Implement optional Google OAuth/OIDC and D1 integration only within requested scope. Validate callbacks/sessions and keep secrets out of client code and Git.
10. Preserve keyboard access, visible focus, useful screen-reader announcements, readable contrast, responsive layouts, and Brazilian Portuguese text.
11. Add/update focused tests with implementation; run relevant checks and report actual commands/results. Explain decisions, files changed, deviations, and remaining limitations.

## Examples

- Use for: “Implemente o envio e a sincronização de palpites de uma sala com até seis jogadores.”
- Use for: “Adicione reconexão WebSocket sem revelar a palavra secreta.”
- Use for: “Integre login Google opcional e persista estatísticas mínimas em D1.”
- Do not use for: “Investigue uma falha nos testes sem alterar código”; use `testing-debugging`.
