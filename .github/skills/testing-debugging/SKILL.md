---
name: testing-debugging
description: "Use when investigating, reproducing, testing, or fixing bugs in the Hangman game, including game rules, invalid input, and unexpected states."
---

# Testing and Debugging

Use this Skill to diagnose a concrete behavior, verify game logic, and make a focused correction when appropriate. Keep investigation and validation limited to the reported problem.

## Procedure

1. Read `.github/copilot-instructions.md` and `docs/PLANO.md`; inspect the relevant implementation and test setup.
2. Turn the report into a minimal, observable reproduction. If it cannot be reproduced, state what was checked and what information is missing.
3. Identify the expected and actual behavior, then trace the smallest relevant path through the rules, interface, and tests.
4. Add or update a focused test that captures the defect, including invalid input or unexpected states where relevant.
5. Run the narrowest applicable test or check and report its actual result. Do not imply that unrun tests passed.
6. If a fix is in scope, make the smallest change that addresses the cause without modifying unrelated behavior.
7. Re-run the regression test and other directly relevant checks; report commands, results, and any remaining uncertainty.

## Examples

- Use for: “A mesma letra está consumindo duas tentativas; reproduza e corrija.”
- Use for: “Teste a vitória, a derrota e a entrada de caracteres inválidos.”
- Do not use for: “Crie a primeira versão completa da interface”; use `game-development` instead.
