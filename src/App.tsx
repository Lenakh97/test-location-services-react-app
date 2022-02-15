import React from 'react';
import logo from './logo.svg';
import './App.css';

import Amplify, { Auth } from 'aws-amplify';
import Location from "aws-sdk/clients/location";
import awsconfig from './aws-exports';
import { create } from 'domain';
import { createMap, createAmplifyGeocoder } from "maplibre-gl-js-amplify"; 
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect } from 'react';
import { drawPoints } from "maplibre-gl-js-amplify";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl-js-amplify/dist/public/amplify-geocoder.css"; // Optional CSS for Amplify recommended styling

Amplify.configure(awsconfig);

const createClient = async () => {
    const credentials = await Auth.currentCredentials();
    const client = new Location({
        credentials,
        region: awsconfig.aws_project_region,
   });
   return client;
}

async function initializeMap() {
  const el = document.createElement("div");
    el.setAttribute("id", "map");
    document.body.appendChild(el);
  const map = await createMap({
      container: "map", // An HTML Element or HTML element ID to render the map in https://maplibre.org/maplibre-gl-js-docs/api/map/
      center: [-73.98597609730648, 40.751874635721734], // center in New York
      zoom: 11,
  })
  map.addControl(createAmplifyGeocoder());}

function App() {
  useEffect(() => {
    const map = initializeMap();
  }, []);
  
  return (
    <div className="App">
      <h1>My Restaurant</h1>
            <ul id="locations">
                <li><b>My Restaurant - Upper East Side</b> <br/> 300 E 77th St, New York, NY 10075 </li>
                <li><b>My Restaurant - Hell's Kitchen</b> <br/> 725 9th Ave, New York, NY 10019</li>
                <li><b>My Restaurant - Lower East Side</b><br/> 102 Norfolk St, New York, NY 10002</li>
            </ul>
            <div id="map"></div>
    </div>
  );
}

export default App;
