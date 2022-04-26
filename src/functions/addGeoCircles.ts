import { GeoLocation } from "../App";
import { nanoid } from "nanoid";
import { makeCircle } from "./makeCircle";
import maplibregl from "maplibre-gl";

const roaming = {
  roaming: {
    name: "LenaThingy",
    mccmnc: 24202,
    rsrp: -97,
    band: 20,
    cell: 33703712,
    area: 2305,
    ip: "100.73.120.2",
    network: "LTE-M",
  },
  ts: "about 1 month ago",
};

export function addGeoCircles(
  geoLocations: GeoLocation[],
  map: maplibregl.Map
) {
  for (const geoLocation of geoLocations) {
    const id = nanoid();
    const circle = makeCircle(
      geoLocation.lng,
      geoLocation.lat,
      geoLocation.accuracy
    );

    //Add geoCircles
    map.addSource(`${id}-data`, {
      type: "geojson",
      data: circle,
    });
    let fillColor = "rgb(246, 194, 112)";
    let info = roaming.roaming.name;
    if (geoLocation.source === "multicell") {
      fillColor = "rgb(229, 99, 153)";
    }
    if (geoLocation.source === "gnss") {
      fillColor = "#1f56d2";
    }
    map.addLayer({
      id: id,
      type: "fill",
      source: `${id}-data`,
      paint: {
        "fill-color": fillColor,
        "fill-opacity": 0.4,
      },
    });

    //Add onclick popup
    map.on("click", id, function (e) {
      new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(
          "<b>" +
            info +
            "</b>" +
            "<br />" +
            "<b>Accuracy:</b>" +
            geoLocation.accuracy +
            "<br />" +
            "<b>Time:</b>" +
            "about 1 month ago" +
            "<br />" +
            "<b>Source:</b>" +
            geoLocation.source +
            "<br />" +
            "<a href='https://www.google.com/maps/search/?api=1&query=" +
            geoLocation.lat +
            "," +
            geoLocation.lng +
            "' target='_blank'> View location in google maps <a/> " +
            "<b>Connection:</b>" +
            roaming.roaming.rsrp +
            "<br />" +
            "<b>Network:</b>" +
            roaming.roaming.network +
            "<br />" +
            "<b>Band:</b>" +
            roaming.roaming.band +
            "<br />" +
            "<b>MCC/MNC:</b>" +
            roaming.roaming.mccmnc +
            "<br />" +
            "<b>Area code:</b>" +
            roaming.roaming.area +
            "<br />" +
            "<b>Cell ID:</b>" +
            roaming.roaming.cell +
            "<br />" +
            "<b>IP:</b>" +
            roaming.roaming.ip +
            "<br />" +
            "<b>Time:</b>" +
            roaming.ts
        )
        .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the states layer.
    map.on("mouseenter", id, function () {
      map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.on("mouseleave", id, function () {
      map.getCanvas().style.cursor = "";
    });
  }
}
