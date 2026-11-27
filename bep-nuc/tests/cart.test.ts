import test from "node:test";
import assert from "node:assert/strict";
import {addToCart,cartCount,cartProduct,cartTotals,parseCart,pickupGroups,removeFromCart,setCartQty} from "../lib/cart";
import {launchEstimate} from "../lib/launch-estimate";
import {launchAssumptions} from "../lib/launch-assumptions";
import {nearDateTemplates} from "../lib/near-date-templates";
import {requestProducts} from "../lib/request-catalogue";
import {safeAppPath} from "../lib/app-navigation";

const everyId=[...requestProducts.map(p=>p.id),...nearDateTemplates.map(t=>t.id)];

test("stored cart data is untrusted and quantities stay between 1 and 3",()=>{
 for(const raw of [null,"","{","{}",'"x"','[null,1,"a"]','[{"id":"nope","qty":1}]','[{"id":"nd-mi-an-lien","qty":0}]','[{"id":"nd-mi-an-lien","qty":1.5}]','[{"id":"","qty":1}]'])assert.deepEqual(parseCart(raw),[],String(raw));
 assert.deepEqual(parseCart('[{"id":"nd-mi-an-lien","qty":99,"price":1},{"id":"nd-mi-an-lien","qty":1}]'),[{id:"nd-mi-an-lien",qty:3}]);
 let lines=addToCart([],"nd-mi-an-lien",2);
 lines=addToCart(lines,"nd-mi-an-lien",2);
 assert.deepEqual(lines,[{id:"nd-mi-an-lien",qty:3}]);
 assert.deepEqual(addToCart(lines,"unknown"),lines);
 assert.equal(cartCount(setCartQty(lines,"nd-mi-an-lien",0)),1);
 assert.deepEqual(removeFromCart(lines,"nd-mi-an-lien"),[]);
 assert.equal(safeAppPath("/cart"),"/cart");
});

test("a one-line cart matches the single-product estimate",()=>{
 for(const id of everyId){
  const product=cartProduct(id)!;
  assert.ok(product,id);
  if(!product.supplierUnitPrice)continue;
  for(const rate of [0,.15,.1,9000])for(const method of ["pickup","delivery"] as const)for(const qty of [1,3]){
   const single=launchEstimate({unitPrice:product.unitPrice,originalUnitPrice:product.originalUnitPrice,supplierUnitPrice:product.supplierUnitPrice,qty,rate,method});
   const cart=cartTotals([{id,qty}],rate,method).amounts;
   assert.equal(cart.total,single.amounts.total,`${id} ${rate} ${method} ${qty}`);
   assert.equal(cart.voucherDiscount,single.amounts.voucherDiscount);
   assert.equal(cart.bonusDiscount,single.amounts.bonusDiscount);
  }
 }
});

test("one voucher per cart goes to the line that saves the most, within the weekly budget",()=>{
 const lines=everyId.map(id=>({id,qty:3}));
 const plain=cartTotals(lines,0,"pickup").amounts;
 for(const rate of [.15,.1,9000]){
  const result=cartTotals(lines,rate,"pickup"),a=result.amounts;
  assert.equal(result.rows.filter(r=>r.amounts.voucherDiscount>0).length,1);
  assert.equal(result.rows.find(r=>r.amounts.voucherDiscount>0)!.line.id,result.voucherLine);
  assert.ok(a.total<=plain.total);
  const bestAlone=Math.max(...lines.map(line=>cartTotals([line],0,"pickup").amounts.total-cartTotals([line],rate,"pickup").amounts.total));
  assert.equal(plain.total-a.total,bestAlone);
  assert.ok(a.voucherDiscount+a.bonusDiscount<=launchAssumptions.rules.weeklyBudget);
  assert.equal(a.total,a.menuTotal-a.baseDiscount-a.voucherDiscount-a.bonusDiscount);
 }
 assert.equal(cartTotals(lines,.15,"delivery").amounts.bonusDiscount,0);
});

test("near-date samples are grouped away from named shops",()=>{
 const groups=pickupGroups(cartTotals([{id:"nd-mi-an-lien",qty:1},{id:requestProducts[0].id,qty:1}],0,"pickup").rows);
 assert.equal(groups.length,2);
 assert.equal(groups.find(g=>g.key==="near-date")!.address,"");
});
