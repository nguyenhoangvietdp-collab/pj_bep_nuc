import test from "node:test";
import assert from "node:assert/strict";
import {departments,departmentOf,directoryCount,directoryHref,referenceItems,flowerCategory} from "../lib/directory";
import {mealCategories,browseUrl} from "../lib/commerce";
import {retailCategories,retailLabel} from "../lib/near-date";
import {nearDateTemplates} from "../lib/near-date-templates";
import {safeAppPath} from "../lib/app-navigation";

const empty={listings:[],shops:[],now:Date.parse("2026-11-28T18:00:00+07:00"),cloud:true};

test("directory covers every food, near-date and flower category with a working link",()=>{
 assert.deepEqual(departments[0].children.map(c=>c.value),mealCategories);
 assert.deepEqual(departments[1].children.map(c=>c.value),retailCategories.slice(1));
 assert.equal(departments[2].value,flowerCategory);
 for(const department of departments){
  assert.ok(department.image,department.key);
  for(const {value} of [department,...department.children]){
   assert.equal(departmentOf(value).key,department.key,value);
   const href=directoryHref(value);
   assert.equal(safeAppPath(href),href);
   assert.equal(browseUrl(href),href.replace(/%20/g,"+"));
  }
 }
});

test("branch counts add up to their department",()=>{
 for(const department of departments){
  const total=directoryCount(department.value,empty);
  assert.ok(total>0,department.key);
  if(department.children.length)assert.equal(department.children.reduce((sum,c)=>sum+directoryCount(c.value,empty),0),total,department.key);
 }
 assert.equal(directoryCount(retailLabel,empty),nearDateTemplates.length);
 assert.equal(directoryCount("",empty),referenceItems("",empty).length);
 assert.equal(referenceItems("",{...empty,cloud:false}).length,0);
});
