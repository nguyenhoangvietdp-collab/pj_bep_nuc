# Bếp Núc: newcomer usability review

Date: 7 October 2026. Scope: the local Bếp Núc customer website, especially initial orientation and supplementary help. This is an expert review of source code, not an observed newcomer study. No connected browser was available; screenshots, viewport fit, keyboard behavior, and live interactions were not tested. Findings below describe the pre-change snapshot; the subsequent implementation is recorded at the end.

## Recommendation

Make the first visit answer three questions: What can I do here? Can I use it? What should I do next? Then let visitors browse meals. Put supplementary explanations near the decisions they explain. This is a design proposal, not a measured reduction in frustration.

Progressive disclosure presents core options first and secondary options on request. It requires a clear route to secondary controls and a careful choice of what remains visible. [S1](https://www.nngroup.com/articles/progressive-disclosure/)

## Findings from the current implementation

| Priority | Observation | Newcomer risk — inference | Proposed change |
|---|---|---|---|
| High | The homepage mentions student pilot vouchers; the explicit invited/approved-student ordering restriction appears at checkout. [Code](../../../app/components/market.tsx#L438), [checkout](../../../app/components/market.tsx#L699) | A visitor can invest time choosing a meal before discovering they cannot order. | A short, persistent homepage eligibility sentence. Browsing remains public. |
| High | Category buttons, shop selection, sorting, and two checkboxes precede results. [Code](../../../app/components/market.tsx#L465) | Visitors encounter configuration before seeing the available meals. | Keep search and category choices visible. Put the other controls in one clearly labeled “Bộ lọc” disclosure. Show active filter count and a reset action. |
| High | Meal cards combine menu price, base-discount price, and “sau giảm nền 5%, chưa gồm voucher.” [Code](../../../app/components/market.tsx#L575) | Visitors must interpret discount terminology before assessing affordability. | Emphasize one current displayed price, labeled “Giá chưa áp voucher.” Keep menu price subordinate. Explain discount calculation at checkout. |
| Medium | The voucher rates appear in the banner and rules reappear below the shops. [Code](../../../app/components/market.tsx#L438), [rules](../../../app/components/market.tsx#L621) | The promotion competes with choosing a meal and makes the page feel longer. | Explain available vouchers at checkout. Offer one optional “Voucher hoạt động thế nào?” help link. |
| Medium | The process explanation is collapsed in the footer. [Code](../../../app/components/market.tsx#L1020) | Someone unfamiliar with pickup ordering may miss the basic process. | Show a brief process outline near the introduction. Keep exceptions and expanded instructions in supplementary help. |
| Check visually | At widths below 700px the secondary banner paragraph is hidden; two meal columns remain until 360px. [CSS](../../../app/commerce.css#L669), [grid](../../../app/commerce.css#L692) | Essential copy placed in that paragraph would disappear; narrow cards might make comparison harder. | Place eligibility and pickup essentials in always-visible content. Compare one and two columns on actual mobile screens before deciding. |

Public browsing, a short meal-oriented headline, named buttons, and detailed meal information before continuing already support the proposed flow. These are present in the component; their effectiveness with newcomers remains unknown. [Code](../../../app/components/market.tsx#L313)

## Proposed website outline

### First layer: orientation and browsing

Suggested Vietnamese copy:

> **Tối nay, ăn gì?**
>
> Chọn bữa cuối ngày tại Hà Nội. Tự đến quán nhận theo giờ của món.
>
> Bạn có thể xem món ngay. Đặt bữa hiện dành cho sinh viên được mời và đã được duyệt.

Keep a short process outline visible: **Chọn món · Kiểm tra giá và thanh toán · Nhận tại quán**. Add a concise expectation: “Thanh toán bằng chuyển khoản, chờ xác nhận trước khi nhận bữa.” Each stage should link to relevant help, rather than require a tutorial before browsing. This copy is proposed and must remain accurate to the implemented pilot flow. [Current process](../../../app/components/market.tsx#L1024)

Follow with search, categories, a labeled filter disclosure, and meals. Each card should retain image/name, shop, displayed price with its qualification, pickup time, availability, and “Chọn món.” A whole-screen marketing introduction or mandatory onboarding tour is not proposed.

### Second layer: the selected meal and order

Keep address, pickup window, quantity, relevant allergy/storage information, and next action visible in meal details. At checkout keep eligibility status, estimated or confirmed total, selected voucher, and the next required action visible. Once a quote exists, keep its expiry and the distinction between holding a meal, creating an order, and confirmed payment explicit. These states already exist; change presentation without changing transaction rules. [Meal details](../../../app/components/market.tsx#L313), [checkout](../../../app/components/market.tsx#L649)

Present manual payment instructions as separate numbered actions. The W3C recommends separating instructions and stating each step explicitly. [S5](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o3p09-separated-instructions/)

### Third layer: supplements

Offer short summaries with descriptive links: “Cách nhận bữa,” “Voucher hoạt động thế nào?”, and “Hủy đơn và hoàn tiền.” Use one level of disclosure for optional detail. Keep essential payment and pickup requirements alongside the relevant action.

W3C guidance supports a brief outline before long material. GOV.UK recommends details for information only some users need, and warns against hiding information most users need. [S4](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o3p08-summary-provided/), [S2](https://design-system.service.gov.uk/components/details/)

Do not place every section inside an accordion: NN/G describes extra interaction cost and difficulty comparing related information across collapsed sections. [S3](https://www.nngroup.com/articles/accordions-on-desktop/)

## Acceptance questions and verdicts

| Question | Verdict | Evidence or remaining work |
|---|---|---|
| Is the basic purpose visible? | Answered from code | The headline and pickup copy introduce the meal task. Whether newcomers understand it requires testing. |
| Are prerequisites communicated before selecting a meal? | Answered: partly | Student vouchers appear early; explicit invited/approved ordering eligibility appears later. |
| Are optional mechanics exposed early? | Answered | Advanced filters and voucher rates/rules occur on the browse page. |
| Would moving detail reduce frustration? | Unknown | Guidance supports the approach; no Bếp Núc participant outcomes were measured. |
| Could hiding information harm discovery? | Answered as a design constraint | Essential information must remain visible; disclosure has interaction and discoverability costs. [S2](https://design-system.service.gov.uk/components/details/), [S3](https://www.nngroup.com/articles/accordions-on-desktop/) |

## Small validation study — proposed, not performed

Recruit 6–8 first-time target users for a formative comparison. This is a practical initial sample, not a statistical power claim. Give each person a first-exposure version; avoid showing both before the initial task. Include mobile users and keyboard users where feasible. Use fake money and a test account.

Ask participants to explain the service, identify who can order, find a suitable meal, report its displayed price and pickup window, locate voucher help, and explain what happens after creating an order. Observe without coaching.

Record unassisted completion, first meaningful click, price/eligibility misunderstandings, time, help requests, and a 1–7 perceived-overload rating. Report individual outcomes and medians; a small formative study cannot establish a causal population effect.

Proposed release criteria: at least 80% of participants understand pickup and eligibility before checkout; no participant mistakes an estimate for confirmed payment; no participant loses access to required allergy information. These are product targets, not established research thresholds. Prefer the simpler version only if comprehension and task completion are at least maintained while reported overload decreases. If participants cannot find hidden controls or required details, revise the grouping.

## Research scope and limits

Quick supporting evidence check: host web search and opened pages; six pages opened across NN/G, GOV.UK, and W3C, with five used below. Exa was not available. Quotes were checked manually against opened source text; the Deep Research ledger script was not run because no Python/uv executable was available on PATH. No automated ledger audit is claimed. The separate evidence CSV records the bounded source claims. Sources are design guidance, not experimental evidence of a Bếp Núc improvement.

The creative-thinking artifacts distinguish hard constraints, adjustable presentation, hidden assumptions, and method transfers. Academic Gates 4 and 5 are not passed: established UX patterns do not constitute a novel research method transfer. No recent technological breakthrough is needed or claimed. See [problem_signature.md](problem_signature.md) and [structural_mapping.csv](structural_mapping.csv).

## Sources

- S1: [NN/G — Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/).
- S2: [GOV.UK — Details](https://design-system.service.gov.uk/components/details/).
- S3: [NN/G — Accordions on Desktop](https://www.nngroup.com/articles/accordions-on-desktop/).
- S4: [W3C — Provide Summary of Long Documents and Media](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o3p08-summary-provided/).
- S5: [W3C — Separate Each Instruction](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o3p09-separated-instructions/).

## Implementation — 7 October 2026

Following the user's instruction to update directly, the customer component and commerce stylesheet were changed:

- The homepage now states public browsing and invited/approved student ordering eligibility in its primary banner, with no mobile hiding rule.
- A brief three-stage outline and manual payment confirmation expectation precede the meal list.
- Search and categories remain visible. Additional shop, sort, stock, and receiving controls use a native details disclosure; selected criteria and a reset action remain outside it.
- Meal cards and meal details now label the displayed price “Giá chưa áp voucher.” Prices and calculations are unchanged.
- The repeated voucher promotion was removed from browsing. Footer supplements separately explain ordering, vouchers, and cancellations/refunds; ordering instructions use numbered steps.

Validation: TypeScript check, 15 existing tests, and production build passed. The test runner required execution outside the sandbox after a Windows user-profile lookup failed inside it. Browser appearance, keyboard interactions, and participant outcomes remain unverified.
