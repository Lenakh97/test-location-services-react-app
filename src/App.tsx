import React from 'react';
import logo from './logo.svg';
import './App.css';

import Amplify, { Auth } from 'aws-amplify';
import Location from "aws-sdk/clients/location";
import awsconfig from './aws-exports';
import { create } from 'domain';

Amplify.configure(awsconfig);

const createClient = async () => {
    const credentials = await Auth.currentCredentials();
    const client = new Location({
        credentials,
        region: awsconfig.aws_project_region,
   });
   return client;
}

function App() {
  const client = createClient;
  const params = {
    IndexName: "MyPlaceIndex",
    Position: [78.6165983, 13.2783941]
  };
  client.searchPlaceIndexForPosition(params, (err, data) => {
    if (err) console.error(err)
    if (data) console.log(data)
  })
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
