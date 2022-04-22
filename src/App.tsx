import './App.css';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import "maplibre-gl/dist/maplibre-gl.css";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl-js-amplify/dist/public/amplify-geocoder.css"; // Optional CSS for Amplify recommended styling
import { useMapSettings } from './hooks/useMapSettings';
import { MapSettings } from './components/MapSettings';
import { Map } from './components/Map';

export type GeoLocation = {
  lat: number
  lng: number
  accuracy: number
  source: 'singlecell' | 'multicell' | 'gnss'
}

export type GNSSGeoLocation = GeoLocation & {
  source: 'gnss'
  hdg: number
}

const multicell:GeoLocation = {"lat":63.42123985,"lng":10.40840864,"accuracy":2408, source: 'multicell'};
const singlecell1:GeoLocation = {"lat":63.42156251436995,"lng":10.43866796541505,"accuracy":5000, source: 'singlecell'};
const singlecell2:GeoLocation = {"lat":63.92156251436995,"lng":10.43866796541505,"accuracy":5000, source: 'singlecell'};
export const gnss:GNSSGeoLocation = {"lat":63.42123985,"lng":10.40840864,"accuracy":20, source: 'gnss', hdg:180};

const mapStyle = "map0dd2b65d-loginenv"

function App({signOut, user}: { signOut: (data?: Record<string | number | symbol, any> | undefined) => void; user: {username: string}; }) {
  
  const {settings} = useMapSettings()

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