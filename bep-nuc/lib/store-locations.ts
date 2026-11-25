import locations from "./store-locations.json" with {type:"json"};
// Addresses and pickup instructions supplied by the owner on 2026-11-06.
export const storeLocations=locations;
export function locatedStore<T extends {id:string}>(store:T){
  const location=storeLocations.find(x=>x.id===store.id);
  if(!location)return store;
  const {menu,...details}=location;
  return {...store,...details};
}
