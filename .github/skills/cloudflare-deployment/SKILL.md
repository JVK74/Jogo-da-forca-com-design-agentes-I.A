---
name: cloudflare-deployment
description: "Use when assessing Cloudflare Pages compatibility, preparing deployment configuration, explaining Wrangler setup and commands, or diagnosing build and deploy issues for this project."
---

# Cloudflare Deployment

Use this Skill for Cloudflare Pages and Wrangler planning, configuration, and troubleshooting. The project plan proposes a static Vite build; confirm the current architecture and build output before recommending deployment settings.

## Procedure

1. Read `.github/copilot-instructions.md` and `docs/PLANO.md`; inspect the package scripts, Vite configuration, and current deployment files if they exist.
2. Determine whether the project is static or requires server-side functionality. For a static Vite site, verify the build command and output directory from the actual configuration rather than assuming defaults.
3. Check current Cloudflare Pages and Wrangler requirements against official Cloudflare documentation when needed. Distinguish documented facts from repository-specific findings.
4. Explain the required configuration and the purpose of each proposed change before applying it. Avoid adding a Worker or other infrastructure unless the architecture requires it.
5. Explain Wrangler installation and local development/build commands. Do not install dependencies unless explicitly requested and appropriate for the task.
6. Before any action involving Cloudflare authentication, account settings, or publishing, obtain explicit authorization for that specific action. Without it, provide instructions or prepare only locally scoped, non-account changes that were requested.
7. For deployment troubleshooting, inspect build output, configuration, and logs available to the user; make only focused changes and re-check the relevant build or validation command.
8. Summarize configuration changes, commands actually run and their results, remaining risks, and any steps that still require user authorization.

## Examples

- Use for: “Confira se a saída atual do Vite pode ser publicada no Cloudflare Pages.”
- Use for: “Explique como instalar e usar o Wrangler para testar localmente.”
- Use for: “Investigue por que o build do Pages não encontra a pasta de saída.”
- Do not use for: “Faça login na Cloudflare e publique o site”; never perform these actions without explicit authorization.
