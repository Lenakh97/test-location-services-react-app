import React from 'react';
import logo from './logo.svg';
import './App.css';
import { AmplifyProvider, withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Amplify, { Auth } from 'aws-amplify';
import Location from "aws-sdk/clients/location";
import { Geo } from "aws-amplify";
import { create } from 'domain';
import { createMap, createAmplifyGeocoder } from "maplibre-gl-js-amplify"; 
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect } from 'react';
import { drawPoints } from "maplibre-gl-js-amplify";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl-js-amplify/dist/public/amplify-geocoder.css"; // Optional CSS for Amplify recommended styling
import awsconfig from './aws-exports';
import * as turf from "@turf/turf"

const AWS = require("aws-sdk");
Amplify.configure(awsconfig);

async function initializeMap() {
  const el = document.createElement("div");
    el.setAttribute("id", "map");
    document.body.appendChild(el);
  const map = await createMap({
      container: "map", // An HTML Element or HTML element ID to render the map in https://maplibre.org/maplibre-gl-js-docs/api/map/
      center: [10.401920000000075, 
        63.419610000000034], // center in New York
      zoom: 10,
  })
  map.addControl(createAmplifyGeocoder());
  map.addControl(new maplibregl.NavigationControl());
  map.on("load", function(){
    drawPoints("mySourceName", // Arbitrary source name
        [
            {
              coordinates: [10.401920000000076, 
                63.419610000000034], // [Longitude, Latitude]
            },/*{
              coordinates: [10.412930000000075, 
                63.419610000000034], // [Longitude, Latitude]
            },
            {
              coordinates: [10.423920000000074, 
                63.419610000000034], // [Longitude, Latitude]
            },
            {
              coordinates: [10.434920000000077, 
                63.419610000000034], // [Longitude, Latitude]
            },
            {
              coordinates: [10.445920000000078, 
                63.419610000000034], // [Longitude, Latitude]
            },
            {
              coordinates: [10.456920000000079, 
                63.419610000000034], // [Longitude, Latitude]
            },*/
        ], // An array of coordinate data, an array of Feature data, or an array of [NamedLocations](https://github.com/aws-amplify/maplibre-gl-js-amplify/blob/main/src/types.ts#L8)
        map,
        {
            showCluster: true,
            unclusteredOptions: {
                showMarkerPopup: true,
            },
            clusterOptions: {
                showCount: true,
            },
        }
    );
    //SINGLECELL
    let _center = turf.point([10.43866796541505, 
      63.42156251436995]);
    let _radius = 5;
    let _options = {
      steps: 80,
      units: 'kilometers' // or "mile"
    };

    let _circle = turf.circle(_center, _radius);

    map.addSource("circleData", {
          type: "geojson",
          data: _circle,
        });

    map.addLayer({
          id: "circle-fill",
          type: "fill",
          source: "circleData",
          paint: {
            "fill-color": "rgb(246, 194, 112)",
            "fill-opacity": 0.4
          },
        });

  
    //MULTICELL
    let _center2 = turf.point([10.40840864, 
      63.42123985]);
    let _radius2 = 2.408;
    let _options2 = {
      steps: 80,
      units: 'kilometers' // or "mile"
    };
    let _circle2 = turf.circle(_center2, _radius2);

    map.addSource("circleData2", {
      type: "geojson",
      data: _circle2,
    });

    map.addLayer({
      id: "circle-fill2",
      type: "fill",
      source: "circleData2",
      paint: {
        "fill-color": "rgb(229, 99, 153)",
        "fill-opacity": 0.4,
      },
    });
  })

  Geo.getAvailableMaps();
  map.setStyle("map0dd2b65d-loginenv");
  map.resize();

}

async function listDeviceHistory() {
  const credentials = await Auth.currentCredentials();
    var location = new AWS.Location({
      credentials,
      region: awsconfig.aws_project_region 
      }); 

  let parameter = {
    DeviceId: "ExampleDevice-12",
    TrackerName: "MyTracker"
  };

  location.getDevicePositionHistory(parameter, (err:Error, data:object) => {
    if (err) console.log(err);
    if (data) console.log(data);
  });
}

function App({signOut, user}: { signOut: (data?: Record<string | number | symbol, any> | undefined) => void; user: {username: string}; }) {
  useEffect(() => {
    const multicell = {"lat":63.42123985,"lng":10.40840864,"accuracy":2408};
    const singlecell = {"lat":63.42156251436995,"lng":10.43866796541505,"accuracy":5000}
    const map = initializeMap();
    const deviceHistory = listDeviceHistory();
  }, []);
  return (
   
        <div className="App">
          <h1> </h1>
                <div id="map"></div>
                <h1>Hello {user.username}</h1>
                <button onClick={signOut}>Sign out</button>
        </div>
  );
}

export default withAuthenticator(App);
