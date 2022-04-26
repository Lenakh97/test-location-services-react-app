import { nanoid } from "nanoid";
import { GeoLocation } from "../App";

const gnssHistory = [
  {
    DeviceId: "ExampleDevice-12",
    Position: [10.401920000000075, 63.419610000000034],
    ReceivedTime: "2022-04-26T08:26:42.269000+00:00",
    SampleTime: "2022-04-23T09:15:32+00:00",
  },
  {
    DeviceId: "ExampleDevice-12",
    Position: [10.421924000001075, 63.429611000100034],
    ReceivedTime: "2022-04-26T08:26:42.269000+00:00",
    SampleTime: "2022-04-23T09:25:32+00:00",
  },
  {
    DeviceId: "ExampleDevice-12",
    Position: [10.403922000002075, 63.439612000200034],
    ReceivedTime: "2022-04-26T08:26:42.269000+00:00",
    SampleTime: "2022-04-23T09:35:32+00:00",
  },
  {
    DeviceId: "ExampleDevice-12",
    Position: [10.426929000003075, 63.459613000300034],
    ReceivedTime: "2022-04-26T08:26:42.269000+00:00",
    SampleTime: "2022-04-23T09:45:32+00:00",
  },
  {
    DeviceId: "ExampleDevice-12",
    Position: [10.401920000004075, 63.4196106000400034],
    ReceivedTime: "2022-04-26T08:26:42.269000+00:00",
    SampleTime: "2022-04-23T09:55:32+00:00",
  },
];

export function drawHistory(
  locationHistory: GeoLocation[],
  map: maplibregl.Map
) {
  for (const history of locationHistory) {
    const id = nanoid();
    const arr = [];
    for (const position of gnssHistory) {
      arr.push(position.Position);
    }
    //add history
    map.addSource(`${id}-history`, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: arr,
        },
      },
    });
    map.addLayer({
      id: `${id}-history`,
      type: "line",
      source: `${id}-history`,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "dark blue",
        "line-width": 1,
        "line-dasharray": [10, 4],
      },
    });
  }
}
