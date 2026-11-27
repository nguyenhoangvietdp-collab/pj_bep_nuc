# Working on Bếp Núc

- Read [the website handoff](bep-nuc/docs/website-handoff.md) before changing the site. The active application is `bep-nuc/`. `apps/buachot-pilot/` is its earlier predecessor.
- Public commerce runs on Cloudflare Workers from `bep-nuc/mvp-site/` with the Supabase Edge Function in `bep-nuc/supabase/functions/bep-nuc/`. The Next.js app in `bep-nuc/app/` provides a local demo and shared UI components. GitHub Pages builds from `bep-nuc/pages-site/` and links to the Workers app.
- Keep **self-pickup for extra savings** visible where customers compare receiving options. Separate the base voucher, pickup support, delivery fee and delivery support. Label estimates as estimates. The server determines eligibility and the final amount.
- Keep price, stock, voucher budget, quote acceptance, payment and settlement rules in the shared domain and server handlers. Preserve existing quote and order snapshots. Use the relevant tests plus the Workers build when changing shared commerce flows.
- Reuse the assigned worktree. For parallel changes, agree on file ownership or use separate worktrees. Test with the local demo or staging. Keep production credentials and data out of source. Never run the local demo against production Postgres. Use the release procedure in the handoff when deployment is in scope.
