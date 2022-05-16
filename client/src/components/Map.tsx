import * as turf from "@turf/turf"
import { FC, useEffect, useRef, useState } from "react"
import { Map as MapBox, Layer, Marker, Source } from 'react-map-gl';

export type Location = {
  lat: number;
  long: number;
};

interface Trip {
  code: string;
  waypoints: any[];
  // trips: turf.Feature<any, any>[];
  // trips: turf.Feature<turf.Geometry, turf.GeoJsonProperties>[];
  // trips: {
  //   geometry: string;
  // }[];
  trips: any;
}

interface IMapProp {
  markers: Location[]
}

export const Map: FC<IMapProp> = ({ markers }) => {
  const [pos, setPos] = useState<Location>({
    lat: 43.928902,
    long: 2.146400
  });
  const mapRef = useRef<any>();

  // const [route, setRoute ] = useState<turf.helpers.FeatureCollection<any, turf.Properties>>();
  const [route, setRoute] = useState<turf.FeatureCollection<any, any>>(turf.featureCollection([]));

  useEffect(() => {
    ///////// Géolocalisation /////////
    if (!navigator.geolocation)
      console.error("Géolocalisation non supportée");
    else
      setInterval(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
          // console.log("Votre position actuelle:", pos);
          setPos({
            lat: pos.coords.latitude,
            long: pos.coords.longitude
          });
        }, null, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      }, 5000);
    ///////////////////////////////
  }, []);

  // const geolocateControlRef = useCallback((ref) => {
  //   if (ref) {
  //     // Activate as soon as the control is loaded
  //     ref.trigger();
  //   }
  // }, []);
  const getPath = async (): Promise<Trip | undefined> => {
    if (markers.length < 2) return;

    const coords = markers.map(({ long, lat }) => `${long},${lat}`).join(';');
    const req = `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${pos.long},${pos.lat};${coords}?access_token=${process.env.REACT_APP_MAPBOX_TOKEN!}`;
    //&overview=full&steps=true&geometries=geojson&source=first&access_token=${}`
    const query = await fetch(req, { method: 'GET' });
    const response: Trip = await query.json();
    if (response.code !== 'Ok') return;
    return response;
  }

  const createPath = async () => {
    const response = await getPath();
    if (!response) return;
    console.log(response);

    // Creation d'un GeoJSON feature collection
    const routeGeoJSON = turf.featureCollection([
      turf.feature(response.trips[0])
    ]);
    console.log(routeGeoJSON);
    // TODO: trouver une solution
    // setRoute(routeGeoJSON);  
    
    if (mapRef && mapRef.current) {  
      mapRef.current.getSource('route').setData(routeGeoJSON); // Même la méthode classique ne marche pas
    }
  }
  useEffect(() => {
    createPath();
  }, [markers, pos]);

  return <MapBox ref={mapRef}
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
    {/* <GeolocateControl ref={geolocateControlRef} trackUserLocation={true}
      onGeolocate={(pos) => {
        console.log("pos:", pos); 
      }}
    /> */}
    <Layer id="add-3d-buildings" source="composite" source-layer="building"
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
    <Source id="route" type="geojson" data={ route}>
      <Layer id='routeline-active' type='line'
        layout={{
          'line-join': 'round',
          'line-cap': 'round'
        }}
        paint={{
          'line-color': '#3887be',
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 3, 22, 12]
        }}
      />
      <Layer id='routearrows' type='symbol'
        layout={{
          'symbol-placement': 'line',
          'text-field': '▶',
          'text-size': ['interpolate', ['linear'], ['zoom'], 12, 24, 22, 60],
          'symbol-spacing': ['interpolate', ['linear'], ['zoom'], 12, 30, 22, 160],
          'text-keep-upright': false
        }}
        paint={{
          'text-color': '#3887be',
          'text-halo-color': 'hsl(55, 11%, 96%)',
          'text-halo-width': 3
        }} />
    </Source>
    <Marker longitude={pos.long} latitude={pos.lat} color="#dd5555" anchor="bottom" />
    {markers.map(({ long, lat }, i) =>
      <Marker key={i} longitude={long} latitude={lat} anchor="bottom" />
    )}
  </MapBox>;
}