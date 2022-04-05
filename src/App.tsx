import { FunctionComponent, useRef } from 'react';
import './App.css';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect } from 'react';
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl-js-amplify/dist/public/amplify-geocoder.css"; // Optional CSS for Amplify recommended styling
import { useMapSettings } from './hooks/useMapSettings';
import { MapSettings } from './components/MapSettings';
import { createAmplifyGeocoder, createMap } from 'maplibre-gl-js-amplify';
import { makeCircle } from './functions/makeCircle';
import { nanoid } from 'nanoid'

const multicell:GeoLocation = {"lat":63.42123985,"lng":10.40840864,"accuracy":2408, source: 'multicell'};
const singlecell1:GeoLocation = {"lat":63.42156251436995,"lng":10.43866796541505,"accuracy":5000, source: 'singlecell'}
const singlecell2:GeoLocation = {"lat":63.92156251436995,"lng":10.43866796541505,"accuracy":5000, source: 'singlecell'}
const gnss:GNSSGeoLocation = {"lat":63.42123985,"lng":10.40840864,"accuracy":100, source: 'gnss', hdg:182};

const mapStyle = "map0dd2b65d-loginenv"

function App({signOut, user}: { signOut: (data?: Record<string | number | symbol, any> | undefined) => void; user: {username: string}; }) {
  
  const {settings} = useMapSettings()

  console.log(settings.multicell)
  console.log(settings.singlecell)

  const locations: (GeoLocation|GNSSGeoLocation)[] = [
    singlecell1,
    singlecell2,
    multicell,
    gnss
  ]

  const locationsToShowOnMap = locations
  .filter(({source}) => {
    switch(source) {
      case 'multicell':
        return (settings.multicell)
      case 'singlecell':
        return settings.singlecell
      case 'gnss':
        return settings.GNSS
      default:
        return false
    }
  })

  const locationsWithHeading: GNSSGeoLocation[] = locations.filter(({source}): boolean => {
    if (!settings.headingMarker) return false
    if (source === 'gnss') return true
    return false
  }) as GNSSGeoLocation[]

  console.log(locationsWithHeading)
  
  return (
   
        <div className="App">
          <h1> </h1>
                <Map geoLocations={locationsToShowOnMap} headingMarker={locationsWithHeading} mapStyle={mapStyle} />
                <h1>Hello {user.username}</h1>     
                <MapSettings /> 
                <button onClick={signOut}>Sign out</button>          
        </div>
  );
}

export default withAuthenticator(App);

type GeoLocation = {
  lat: number
  lng: number
  accuracy: number
  source: 'singlecell' | 'multicell' | 'gnss'
  
}

type GNSSGeoLocation = GeoLocation & {
  source: 'gnss'
  hdg: number
}

const Map: FunctionComponent<{
  geoLocations: GeoLocation[]
  headingMarker: GNSSGeoLocation[]
  mapStyle: string
}> = ({geoLocations, headingMarker, mapStyle}) => {

  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (divRef.current === null) {
      return
    }

    createMap({
      container: divRef.current,
      center: [10.401920000000075, 63.419610000000034],
      zoom: 10,
    }).then(map => {
      console.log("map is finished")

      map.addControl(createAmplifyGeocoder());
      map.addControl(new maplibregl.NavigationControl());
      map.setStyle(mapStyle);

      map.on('load', () => {
        console.log("map is loaded")
        for(const geoLocation of geoLocations) {
          const id = nanoid()
          const circle = makeCircle(geoLocation.lng, geoLocation.lat, geoLocation.accuracy)         
          map.addSource(`${id}-data`, {
            type: "geojson",
            data: circle,
          });
          let fillColor = 'rgb(246, 194, 112)'
          if (geoLocation.source === 'multicell') {
            fillColor = "rgb(229, 99, 153)"
          }
          map.addLayer({
                id: id,
                type: "fill",
                source: `${id}-data`,
                paint: {
                  "fill-color": fillColor,
                  "fill-opacity": 0.4
                },
              });
        for(const heading in headingMarker){
          //Do something
        }
        }
        map.resize()
      })
    })

    return () => {
      console.debug("Called on unmount")

    }

  }, [divRef, geoLocations])

  return <div ref={divRef} style={{width: '500px', height: '500px'}}>Map goes here</div>
}