import { FC, useState } from "react"

import { Map as MapBox, Layer, Marker } from 'react-map-gl'; 

 

export type Location = {
  lat: number;
  long: number;
};

interface IMapProp {
  markers: Location[]
}

export const Map: FC<IMapProp> = ({markers}) => {

  const [pos, setPos] = useState<Location>({
    lat: 43.928902,
    long: 2.146400
  });

  return <MapBox
    initialViewState={{
      longitude: pos.long,
      latitude: pos.lat,
      zoom: 12,
      pitch: 50,
    }}
    mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN!} // Accès du token dans le fichier .en.local
    style={{ width: '100vw', height: '100vh' }}
    mapStyle="mapbox://styles/mapbox/streets-v11"
  >
    <Layer id="add-3d-buildings"
      source="composite"
      source-layer="building"
      filter={["==", "extrude", "true"]}
      type="fill-extrusion"
      minzoom={15}
      paint={{
        "fill-extrusion-color": "#aaa",
        // Use an "interpolate" expression to
        // add a smooth transition effect to
        // the buildings as the user zooms in.
        "fill-extrusion-height": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0,
          15.05,
          ["get", "height"]
        ],
        "fill-extrusion-base": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0,
          15.05,
          ["get", "min_height"]
        ],
        "fill-extrusion-opacity": 0.6
      }}
    />
    <Marker longitude={pos.long} latitude={pos.lat} color="#dd5555" anchor="bottom" />
    {markers.map(({long, lat}) => <Marker longitude={long} latitude={lat} anchor="bottom" />)}
  </MapBox>;
}

// export function Mapbox() {
//   return <Map
//     initialViewState={{
//       longitude: -100,
//       latitude: 40,
//       zoom: 3.5
//     }}
//     style={{width: '100vw', height: '100vh'}}
//     mapStyle="mapbox://styles/mapbox/streets-v9"
//     mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN!}
//   />;
// }