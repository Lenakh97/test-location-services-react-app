import '../App.css';
import '@aws-amplify/ui-react/styles.css';
import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl-js-amplify/dist/public/amplify-geocoder.css"; // Optional CSS for Amplify recommended styling
import * as turf from "@turf/turf"

export async function addMultiCell(map:Promise<maplibregl.Map>, lat:number,lng:number, accuracy:number) {
    (await map).on("load", async function(){
     
      function makeCircle(lat:number,lng:number, accuracy:number){
        let center = turf.point([lat, lng])
        let radius = accuracy/1000
        return turf.circle(center, radius)
      }
  
      let multicell_circle = makeCircle(63.42123985, 
        10.40840864, 2408)
  
      ;(await map).addSource("circleData2", {
        type: "geojson",
        data: multicell_circle,
      });
  
      (await map).addLayer({
        id: "circle-fill2",
        type: "fill",
        source: "circleData2",
        paint: {
          "fill-color": "rgb(229, 99, 153)",
          "fill-opacity": 0.4,
        },
      });
    })
    ;(await map).resize();
  }