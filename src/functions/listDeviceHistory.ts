import React, { useState } from 'react';
import './App.css';
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


Amplify.configure(awsconfig);
const AWS = require("aws-sdk");
export async function listDeviceHistory() {
    const credentials = await Auth.currentCredentials();
      var location = new AWS.Location({
        credentials,
        region: awsconfig.aws_project_region 
        }); 
  
    let parameter = {
      DeviceId: "ExampleDevice-12",
      TrackerName: "MyTracker"
    };
  
    let data = await location.getDevicePositionHistory(parameter, (err:Error, data:object) => {
      if (err) console.log(err);
      if (data) console.log(data);
    });
    return data;
  }