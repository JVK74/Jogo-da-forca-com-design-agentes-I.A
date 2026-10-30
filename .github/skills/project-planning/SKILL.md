---
name: project-planning
description: "Use when analyzing project requirements, planning implementation steps, checking dependencies and risks, or defining completion criteria for the Hangman game. Planning only: do not implement features."
---

# Project Planning

Use this Skill to turn a request about the project into a scoped, actionable plan. Do not edit application code or implement features when the request is exclusively for planning.

## Procedure

1. Read `.github/copilot-instructions.md` and `docs/PLANO.md` before planning.
2. Restate the requested outcome and identify what is in scope and out of scope.
3. Inspect only the relevant repository files to understand the current state; distinguish observations from assumptions.
4. Break the work into ordered, appropriately sized steps. Note dependencies between steps.
5. Identify relevant risks, unresolved decisions, and likely compatibility or accessibility concerns.
6. Define observable acceptance criteria that can be checked when implementation is complete.
7. Present the plan, assumptions, dependencies, risks, and criteria. Ask for clarification only when an unresolved decision blocks a useful plan.
8. If implementation is requested as well as planning, keep the plan distinct and proceed only within the implementation scope explicitly requested.

## Examples

- Use for: “Planeje a implementação da tela de partida e liste critérios de aceitação.”
- Use for: “Analise os requisitos para adicionar um agente que sugere palpites, sem alterar arquivos.”
- Do not use for: “Implemente o tratamento de letras repetidas”; use `game-development` instead.
