import maplibregl from "maplibre-gl";
import { GeoLocation, GNSSGeoLocation } from "../App";
import { nanoid } from "nanoid";

export function addHeadingmarker(
  headingMarker: GNSSGeoLocation[],
  map: maplibregl.Map,
  headingX: number,
  headingY: number
) {
  for (const heading of headingMarker) {
    const id = nanoid();
    map.addSource(`${id}-headingRoute`, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [
            [heading.lng, heading.lat],
            [headingY, headingX],
          ],
        },
      },
    });
    map.addLayer({
      id: `${id}-headingRoute`,
      type: "line",
      source: `${id}-headingRoute`,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "black",
        "line-width": 1,
      },
    });
  }
}
