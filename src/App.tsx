import "./App.css";
import { Button, withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "maplibre-gl/dist/maplibre-gl.css";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl-js-amplify/dist/public/amplify-geocoder.css"; // Optional CSS for Amplify recommended styling
import { useMapSettings } from "./hooks/useMapSettings";
import { MapSettings } from "./components/MapSettings";
import { Map } from "./components/Map";
import { useEffect, useState } from "react";

export type GeoLocation = {
  lat: number;
  lng: number;
  accuracy: number;
  source: "singlecell" | "multicell" | "gnss";
};

export type GNSSGeoLocation = GeoLocation & {
  source: "gnss";
  hdg: number;
};

const multicell: GeoLocation = {
  lat: 63.42123985,
  lng: 10.40840864,
  accuracy: 2408,
  source: "multicell",
};
const singlecell1: GeoLocation = {
  lat: 63.42156251436995,
  lng: 10.43866796541505,
  accuracy: 5000,
  source: "singlecell",
};
const singlecell2: GeoLocation = {
  lat: 63.52156251436995,
  lng: 10.43866796541505,
  accuracy: 5000,
  source: "singlecell",
};
const gnss: GNSSGeoLocation = {
  lat: 63.42123985,
  lng: 10.40840864,
  accuracy: 20,
  source: "gnss",
  hdg: 180,
};
const multicell_history1: GeoLocation = {
  lat: 63.42123985,
  lng: 10.40840864,
  accuracy: 2408,
  source: "multicell",
};
const multicell_history2: GeoLocation = {
  lat: 63.42123985,
  lng: 10.42840864,
  accuracy: 2408,
  source: "multicell",
};
const multicell_history3: GeoLocation = {
  lat: 63.42123985,
  lng: 10.44840864,
  accuracy: 2408,
  source: "multicell",
};
const multicell_history4: GeoLocation = {
  lat: 63.42123985,
  lng: 10.46840864,
  accuracy: 2408,
  source: "multicell",
};
const multicell_history5: GeoLocation = {
  lat: 63.42123985,
  lng: 10.48840864,
  accuracy: 2408,
  source: "multicell",
};
const singlecell_history1: GeoLocation = {
  lat: 63.43123985,
  lng: 10.40840864,
  accuracy: 5000,
  source: "singlecell",
};
const singlecell_history2: GeoLocation = {
  lat: 63.54123985,
  lng: 10.40840864,
  accuracy: 5000,
  source: "singlecell",
};
const singlecell_history3: GeoLocation = {
  lat: 63.65123985,
  lng: 10.40840864,
  accuracy: 5000,
  source: "singlecell",
};
const singlecell_history4: GeoLocation = {
  lat: 63.76123985,
  lng: 10.40840864,
  accuracy: 5000,
  source: "singlecell",
};
const singlecell_history5: GeoLocation = {
  lat: 63.87123985,
  lng: 10.40840864,
  accuracy: 5000,
  source: "singlecell",
};

function App({
  signOut,
  user,
}: {
  signOut: (data?: Record<string | number | symbol, any> | undefined) => void;
  user: { username: string };
}) {
  const { settings } = useMapSettings();
  const [mapStyle, setMapStyle] = useState("map0dd2b65d-loginenv");

  const locations: (GeoLocation | GNSSGeoLocation)[] = [
    singlecell1,
    singlecell2,
    multicell,
    gnss,
  ];

  const test_SingleMulti_history: (GeoLocation | GNSSGeoLocation)[] = [
    singlecell_history1,
    singlecell_history2,
    singlecell_history3,
    singlecell_history4,
    singlecell_history5,
    multicell_history1,
    multicell_history2,
    multicell_history3,
    multicell_history4,
    multicell_history5,
  ];

  const locationsToShowOnMap = locations.filter(({ source }) => {
    switch (source) {
      case "multicell":
        return settings.multicell;
      case "singlecell":
        return settings.singlecell;
      case "gnss":
        return settings.GNSS;
      default:
        return false;
    }
  });

  const locationsWithHeading: GNSSGeoLocation[] = locations.filter(
    ({ source }): boolean => {
      if (!settings.headingMarker) return false;
      if (source === "gnss") return true;
      return false;
    }
  ) as GNSSGeoLocation[];

  const locationsWithGNSSHistory: GNSSGeoLocation[] = locations.filter(
    ({ source }): boolean => {
      if (!settings.GNSSHistory) return false;
      if (source === "gnss") return true;
      return false;
    }
  ) as GNSSGeoLocation[];

  const locationsWithHistory = test_SingleMulti_history.filter(({ source }) => {
    switch (source) {
      case "multicell":
        return settings.multicellHistory;
      case "singlecell":
        return settings.singlecellHistory;
      case "gnss":
        return settings.GNSSHistory;
      default:
        return false;
    }
  });

  return (
    <div className="App">
      <h1> </h1>
      <>
        <Button
          onClick={() => {
            setMapStyle("map0dd2b65d-loginenv");
          }}
        >
          Normal Map
        </Button>
        <Button
          onClick={() => {
            setMapStyle("LenasDarkMap");
          }}
        >
          Dark mode
        </Button>
        <Button
          onClick={() => {
            setMapStyle("LenasFlightPhotoMap");
          }}
        >
          Flight Photo
        </Button>
      </>
      <Map
        geoLocations={locationsToShowOnMap}
        headingMarker={locationsWithHeading}
        locationHistory={locationsWithHistory}
        locationsWithGNSSHistory={locationsWithGNSSHistory}
        mapStyle={mapStyle}
      />
      <h1>Hello {user.username}</h1>
      <MapSettings />
      <button onClick={signOut}>Sign out</button>
    </div>
  );
}

export default withAuthenticator(App);
