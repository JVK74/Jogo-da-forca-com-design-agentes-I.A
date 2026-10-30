---
name: cloudflare-deployment
description: "Use when configuring or troubleshooting the Cloudflare Vite plugin, Workers, Durable Objects, WebSockets and Hibernation, D1 migrations, Wrangler environments, secrets, or authorized publication of this multiplayer game."
---

# Cloudflare Deployment

Use this Skill to prepare, validate, and explain the Cloudflare runtime for the cooperative multiplayer game. Confirm actual scripts and configuration; do not assume defaults.

## Procedure

1. Read `.github/copilot-instructions.md` and `docs/PLANO.md`; inspect the Vite config, package scripts, Wrangler config, migrations, bindings, and Worker/DO implementation that exist.
2. Verify current requirements against official Cloudflare documentation when needed. Distinguish documented platform behavior from repository-specific findings.
3. Check Vite integration with the official Cloudflare Workers Vite plugin, Worker asset serving/routing, local development, build output, and supported Wrangler commands.
4. Review Durable Object class bindings/migrations, persistent storage, WebSocket upgrade/routing, Hibernation callbacks and attachments, and empty-room expiration alarms. Keep each room's state authoritative in its DO.
5. Review D1 bindings and SQL migrations for profiles, sessions, and authenticated-user statistics. Explain migration order and safe local validation; never assume production data is disposable.
6. Prepare Wrangler configuration and local instructions only for the requested scope. Explain each binding, migration, environment, and change before editing.
7. Keep Google OAuth/OIDC credentials in Cloudflare Secrets, not vars, frontend assets, repository files, or logs. Explain local secret setup without requesting or displaying secret values.
8. Run only authorized local checks and report exact commands/results. Do not equate local validation with a production deployment.
9. Before Cloudflare login, account/resource changes, or deployment, require explicit authorization for that specific action. A request to prepare configuration is not authorization to authenticate or publish.
10. Summarize changes, decisions, documentation consulted, validation, outstanding risks, and authorization-dependent next steps.

## Examples

- Use for: “Configure local Wrangler bindings for the room Durable Object and D1.”
- Use for: “Review WebSocket Hibernation and Durable Object migration settings.”
- Use for: “Prepare D1 migrations and instructions for Google OAuth secrets without logging in.”
- Use for: “After explicit authorization, publish the Worker and verify the public URL.”
- Do not use for: “Log in to Google or Cloudflare without authorization”; never perform it.
