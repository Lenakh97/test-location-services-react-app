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
export async function listDeviceHistory() {
  const credentials = await Auth.currentCredentials();
  var location = new AWS.Location({
    credentials,
    region: awsconfig.aws_project_region,
  });

  let parameter = {
    DeviceId: "ExampleDevice-23",
    TrackerName: "MyTracker",
    StartTimeInclusive: new Date(
      Date.now() - 48 * 60 * 60 * 1000
    ).toISOString(),
  };

  try {
    const data = await location.getDevicePositionHistory(parameter).promise();
    return data.DevicePositions;
  } catch (err) {
    console.error(err);
    return [];
  }
}
