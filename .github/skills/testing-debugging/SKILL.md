---
name: testing-debugging
description: "Use when auditing or testing Hangman rules, multiplayer clients, concurrent guesses, WebSocket reconnects, OAuth/session behavior, word-corpus validation, or room security without editing files."
---

# Testing and Debugging

Use this Skill for read-only auditing, test execution, and diagnosis of the multiplayer Hangman project. This Skill is used by the Tester agent, which must not modify files.

## Procedure

1. Read `.github/copilot-instructions.md` and `docs/PLANO.md`; inspect the relevant code, tests, configuration, and available local environment.
2. Convert the report or requirement into explicit expected behavior and read-only checks. Distinguish findings from assumptions.
3. Audit game rules and invalid input, including accent normalization, repeated guesses, win/loss, and the 5-12 letter constraints.
4. Run existing safe, relevant tests. For multiplayer, use multiple clients to check room capacity (2-6), state synchronization, duplicate/concurrent guesses, reconnects, persistence, and 10-minute empty-room expiration where the environment permits.
5. Inspect WebSocket and HTTP authorization, untrusted message validation, rate/size limits, room code handling, and whether secret words are excluded from pre-completion messages, assets, and logs.
6. Check optional Google OAuth/OIDC callbacks, state/nonce/session protections, guest access, D1 persistence boundaries, and that no secrets are exposed. Do not authenticate against real accounts.
7. Run the existing word validator, if available, and report actual total, uniqueness, length/normalization failures, source/licensing limitations, and whether at least 1,200 valid entries are verified.
8. Do not create or edit tests/files. If coverage is missing or a fix is needed, report the exact suggested cases and hand findings to Developer.
9. Report commands executed and actual outcomes; identify unavailable tests, local-vs-production limits, and remaining uncertainty.

## Examples

- Use for: “Audite se dois clientes enviando a mesma letra ao mesmo tempo consomem uma tentativa uma vez.”
- Use for: “Verifique reconexão, expiração da sala e se a palavra aparece antes do fim.”
- Use for: “Valide o corpus e confira o fluxo OAuth sem usar contas reais.”
- Do not use for: “Crie testes para cobrir a concorrência”; Tester é somente leitura, então peça ao `game-development` a implementação dos testes.
