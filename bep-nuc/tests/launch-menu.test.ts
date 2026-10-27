import test from "node:test";
import assert from "node:assert/strict";
import {filterLaunchMenu} from "../lib/launch-menu";
test("owner menu searches actual merchant name and address without accents",()=>{
 for(const query of ["BÒ TƠ MAI CHÂU","bo to","198 thai thinh","dong da"]){assert.equal(filterLaunchMenu(query).length,3);}
 assert.deepEqual(filterLaunchMenu("bun rieu").map(p=>p.name),["Bún riêu"]);
 assert.equal(filterLaunchMenu("khong co").length,0);
});
test("unopened menu keeps the approved menu price for budget boundaries and sort",()=>{
 assert.equal(filterLaunchMenu("","",34999).length,0);
 assert.deepEqual(filterLaunchMenu("","",35000).map(p=>p.name),["Bánh dày"]);
 assert.deepEqual(filterLaunchMenu("","",0,"price").map(p=>p.referencePrice),[35000,45000,60000]);
 assert.equal(filterLaunchMenu("","Bánh").length,1);
});
