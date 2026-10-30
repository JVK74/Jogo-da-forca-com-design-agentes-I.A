---
name: game-development
description: "Use when implementing or changing the Portuguese Hangman game's rules, interface, styling, or agent integration. Follow docs/PLANO.md and the project's HTML, CSS, JavaScript, and Vite architecture."
---

# Game Development

Use this Skill for scoped implementation work on the Hangman game. Keep the game rules, user interface, and presentation styles separated according to the current project plan.

## Procedure

1. Read `.github/copilot-instructions.md` and `docs/PLANO.md`; inspect the relevant code before editing.
2. Confirm the requested behavior and identify affected files, existing conventions, and any dependencies.
3. Keep game state and rules separate from DOM interaction and CSS. If implementing an AI agent, keep its policy separate from the game rules and interface.
4. Implement only the requested behavior with semantic HTML, organized JavaScript modules, and responsive CSS as appropriate to the existing Vite setup.
5. Preserve keyboard access, visible focus, meaningful status announcements, readable contrast, and Brazilian Portuguese interface text.
6. Avoid new technologies and dependencies unless they are justified for the request; explain material deviations from `docs/PLANO.md`.
7. Run the relevant checks available in the repository. Do not claim checks passed unless they were actually run.
8. Summarize the behavior and files changed, checks performed and their real results, and any remaining limitations.

## Examples

- Use for: “Implemente um botão para reiniciar a partida, mantendo a navegação por teclado.”
- Use for: “Separe a lógica do agente de palpites da atualização da interface.”
- Do not use for: “Descubra por que um teste falha e valide a correção”; use `testing-debugging` instead.
