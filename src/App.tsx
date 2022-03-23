import React, { useState } from 'react';
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

function App({signOut, user}: { signOut: (data?: Record<string | number | symbol, any> | undefined) => void; user: {username: string}; }) {
  const [map, setMap] = useState<Promise<maplibregl.Map>>(initializeMap());
  const [deviceHistory, setDeviceHistory] = useState<Object>()
  const [checkedState, setCheckedState] = useState([false, true, true, true, false, true, false]);
  const multicell = {"lat":63.42123985,"lng":10.40840864,"accuracy":2408};
  const singlecell = {"lat":63.42156251436995,"lng":10.43866796541505,"accuracy":5000}
  useEffect(() => {
    let deviceHistory = listDeviceHistory();
    deviceHistory.then(function(result){
      console.log(result.response)
      setDeviceHistory(deviceHistory)
    })
    console.log(deviceHistory)
    showDeviceHistory(map)
    //const map = initializeMap();
    //setMap(map);
    const searchPos = searchPlaceIndexForPosition()
    addSingleCell(map, singlecell.lat, singlecell.lng, singlecell.accuracy)
    addMultiCell(map, multicell.lat,multicell.lng, multicell.accuracy)
  }, []);
  //const map = initializeMap();
/*
  const [checkedState, setCheckedState] = useState(
    new Array(options.length).fill(false)
  );*/
  const handleOnChange = (position:number) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    //recenter
    if (position == 0 && checkedState[0]==false){
      reCenterOnPosition(map)
      console.log("Re-center ~ true")    
    }
    if (position == 0 && checkedState[0]==true){
      //do nothing??
      console.log("Re-center ~ false")
    }
    //headingmarker
    if (position == 1 && checkedState[1]==false){
      console.log("Headingmarker ~ true")
    }
    if (position == 1 && checkedState[1]==true){
      console.log("Headingmarker ~ false")
    }
    //GNSS
    if (position == 2 && checkedState[2]==false){
      console.log("GNSS history ~ true")
    }
    if (position == 2 && checkedState[2]==true){
      console.log("GNSS history ~ false")
    }
    //Singlecell
    if (position == 3 && checkedState[3]==false){
      addSingleCell(map, singlecell.lat,singlecell.lng, singlecell.accuracy)
      console.log("Singlecell circle ~ true")
    }
    if (position == 3 && checkedState[3]==true){
      console.log("Singlecell circle ~ false")
    }
    //Singlecell location
    if (position == 4 && checkedState[4]==false){
      console.log("Singlecell location ~ true")
    }
    if (position == 4 && checkedState[4]==true){
      console.log("Singlecell location ~ false")
    }
    //Multicell
    if (position == 5 && checkedState[5]==false){
      addMultiCell(map, multicell.lat,multicell.lng, multicell.accuracy)
      console.log("Multicell circle ~ true")
    }
    if (position == 5 && checkedState[5]==true){
      console.log("Multicell circle ~ false")
    }
    //Multicell location
    if (position == 6 && checkedState[6]==false){
      console.log("Multicell location ~ true")    }
    if (position == 6 && checkedState[6]==true){
      console.log("Multicell location ~ false")    
    }
    setCheckedState(updatedCheckedState);
  }
 

    return (
   
        <div className="App">
          <h1> </h1>
                <div id="map"></div>
                <h1>Hello {user.username}</h1>
                <button onClick={signOut}>Sign out</button>
                {options.map(({ name }, index) => {
                  return (
                    <li key={index}>
                      <div className="toppings-list-item">
                        <div className="left-section">
                          <input
                            type="checkbox"
                            id={`custom-checkbox-${index}`}
                            name={name}
                            value={name}
                            checked={checkedState[index]}
                            onChange={() => handleOnChange(index)}
                          />
                          <label htmlFor={`custom-checkbox-${index}`}>{name}</label>
                        </div>
                      </div>
                    </li>
                  );
                })}
        </div>
  );
}

export default withAuthenticator(App);
