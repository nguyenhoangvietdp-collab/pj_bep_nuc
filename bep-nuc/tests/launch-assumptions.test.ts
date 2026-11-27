import test from "node:test";
import assert from "node:assert/strict";
import {launchAssumptions,launchReceivingDraft} from "../lib/launch-assumptions";
import {validateRules,defaultTradingRules} from "../lib/trading";

test("launch profile matches selected assumptions without activating funded trading",()=>{
  const {rules}=launchAssumptions;
  assert.equal(launchAssumptions.stock,3);
  assert.equal(launchAssumptions.cost,3000);
  assert.equal(launchAssumptions.margin,1000);
  assert.equal(rules.weeklyBudget,500000);
  assert.equal(rules.cap15,9000);assert.equal(rules.cap10,9000);
  assert.equal(rules.fixedWeekly,4);assert.equal(rules.shippingCap,9000);
  assert.equal(rules.stackReceiving,true);assert.equal(rules.enabled,false);
  validateRules(rules);
  assert.equal(defaultTradingRules().enabled,false);
  assert.equal(defaultTradingRules().weeklyBudget,0);
});

test("receiving draft has a fixed three-hour local window including date rollover",()=>{
  const now=Date.parse("2026-11-04T22:30:00+07:00");
  const draft=launchReceivingDraft(now);
  assert.deepEqual(draft,{start:"2026-11-04T22:30",end:"2026-11-05T01:30"});
  assert.equal(Date.parse(draft.end+"+07:00")-Date.parse(draft.start+"+07:00"),3*3600000);
  assert.deepEqual(launchReceivingDraft(now),draft);
});
