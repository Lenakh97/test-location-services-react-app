import React, { FunctionComponent, useState } from 'react';
import './App.css';
import { AmplifyProvider, withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect } from 'react';
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl-js-amplify/dist/public/amplify-geocoder.css"; // Optional CSS for Amplify recommended styling
import { addSingleCell } from './functions/addSingleCell';
import { addMultiCell } from './functions/addMultiCell';
import { showDeviceHistory } from './functions/showDeviceHistory';
import { listDeviceHistory } from './functions/listDeviceHistory';
import { initializeMap } from './functions/initializeMap';
import { searchPlaceIndexForPosition } from './functions/searchPlaceIndexForPosition';
import { reCenterOnPosition } from './functions/reCenterOnPosition';
import { options } from './utils/options';
import { Checkbox } from './components/Checkbox';

const multicell = {"lat":63.42123985,"lng":10.40840864,"accuracy":2408};
const singlecell = {"lat":63.42156251436995,"lng":10.43866796541505,"accuracy":5000}

function App({signOut, user}: { signOut: (data?: Record<string | number | symbol, any> | undefined) => void; user: {username: string}; }) {
  const [map, setMap] = useState<Promise<maplibregl.Map>>(initializeMap());
  const [deviceHistory, setDeviceHistory] = useState<Object>()
  const [mapSettings, setMapSettings] = useState<{
    recenter: boolean,
    headingMarker: boolean,
    GNSS: boolean,
    singlecell: boolean,
    singlecellHistory: boolean,
    multicell: boolean,
    multicellHistory: boolean
  }>({
    recenter: true,
    headingMarker: true,
    GNSS: true,
    singlecell: true,
    singlecellHistory: true,
    multicell: true,
    multicellHistory: true,
  })

 
  useEffect(() => {
    console.debug("useEffect")
    let deviceHistory = listDeviceHistory();
    deviceHistory.then(function(result){
      console.log(result.response)
      setDeviceHistory(deviceHistory)
    })
    console.log(deviceHistory)
    showDeviceHistory(map)
    //const map = initializeMap();
    //setMap(map);
    // const searchPos = searchPlaceIndexForPosition()
    
    addSingleCell(map, singlecell.lat, singlecell.lng, singlecell.accuracy)
    addMultiCell(map, multicell.lat,multicell.lng, multicell.accuracy)

  }, 
  // Dependencies
  [
    addSingleCell,
    addMultiCell,
    map,
    multicell,
    singlecell
  ]);
  
 

    return (
   
        <div className="App">
          <h1> </h1>
                <div id="map"></div>
                <h1>Hello {user.username}</h1>
                <button onClick={signOut}>Sign out</button>               
                <Checkbox checked={mapSettings.recenter} label="Recenter" id="recenter" onClick={() => {
                  setMapSettings(settings => ({
                    ...settings,
                    recenter: !settings.recenter
                  }))
                }} />
                <Checkbox checked={mapSettings.headingMarker} label="Headingmarker" id="headingmarker" onClick={() => {
                  setMapSettings(settings => ({
                    ...settings,
                    headingMarker: !settings.headingMarker
                  }))
                }}/>
                <Checkbox checked={mapSettings.GNSS} label="GNSS" id="gnss" onClick={() => {
                  setMapSettings(settings => ({
                    ...settings,
                    GNSS: !settings.GNSS
                  }))
                }}/>
                <Checkbox checked={mapSettings.singlecell} label="Singlecell" id="singlecell" onClick={() => {
                  setMapSettings(settings => ({
                    ...settings,
                    singlecell: !settings.singlecell
                  }))
                }}/>
                <Checkbox checked={mapSettings.singlecellHistory} label="Singlecell History" id="singlecellHistory" onClick={() => {
                  setMapSettings(settings => ({
                    ...settings,
                    singlecellHistory: !settings.singlecellHistory
                  }))
                }}/>
                <Checkbox checked={mapSettings.multicell} label="Multicell" id="multicell" onClick={() => {
                  setMapSettings(settings => ({
                    ...settings,
                    multicell: !settings.multicell
                  }))
                }}/>
                <Checkbox checked={mapSettings.multicellHistory} label="Multicell History" id="multicellHistory" onClick={() => {
                  setMapSettings(settings => ({
                    ...settings,
                    multicellHistory: !settings.multicellHistory
                  }))
                }}/>
        </div>
  );
}

export default withAuthenticator(App);
