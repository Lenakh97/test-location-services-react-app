import { FunctionComponent, useRef } from 'react';
import '@aws-amplify/ui-react/styles.css';
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect } from 'react';
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl-js-amplify/dist/public/amplify-geocoder.css"; // Optional CSS for Amplify recommended styling
import { createAmplifyGeocoder, createMap } from 'maplibre-gl-js-amplify';
import { nanoid } from 'nanoid';
import { makeCircle } from '/home/leha/Documents/coding-projects/test-location-services-react-app/src/functions/makeCircle';
import {GeoLocation, GNSSGeoLocation} from '../App'

const gnss:GNSSGeoLocation = {"lat":63.42123985,"lng":10.40840864,"accuracy":20, source: 'gnss', hdg:180};

const roaming = {roaming: {
    "name": "LenaThingy",
    "mccmnc": 24202,
    "rsrp": -97,
    "band": 20,
    "cell": 33703712,
    "area": 2305,
    "ip": "100.73.120.2",
    "network": "LTE-M"
},
ts: "about 1 month ago"}

const headingX = gnss.lat+(3 * Math.cos((((gnss.hdg - 90) % 360) * Math.PI) / 180));
const headingY = gnss.lng+(3 * Math.sin((((gnss.hdg - 90) % 360) * Math.PI) / 180));

export const Map: FunctionComponent<{
    geoLocations: GeoLocation[]
    headingMarker: GNSSGeoLocation[]
    mapStyle: string
  }> = ({geoLocations, headingMarker, mapStyle}) => {
  
    const divRef = useRef<HTMLDivElement>(null)
  
    useEffect(() => {
      if (divRef.current === null) {
        return
      }
  
      createMap({
        container: divRef.current,
        center: [10.401920000000075, 63.419610000000034],
        zoom: 10,
      }).then(map => {
        console.log("map is finished")
  
        map.addControl(createAmplifyGeocoder());
        map.addControl(new maplibregl.NavigationControl());
        map.setStyle(mapStyle);
  
        map.on('load', () => {
          console.log("map is loaded")
          for(const geoLocation of geoLocations) {
            const id = nanoid()
            const circle = makeCircle(geoLocation.lng, geoLocation.lat, geoLocation.accuracy)         
            map.addSource(`${id}-data`, {
              type: "geojson",
              data: circle,
            });
            let fillColor = 'rgb(246, 194, 112)'
            let info = roaming.roaming.name
            if (geoLocation.source === 'multicell') {
              fillColor = "rgb(229, 99, 153)"
            }
            if (geoLocation.source === 'gnss') {
              fillColor = "#1f56d2"
            }
            map.addLayer({
                  id: id,
                  type: "fill",
                  source: `${id}-data`,
                  paint: {
                    "fill-color": fillColor,
                    "fill-opacity": 0.4
                  },
                });
            //Add onclick popup
            map.on('click', id, function(e){
              new maplibregl.Popup()
              .setLngLat(e.lngLat)
              .setHTML("<b>" + info + "</b>" + "<br />" + 
                        "<b>Accuracy:</b>" + geoLocation.accuracy + "<br />" +
                        "<b>Time:</b>" + "about 1 month ago" + "<br />" +
                        "<b>Source:</b>" + geoLocation.source + "<br />" +
                        "<a href='https://www.google.com/maps/search/?api=1&query=" + geoLocation.lat + "," + geoLocation.lng + "' target='_blank'> View location in google maps <a/> " +
                        "<b>Connection:</b>" + roaming.roaming.rsrp + "<br />" + 
                        "<b>Network:</b>" + roaming.roaming.network + "<br />" +
                        "<b>Band:</b>"+ roaming.roaming.band + "<br />" + 
                        "<b>MCC/MNC:</b>" + roaming.roaming.mccmnc + "<br />" + 
                        "<b>Area code:</b>" + roaming.roaming.area + "<br />" + 
                        "<b>Cell ID:</b>" + roaming.roaming.cell + "<br />" + 
                        "<b>IP:</b>" + roaming.roaming.ip + "<br />" + 
                        "<b>Time:</b>" + roaming.ts)
              .addTo(map);
            })
            // Change the cursor to a pointer when the mouse is over the states layer.
            map.on('mouseenter', id, function () {
              map.getCanvas().style.cursor = 'pointer';
              });
            // Change it back to a pointer when it leaves.
            map.on('mouseleave', id, function () {
            map.getCanvas().style.cursor = '';
            });  
          }
          for(const heading of headingMarker){
            const id = nanoid()
            map.addSource(`${id}-headingRoute`,{
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: [
                    [heading.lng, heading.lat],
                    [headingY, headingX]
                  ]
                }
              } 
            })
            map.addLayer({
              id: `${id}-headingRoute`,
              type: 'line',
              source: `${id}-headingRoute`,
              layout: {
                'line-join': 'round',
                'line-cap': 'round' 
              },
              paint: {
                'line-color': 'black',
                'line-width': 1
              }
            })
          }
          })
          map.resize()
      })
  
      return () => {
        console.debug("Called on unmount")
  
      }
  
    }, [divRef, geoLocations])
  
    return <div ref={divRef} style={{width: '500px', height: '500px'}}>Map goes here</div>
  }