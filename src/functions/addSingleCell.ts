import './App.css';
import '@aws-amplify/ui-react/styles.css';
import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl-js-amplify/dist/public/amplify-geocoder.css"; // Optional CSS for Amplify recommended styling
import * as turf from "@turf/turf"

export async function addSingleCell(map:Promise<maplibregl.Map>, lat:number,lng:number, accuracy:number) {
    (await map).on("load", async function(){
     
      function makeCircle(lat:number,lng:number, accuracy:number){
        let center = turf.point([lat, lng])
        let radius = accuracy/1000
        return turf.circle(center, radius)
      }
  
      let singlecell_circle = makeCircle(63.42156251436995, 
        10.43866796541505, 5000)
        
      ;(await map).addSource("circleData", {
            type: "geojson",
            data: singlecell_circle,
          });
  
      (await map).addLayer({
            id: "circle-fill",
            type: "fill",
            source: "circleData",
            paint: {
              "fill-color": "rgb(246, 194, 112)",
              "fill-opacity": 0.4
            },
          });
    })
    ;(await map).resize();
  }