import { FunctionComponent, useRef } from "react";
import "@aws-amplify/ui-react/styles.css";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl-js-amplify/dist/public/amplify-geocoder.css"; // Optional CSS for Amplify recommended styling
import { createAmplifyGeocoder, createMap } from "maplibre-gl-js-amplify";
import { GeoLocation, GNSSGeoLocation } from "../App";
import { addHistory } from "../functions/addHistory";
import { addHeadingmarker } from "../functions/addHeadingmarker";
import { addGeoCircles } from "../functions/addGeoCircles";
import { addIconMarker } from "../functions/addIconMarker";

const gnss: GNSSGeoLocation = {
  lat: 63.42123985,
  lng: 10.40840864,
  accuracy: 20,
  source: "gnss",
  hdg: 180,
};

const headingX =
  gnss.lat + 3 * Math.cos((((gnss.hdg - 90) % 360) * Math.PI) / 180);
const headingY =
  gnss.lng + 3 * Math.sin((((gnss.hdg - 90) % 360) * Math.PI) / 180);

export const Map: FunctionComponent<{
  geoLocations: GeoLocation[];
  headingMarker: GNSSGeoLocation[];
  locationsWithGNSSHistory: GNSSGeoLocation[];
  mapStyle: string;
  locationHistory: GeoLocation[];
}> = ({
  geoLocations,
  headingMarker,
  locationsWithGNSSHistory,
  locationHistory,
  mapStyle,
}) => {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current === null) {
      return;
    }

    createMap({
      container: divRef.current,
      center: [10.401920000000075, 63.419610000000034],
      zoom: 10,
    }).then((map) => {
      console.log("map is finished");

      map.addControl(createAmplifyGeocoder());
      map.addControl(new maplibregl.NavigationControl());
      map.setStyle(mapStyle);

      map.on("load", () => {
        console.log("map is loaded");
        //Add Marker
        addIconMarker(map, gnss);

        //Add geocircles for multicell and singlecell with onclick information
        addGeoCircles(geoLocations, map);

        //Add geocircles for multicell history and singlecell history with onclick information
        addGeoCircles(locationHistory, map);

        //Add headingmarkers
        addHeadingmarker(headingMarker, map, headingX, headingY);

        //draw history
        addHistory(locationsWithGNSSHistory, map);
      });
      map.resize();
    });

    return () => {
      console.debug("Called on unmount");
    };
  }, [divRef, geoLocations]);

  return (
    <div ref={divRef} style={{ width: "500px", height: "500px" }}>
      Map goes here
    </div>
  );
};
