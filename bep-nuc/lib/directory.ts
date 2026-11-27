import {mealCategories,filterFood,type Food,type PublicShop} from "./commerce.ts";
import {retailCategories,retailLabel} from "./near-date.ts";
import {nearDateTemplates,visibleNearDateTemplates} from "./near-date-templates.ts";
import {filterLaunchMenu} from "./launch-menu.ts";
import {filterRequestFlowers,requestProduct} from "./request-catalogue.ts";
import {saleOrderable} from "./trading.ts";
import {catalogueIllustration} from "./public-catalogue.ts";

export const flowerCategory="Hoa cắm nhà";
// `value` is the existing category filter value; "" means every food category.
export const departments=[
  {key:"food",label:"Đồ ăn",value:"",image:productImage(),children:mealCategories.map(value=>({value,label:value}))},
  {key:"near",label:"Hàng gần hạn",value:retailLabel,image:`/near-date-illustrations/${nearDateTemplates[0].id}.jpg`,children:retailCategories.slice(1).map(value=>({value,label:value.replace(`${retailLabel}: `,"")}))},
  {key:"flowers",label:"Hoa cắm nhà",value:flowerCategory,image:filterRequestFlowers()[0]?.image??"",children:[] as {value:string;label:string}[]},
] as const;
function productImage(){const first=filterLaunchMenu()[0];if(!first)return "";const product=requestProduct(undefined,first.name)!;return catalogueIllustration(product.id,product.image);}

export type Department=typeof departments[number];
export const departmentOf=(category:string):Department=>
  departments[category.startsWith(retailLabel)?1:category===flowerCategory?2:0];

export function directoryHref(value:string){
  return value?`/meals?category=${encodeURIComponent(value)}`:"/meals?all=1";
}

type Source={listings:Food[];shops:PublicShop[];now:number;cloud:boolean};
// Request-catalogue items that are not already covered by a real, orderable lot.
export function referenceItems(category:string,source:Source,query="",budget=0,sort="end",shopId=""){
  if(!source.cloud||category.startsWith(retailLabel))return [];
  const items=category===flowerCategory
    ?filterRequestFlowers(query,budget,sort).map(product=>({product,shopId:product.shopId}))
    :filterLaunchMenu(query,category,budget,sort).map(p=>({product:requestProduct(undefined,p.name)!,shopId:p.shop.id as string|undefined}));
  return items.filter(({product,shopId:own})=>(!shopId||own===shopId)&&!source.listings.some(l=>l.stock>0&&saleOrderable(l,source.now)&&(l.image===product.image||l.lot?.catalogueProductId===product.id)));
}

export function directoryCount(category:string,source:Source){
  const lots=filterFood(source.listings,source.shops,"",category,"",true,false,"end",source.now).length;
  const templates=category.startsWith(retailLabel)?visibleNearDateTemplates(source.listings,category,"",source.now).length:0;
  return lots+templates+referenceItems(category,source).length;
}
