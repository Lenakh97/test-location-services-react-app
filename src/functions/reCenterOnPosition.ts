export async function reCenterOnPosition(map:Promise<maplibregl.Map>){
    (await map).resize();
  }