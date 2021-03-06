import "../App.css";
import "@aws-amplify/ui-react/styles.css";
import Amplify, { Auth } from "aws-amplify";
import "maplibre-gl/dist/maplibre-gl.css";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl-js-amplify/dist/public/amplify-geocoder.css"; // Optional CSS for Amplify recommended styling
import awsconfig from "../aws-exports";

Amplify.configure(awsconfig);
const AWS = require("aws-sdk");

export async function searchPlaceIndexForPosition() {
  // Send device position updates
  const credentials = await Auth.currentCredentials();
  var location = new AWS.Location({
    credentials,
    region: awsconfig.aws_project_region,
  });
  const params = {
    IndexName: "LenasPlaceIndex-loginenv",
    Position: [10.401920000000075, 63.419610000000034],
  };
  location.searchPlaceIndexForPosition(params, (err: Error, data: object) => {
    if (err) console.error(err);
    if (data) console.log(data);
  });

  await location
    .batchUpdateDevicePosition({
      TrackerName: "MyTracker",
      Updates: [
        {
          DeviceId: "ExampleDevice-23",
          Position: [10.401920000004075, 63.4196106000400034],
          SampleTime: "2022-05-04T13:10:07.327Z",
        },
        {
          DeviceId: "ExampleDevice-12",
          Position: [-125.3124, 49.324],
          SampleTime: "2022-05-04T22:15:32Z",
        },
      ],
    })
    .promise();
}
