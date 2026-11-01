export async function routeDistance(key:string,origin:{lat:number;lng:number},destination:{lat:number|null;lng:number|null}):Promise<number|null>{
  if(!key||destination.lat===null||destination.lng===null)return null;
  const response=await fetch("https://routes.googleapis.com/directions/v2:computeRoutes",{method:"POST",headers:{"Content-Type":"application/json","X-Goog-Api-Key":key,"X-Goog-FieldMask":"routes.distanceMeters"},body:JSON.stringify({origin:{location:{latLng:{latitude:origin.lat,longitude:origin.lng}}},destination:{location:{latLng:{latitude:destination.lat,longitude:destination.lng}}},travelMode:"WALK",units:"METRIC"}),signal:AbortSignal.timeout(5000)});
  if(!response.ok)return null;const data=await response.json();const meters=data.routes?.[0]?.distanceMeters;
  return typeof meters==="number"&&Number.isFinite(meters)&&meters>=0?meters/1000:null;
}
