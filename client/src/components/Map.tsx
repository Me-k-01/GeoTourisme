import * as turf from "@turf/turf";
import { FC, useEffect, useState } from "react";
import { Map as MapBox, Layer, Marker, Source } from 'react-map-gl';

export type Location = {
  lat: number;
  long: number;
};

type Geometry = {
  type: "Point";
  coordinates: number[];
};

interface Trip {
  code: string;
  waypoints: any[];
  trips: {
    geometry: Geometry;
  }[];
}

interface IMapProp {
  markers: Location[],
  markersSecondaires: Location[],
  setMarkers: React.Dispatch<React.SetStateAction<Location[]>>,
  setMarkersSecondaires: React.Dispatch<React.SetStateAction<Location[]>>
}
export const Map: FC<IMapProp> = ({ markers, markersSecondaires, setMarkers, setMarkersSecondaires }) => {
  const [pos, setPos] = useState<Location>({ // Position par défaut: Albi
    lat: 43.928902,
    long: 2.146400
  });

  const [route, setRoute] = useState<turf.FeatureCollection<Geometry, {}>>(turf.featureCollection([]));

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

  const removeMarker = (markers: Location[], marker: Location) =>
    markers.filter(({ long, lat }) =>
      marker.long !== long || marker.lat !== lat
    );

  useEffect(() => {
    const getPath = async (): Promise<Trip | undefined> => {
      const allMarkers = markers.concat(markersSecondaires);

      if (allMarkers.length < 1) {
        setRoute(turf.featureCollection([])); // Reset 
        return;
      }

      const coords = allMarkers.map(({ long, lat }) => `${long},${lat}`).join(';');
      const req = `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${pos.long},${pos.lat};${coords}?overview=full&steps=true&geometries=geojson&source=first&access_token=${process.env.REACT_APP_MAPBOX_TOKEN!}`;
      //&overview=full&steps=true&geometries=geojson&source=first&access_token=${}`
      const query = await fetch(req, { method: 'GET' });
      const response: Trip = await query.json();
      if (response.code !== 'Ok') return;
      return response;
    }

    const createPath = async () => {
      const response = await getPath();
      if (!response) return;

      // Creation d'un GeoJSON feature collection 
      const routeGeoJSON: turf.FeatureCollection<Geometry, {}> = turf.featureCollection([
        turf.feature(response.trips[0].geometry)
      ]);
      setRoute(routeGeoJSON);
    }
    createPath();
  }, [markers, markersSecondaires, pos]); // S'il y a un changement de marqueurs ou de position on update le chemin 

  return <MapBox
    initialViewState={{
      longitude: pos.long,
      latitude: pos.lat,
      zoom: 12,
      pitch: 50,
    }}
    mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN!} // Accès du token dans le fichier .en.local
    mapStyle="mapbox://styles/mapbox/streets-v11"
    onClick={(evt) => {
      evt.preventDefault();
      const pos = evt.lngLat;
      const loc = {
        lat: pos.lat,
        long: pos.lng
      }
      // Limitation du nombres de points:
      if (markers.length + markersSecondaires.length > 10) {
        alert(`Votre parcours comporte trop de lieux.\nLimitez vos choix pour en profiter.`);
      } else {
        setMarkersSecondaires([...markersSecondaires, loc]);
      }
    }}
  >
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

    <Source id="route" type="geojson" data={route}>
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
    <Marker longitude={pos.long} latitude={pos.lat} color="#dd5555" anchor="center" />
    {markers.map((currMarker, i) =>
      <Marker key={i} longitude={currMarker.long} latitude={currMarker.lat} anchor="center"
        onClick={(evt) => {
          evt.originalEvent.preventDefault();
          setMarkers(removeMarker(markers, currMarker));
          evt.originalEvent.stopPropagation();
        }}
      >
        <i className="fa-solid  fa-landmark fa-2xl" ></i>
      </Marker>
    )}
    {markersSecondaires.map((currMarker, i) =>
      <Marker key={i} longitude={currMarker.long} latitude={currMarker.lat} anchor="center"
        onClick={(evt) => {
          evt.originalEvent.preventDefault();
          setMarkersSecondaires(removeMarker(markersSecondaires, currMarker));
          evt.originalEvent.stopPropagation();
        }}
      >
      </Marker>
    )}
  </MapBox>;
}