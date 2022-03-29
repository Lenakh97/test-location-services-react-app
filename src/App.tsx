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
import { useMapSettings } from './hooks/useMapSettings';
import { MapSettings } from './components/MapSettings';

const multicell = {"lat":63.42123985,"lng":10.40840864,"accuracy":2408};
const singlecell = {"lat":63.42156251436995,"lng":10.43866796541505,"accuracy":5000}

function App({signOut, user}: { signOut: (data?: Record<string | number | symbol, any> | undefined) => void; user: {username: string}; }) {
  const [map, setMap] = useState<Promise<maplibregl.Map>>(initializeMap());
  const [deviceHistory, setDeviceHistory] = useState<Object>()
 
  useEffect(() => {
    console.debug("useEffect")
    /*let deviceHistory = listDeviceHistory();
    deviceHistory.then(function(result){
      console.log(result.response)
      setDeviceHistory(deviceHistory)
    })
    console.log(deviceHistory)*/
    //showDeviceHistory(map)
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
                <MapSettings /> 
                <button onClick={signOut}>Sign out</button>          
        </div>
  );
}

export default withAuthenticator(App);
