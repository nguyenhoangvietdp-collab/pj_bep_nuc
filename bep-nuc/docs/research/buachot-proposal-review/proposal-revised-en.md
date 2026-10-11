# Bếp Núc — Swin-Biz Rockstar 2026

Draft revised on 5 October 2026. Track: **Gen Z Economy**.

Submission email: swinbiz@fe.edu.vn. Published deadline: **27 October 2026**. The official webpage does not specify a submission hour in the text inspected on 5 October; the team will confirm the cutoff and submit early. The published requirement is a written proposal of more than two pages, with an optional video shorter than ten minutes. Page length must be checked after formatting. [Official competition page](https://swinbizrockstar.swin.edu.vn/2026)

## Team information

Team name: Bếp Núc. Team leader: [full name]. Contact: [email]. Campus cluster: [campus and district].

| # | Full name | Year of birth | Gender | Role | School / University | Year of study | Email |
|---|---|---|---|---|---|---|---|
| 1 | [name] | [yyyy] | [ ] | Leader / Business | [ ] | [ ] | [ ] |
| 2 | [name] | [yyyy] | [ ] | Product / Tech | [ ] | [ ] | [ ] |
| 3 | [name] | [yyyy] | [ ] | Design / Research | [ ] | [ ] | [ ] |
| 4 | [optional] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| 5 | [optional] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

## Executive summary

Bếp Núc is a proposed campus-cluster marketplace for edible end-of-day surplus. Students receive three one-use vouchers each evening—7%, 10% and 20%—and use one per order. Eligible listings initially have a 5% base discount. A capped bonus can increase the chosen voucher when a student collects an order, for example from 7% to 15% for an eligible 1 km route. Before paying, students see the final price, the additional saving in dong and the collection window.

Each shop agrees to a net settlement amount per item. The pricing engine checks whether a voucher and pickup bonus can fit that amount, estimated variable costs and a minimum contribution. This protects the contracted payout for valid completed sales; it does not guarantee that listed food will sell or that every voucher will apply to every listing. The shop's commercial settlement terms stay private, while customer prices and conditions remain visible.

We will first test whether shops have recurring eligible surplus, whether students actually collect it, and whether a bonus creates enough additional completed pickups to justify the discount. Discovery and a manual pilot precede a PWA. Machine learning is a later option, contingent on randomized data and improvement over simple pricing rules. No survey, interview or pilot results have been collected for this proposal.

## Problem analysis and existing alternatives

Some small food shops may have edible unsold products near closing. Their existing responses can include discounts at the counter, social-media offers, staff consumption, donations or disposal. We will document these alternatives and their costs at partner shops rather than assume that most shops have daily surplus or that their existing options offer no predictable revenue.

Students near one campus may value lower-cost meals or snacks but face a trade-off between money saved, collection effort, food preferences and confidence in quality. Delivery vouchers, normal-price takeaway and cooking at home are competing options. Our research will compare final prices including relevant fees and collection time; discount percentages alone do not demonstrate an attractive offer.

Too Good To Go already uses self-collection and loyalty rewards. Local-facing alternatives also exist: CrumbUp markets end-of-day boxes and promotions, and the ResQ - Food Rescue Vietnam app describes reservations and store pickup. Their public pages establish product offerings, not verified active-user counts or sales performance. Bếp Núc's proposed contribution is an application of voucher and pickup incentives to a tightly defined student cluster, backed by settlement constraints and field evaluation—not a claim that surplus marketplaces, vouchers or pickup are new. [Too Good To Go](https://www.toogoodtogo.com/en-us/how-does-the-app-work), [CrumbUp](https://www.crumbup.store/), [ResQ](https://play.google.com/store/apps/details?id=vn.d2tech.resq)

## Value proposition

| Stakeholder | Proposed value | What needs validation |
|---|---|---|
| Students | Final price and saving in dong before payment; a choice of three vouchers; an optional, capped collection bonus | Savings exceed the perceived effort and compete with the student's normal alternatives |
| Shops | Known net settlement for completed sales, stock control and a scheduled collection window | Recoverable surplus exists; the settlement beats current alternatives without materially displacing regular sales |
| Platform | A controlled spread between customer payment and shop settlement | Contribution remains positive after operating costs; enough recurring transactions cover acquisition and fixed costs |

If all three vouchers have identical conditions, students are likely to choose 20% first. We retain the proposed three-voucher design and will measure subsequent use of 10% and 7%, rather than assume an equal mix or require students to place unnecessary additional orders.

## Stakeholder map

The placements below are planning assumptions to revise during fieldwork.

| Stakeholder | Influence / interest | Engagement |
|---|---|---|
| Partner owners and shift staff | High / high: control inventory, quality and handover | Co-design listings, settlement and closing routine; review workload weekly |
| Student customers | Individually limited influence / high interest; collectively determine demand | Diverse campus recruitment, choice tasks and post-pickup feedback |
| Campus administrators and relevant authorities | Potentially high influence / variable interest | Verify permission for campus activities and the pilot's applicable requirements |
| Clubs and dormitory representatives | Medium / variable | Recruitment and feedback; no access to private student or shop settlement data |
| Payment and route-service providers | Operational influence / limited direct interest | Confirm costs, coverage, reliability and fallback procedures |

## MVP concept

Start with three to five shops in one campus cluster. Select food with a clear collection window, description and shop-controlled storage procedure. Listings describe the product or portion, available quantity, ingredients/allergens where relevant, storage instructions and collection deadline. Shops confirm that the products remain suitable for sale; food returned by customers or no longer meeting safety conditions is excluded.

A student opens the catalogue, chooses an eligible item and one available voucher, and sees the actual capped bonus and final amount. A short-lived quote reserves the stock. After payment, a one-time pickup code confirms handover at the shop. Shop cancellations restore the voucher and trigger the agreed refund procedure. The code demonstrates handover, not the full route travelled.

The backend keeps settlement terms private, validates voucher use and stock, locks the quote, records outcomes and provides a reconciliation ledger. Ineligible voucher–item combinations are disclosed before checkout; a base voucher is not silently reduced. A bonus may be capped, but the exact resulting percentage and dong saving appear before confirmation.

The initial route rule adds eight percentage points per kilometre up to a stated distance limit, then applies financial and policy caps. Distance is estimated once from an eligible origin at quote time; longer detours do not earn more. Location consent alone cannot rule out spoofing. We will test verified campus/dormitory origins or a fixed campus reference as operational alternatives, and document how each affects eligibility. Continuous GPS tracking is outside the MVP.

## Revenue model and unit economics

For the fixed-settlement illustration, P is the genuine original price; b=0.05 is the base discount; v is the final applied voucher; F is the contracted shop net settlement; C is estimated variable cost per completed order; and m is the required contribution. Student payment T and the financial cap are:

`T = P(1-b)(1-v)`

`v_max = 1 - (F+C+m) / [P(1-b)]`

Total discount from the original price is `1-(1-b)(1-v)`. The cap concerns v, not that total discount. Reject any combination that cannot cover the agreed settlement and required costs. Round money in a way that preserves the constraint.

**Illustration only:** P=100,000 VND, F=65,000 VND, C=3,000 VND and m=2,000 VND.

| Applied voucher | Student payment | Shop settlement | Contribution after C | Total saving from P |
|---|---:|---:|---:|---:|
| 7% | 88,350 | 65,000 | 20,350 | 11.65% |
| 10% | 85,500 | 65,000 | 17,500 | 14.50% |
| 15%: eligible 7% plus 1 km | 80,750 | 65,000 | 12,750 | 19.25% |
| 20% | 76,000 | 65,000 | 8,000 | 24.00% |
| About 26.316%: financially capped | 70,000 | 65,000 | 2,000 | 30.00% |

The same assumptions do not work equally well for smaller orders. With F=65% of P and C+m=5,000 VND, the cap is about 14.04% at P=30,000 and 21.05% at P=50,000. A 20% voucher is therefore ineligible in the 30,000 illustration. These amounts are sensitivity scenarios, not measured campus prices. We will replace them with observed prices, shop terms and itemized operating costs.

The spread is earned only if shops explicitly agree to fixed settlement; a minimum acceptable price does not automatically give the platform ownership of the remainder. A commission model is an alternative requiring a different cap. Any chosen contract must define who funds discounts, settlement timing and responsibility for cancellations/refunds. The platform neither sells vouchers as cash nor treats unredeemed voucher values as revenue.

Positive per-order contribution is not business profitability. We will also record offer-level costs, staff time, customer acquisition, failed orders and fixed operating costs. Sponsorship is optional and will not conceal an otherwise loss-making baseline.

## Research and go-to-market plan

Recruit approximately 70 students across class, faculty and dormitory groups, and interview 10–20 shops within the selected cluster. These are discovery targets, not completed samples or representative estimates. Ask about recent actual meals and surplus handling before asking about hypothetical choices. Choice tasks show final prices and collection times; rotate scenario order and include normal takeaway/delivery as alternatives.

| Evidence to collect | Result | Source and status |
|---|---|---|
| Recent evening food purchases, final spend and relevant delivery fees | [pending] | Student discovery survey |
| Choice between actual-price alternatives and pickup offers | [pending] | Randomized-order choice tasks; intention only |
| Walking route/time acceptable at a stated saving | [pending] | Student survey, then observed pickups |
| Eligible surplus by product and closing shift | [pending] | Shop interviews plus observation/logs |
| Shop's current recovery route and acceptable net settlement | [pending] | Shop interviews; confirm in pilot agreement |
| Pickup, repeat use, refunds and contribution | [pending] | Manual-pilot records |

Target discovery during 5–14 October and, if partners and requirements permit, a manual pilot during 15–22 October. Prepare the evidence available by 23–25 October and submit early before the published 27 October deadline. Unfinished stages remain planned and must not be reported as results.

The manual pilot uses a catalogue link, a pricing sheet, permitted payment arrangements and pickup codes. Record at least a baseline period for how partner shops normally handle surplus. Build the PWA after confirming recurring supply, acceptable customer effort and workable settlement. Initial channels are partner-shop posters, student clubs, class/dormitory groups and Zalo links where appropriate.

For a later causal test, keep the three vouchers for everyone and randomize only the extra bonus policy. Log all eligible exposures, not just purchases; retain assignment, inventory availability, pickup, no-show, refunds and direct costs. Limited stock creates interference between customers, so assignment and analysis must account for store/shift-level capacity. A small operational pilot establishes feasibility, not definitive causal effectiveness.

The primary later comparison is **incremental contribution per eligible opportunity**, alongside completed pickups and food quantities. Compare `q_bonus × M_bonus` with `q_control × M_control`, including costs before purchase. More pickups do not automatically justify a larger discount if existing buyers also receive it.

Only then consider uplift models to estimate how bonus effects vary by pre-order context. Begin with randomized bucket averages and simple regression; adopt ML only if it beats a transparent rule in a held-out online evaluation. This is a transfer of established methods, not a new algorithm claim. [Promotion uplift research](https://arxiv.org/html/2008.06293v2)

## Risk identification

| Risk | Control and early evidence |
|---|---|
| Savings do not justify collection | Compare final dong savings and observed pickup against normal alternatives; reconsider parameters if uptake is weak |
| Small-order economics exclude the 20% voucher | Item-level feasibility checks and realistic sensitivity tests; disclose eligibility before checkout |
| Shops withhold stock or regular sales are displaced | Record production, regular sales and existing recovery channels; agree closing windows and genuine-surplus rules |
| Quality or unsafe handling | Eligible products, shop-controlled storage, clear information and an escalation/refund process; pause affected listings |
| Location manipulation or extra travel | Origin rules, route caps and one-time pickup confirmation; no rewards for distance added after quoting |
| Three vouchers encourage overbuying | One voucher per order, appropriate quantity limits and a voluntary post-pickup consumption check |
| Data and platform compliance | Minimize student/location data and determine applicable seller, platform, payment and promotion responsibilities before commercial operation |
| Apparent lift is caused by limited-stock displacement | Record exposure-time inventory; use capacity-aware assignment and store/shift-level analysis |
| A positive spread hides total losses | Itemized costs, refunds, acquisition and staff-time accounting; distinguish contribution from profitability |

## Impact and decision gates

Measure student savings against a verifiable reference price, shop revenue recovery relative to existing alternatives, and edible food collected. Collection count is an operational measure; net waste reduction requires evidence about the food's likely destination without Bếp Núc, production changes and food discarded after pickup. An analytical surplus-food study reinforces the need to examine both shop and consumer waste; its findings are model-based and do not establish effects at our campus. [Yang and Yu, 2025](https://pubsonline.informs.org/doi/10.1287/mnsc.2023.03001)

Before the pilot starts, register decision thresholds using observed baseline volumes and shop requirements. Continue only if at least three partners provide recurring eligible surplus, settled orders meet their contracted net payment, the collection workflow is acceptable, and the recorded economics support the next stage. Advance a bonus policy only if its incremental pickup and contribution results justify the cost within the agreed budget; report uncertainty and extend the test if evidence is inconclusive.

We make no current claim of proven demand, optimal voucher rates, trained ML, reduced emissions or net food-waste reduction. Bếp Núc's immediate contribution is a testable student-focused marketplace design with explicit economic constraints and transparent collection incentives.
