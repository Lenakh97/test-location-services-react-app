import React, { useState } from 'react';
import '../App.css';
import { AmplifyProvider, withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Amplify, { Auth } from 'aws-amplify';
import { Geo } from "aws-amplify";
import { createMap, createAmplifyGeocoder } from "maplibre-gl-js-amplify"; 
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect } from 'react';
import { drawPoints } from "maplibre-gl-js-amplify";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl-js-amplify/dist/public/amplify-geocoder.css"; // Optional CSS for Amplify recommended styling
import awsconfig from '../aws-exports';
import * as turf from "@turf/turf"


Amplify.configure(awsconfig);
const AWS = require("aws-sdk");

export async function initializeMap() {
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
          coordinates: [10.423926083872693,
            63.432880226558886], // [Longitude, Latitude]
        },{
          coordinates: [10.391332538174396,
            63.432927402342735], // [Longitude, Latitude]
        },
        {
          coordinates: [10.393864075703819,
            63.42278282159667], // [Longitude, Latitude]
        },
        {
          coordinates: [10.430149446966979,
            63.41693036059126], // [Longitude, Latitude]
        },
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
      function makeCircle(lat:number,lng:number, accuracy:number){
        let center = turf.point([lat, lng])
        let radius = accuracy/1000
        return turf.circle(center, radius)
      }
      
      let singlecell_circle = makeCircle(10.43866796541505, 
        63.42156251436995, 5000)
  
      map.addSource("circleData", {
            type: "geojson",
            data: singlecell_circle,
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
      
      let multicell_circle = makeCircle(10.40840864, 
        63.42123985, 2408)
    
      map.addSource("circleData2", {
        type: "geojson",
        data: multicell_circle,
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
    return map;
  
  }