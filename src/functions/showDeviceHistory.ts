import './App.css';
import '@aws-amplify/ui-react/styles.css';
import "maplibre-gl/dist/maplibre-gl.css";
import { drawPoints } from "maplibre-gl-js-amplify";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl-js-amplify/dist/public/amplify-geocoder.css"; // Optional CSS for Amplify recommended styling


export async function showDeviceHistory(map:Promise<maplibregl.Map>){
    let devHistory = [
      {
        DeviceId: "ExampleDevice-12",
        Position: [-125.4567, 47.6789],
        SampleTime: "2022-03-20T09:09:07.327Z"
      },
      {
        DeviceId: "ExampleDevice-12",
        Position: [-125.123, 49.123],
        SampleTime: "2022-03-20T09:10:32Z"
      },
      {
        DeviceId: "ExampleDevice-12",
        Position: [-125.4567, 47.6589],
        SampleTime: "2022-03-23T09:09:07.327Z"
      },
      {
        DeviceId: "ExampleDevice-12",
        Position: [-125.123, 49.163],
        SampleTime: "2022-03-23T09:10:32Z"
      }  
    ]
    const newHistoryArray = [];
    for (let positions in devHistory){
      newHistoryArray.push(devHistory[positions].Position)
    }
    type PlotObject = {coordinates:Array<number>}
    console.log("NewHistArray:", newHistoryArray)
    const plotArray: { coordinates: number[]; }[] = [];
    for (var position in newHistoryArray){
      let obj = {} as PlotObject;
      obj["coordinates"] = newHistoryArray[position];
      plotArray.push(obj)
      console.log("obj", obj)
    }
    
    console.log("plotArray:", plotArray)
    ;(await map).on("load", async function(){
      drawPoints("mySourceName", // Arbitrary source name
      [
        {
          coordinates: [-125.4567, 47.6789], // [Longitude, Latitude]
        },{
          coordinates: [-125.123, 49.123], // [Longitude, Latitude]
        },
        {
          coordinates: [-125.4567, 47.6589], // [Longitude, Latitude]
        },
        {
          coordinates: [-125.123, 49.163], // [Longitude, Latitude]
        },
    ]
      , // An array of coordinate data, an array of Feature data, or an array of [NamedLocations](https://github.com/aws-amplify/maplibre-gl-js-amplify/blob/main/src/types.ts#L8)
          await map,
          {
              showCluster: true,
              unclusteredOptions: {
                  showMarkerPopup: true,
              },
              clusterOptions: {
                  showCount: true,
              },
            
    });
  })
  };