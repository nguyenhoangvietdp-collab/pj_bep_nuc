# Problem signature: first-visit comprehension

A person with an unfamiliar goal encounters many choices and explanations before understanding prerequisites and the next action. Required and optional information compete for attention; revealing details at the decision where they matter may reduce search effort, provided the entry points and critical conditions remain visible. That mechanism is a hypothesis, not a measured result.

## Constraints

| Type | Constraint and basis | When it could change |
|---|---|---|
| Hard within this review | Preserve approval, prices, voucher eligibility, quote expiry, manual payment confirmation, and pickup rules. These are implemented transaction states in `app/components/market.tsx` and the domain layer. | A separately authorized product/business change with corresponding implementation and validation. |
| Hard within this review | Keep material price qualifications, pickup requirements, and safety information available before commitment. | Their placement may change; the requirement for informed decisions remains. |
| Soft | Showing all filters before meals, repeating voucher explanations, and placing orientation in the footer. Source code makes these presentation choices explicit. | Can change through content grouping and a simple disclosure control. |
| Hidden hypothesis | Every newcomer needs detailed discount mechanics immediately. Current presentation is consistent with this assumption, but no user evidence establishes it. | Task observation may show users first need meal suitability and price. |
| Hidden hypothesis | Less visible text always improves usability. No local evidence establishes this. | Reject if required information or secondary controls become harder to find. |

## Reformulation

Optimize successful first decisions with correct comprehension, rather than total information visible or the shortest page. Let Y be unassisted task success with correct price, eligibility, and pickup understanding; let F be perceived overload. A proposed experiment targets E[Y(simple) - Y(current)] and E[F(simple) - F(current)] for first-time target users, with unchanged catalogue, prices, rules, and comparable test conditions. No effects have been estimated.

Use the decision stage as the unit of design: orient, choose, confirm, pay, collect. Keep related comparison information together; explain optional mechanics when requested. A formative study can diagnose problems; a causal effect claim requires an adequately designed and powered comparison.

## Transfer candidates and simplicity

1. Software settings: core controls plus a labeled secondary set. Transfer the dependency between current goal and needed control.
2. Public-service forms: prerequisites and required fields visible; exceptional help available on request. Transfer the distinction between universal and conditional information.
3. Accessible document navigation: brief outline, descriptive headings, explicit instruction steps. Transfer the relationship between summary, destination, and action.

Evidence and failure conditions are in `structural_mapping.csv`. Choose plain content ordering and one optional disclosure before personalization, an AI guide, or a mandatory wizard. The latter proposals lack local evidence and introduce additional behavior to validate.

## Adjacent possible and Janusian tradeoff

The present application already has separate meal, checkout, and order views, plus native details elements. This permits contextual explanations without a new platform or a new data source (`app/components/market.tsx`). There is no verified 6–18 month technology event that makes this approach newly possible, and no why-now novelty claim.

The apparent conflict is completeness versus a calm first visit. A summary and reachable supplement can preserve completeness while reducing initial exposure. The conflict returns when a required condition is hidden, so price, approval, pickup, and payment states are boundaries of the proposal.

## Gates 3–5

- Gate 3: the signature uses general entities, relations, and a proposed mechanism. External expert confirmation has not been obtained.
- Gate 4: useful guidance was opened and checked, but verified domain-transfer novelty and local effectiveness are absent. Not passed as a research-novelty gate.
- Gate 5: qualitative fit is promising and testable; no validated score or novelty evidence supports the required 22/30 threshold. Not passed as an academic gate. Suitable as a provisional product hypothesis only.

Stakeholder tradeoff: newcomers may benefit from less initial complexity; returning users may dislike an extra filter click. Retain direct access to common tasks and test both groups before a broad release. No participant evidence currently resolves this tradeoff.
