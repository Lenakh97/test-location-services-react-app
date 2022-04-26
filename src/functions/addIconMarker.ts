import maplibregl from "maplibre-gl";
import { GNSSGeoLocation } from "../App";

export function addIconMarker(map: maplibregl.Map, gnss: GNSSGeoLocation) {
  map.loadImage(
    "http://maps.google.com/mapfiles/ms/icons/blue.png",
    function (error: Error, image: any) {
      if (error) throw error;
      map.addImage("cat", image);
      map.addSource("point", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Point",
                coordinates: [gnss.lng, gnss.lat],
              },
            },
          ],
        },
      });
      map.addLayer({
        id: "points",
        type: "symbol",
        source: "point",
        layout: {
          "icon-image": "cat",
          "icon-size": 1,
        },
      });
    }
  );
}
