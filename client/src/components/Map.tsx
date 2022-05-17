import { wait } from "@testing-library/user-event/dist/utils";
import * as turf from "@turf/turf"
import { FC, useEffect, useState } from "react"
import { Map as MapBox, Layer, Marker, Source } from 'react-map-gl';
import App from "./App";

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
    setMarkers: Function,
    setMarkersSecondaires: Function
}
export const Map: FC<IMapProp> = ({ markers, markersSecondaires, setMarkers, setMarkersSecondaires }) => {
    const allMarkers = markers.concat(markersSecondaires);

    const [pos, setPos] = useState<Location>({
        lat: 43.928902,
        long: 2.146400
    });

    const [route, setRoute] = useState<turf.FeatureCollection<Geometry, {}>>(turf.featureCollection([]));
    const [editRoute, setEditRoute] = useState<boolean>(false);

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
  useEffect(() => {
    const getPath = async (): Promise<Trip | undefined> => {
      if (allMarkers.length < 1) {
        setRoute(turf.featureCollection([]));
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
  }, [markers, pos]); // S'il y a un changement de marqueurs ou de position on update le chemin

    return <MapBox
        initialViewState={{
            longitude: pos.long,
            latitude: pos.lat,
            zoom: 12,
            pitch: 50,
        }}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN!} // Accès du token dans le fichier .en.local
        style={{ flexGrow: 1, width: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onClick={function (e) {
            e.preventDefault();
            if (editRoute) {
                setEditRoute(false);
                return;
            }
            const pos = e.lngLat;
            const loc = {
                lat: pos.lat,
                long: pos.lng
            }
            console.log(loc);
            //Limitation du nombres de points:
            if (allMarkers.length >= 10) {
                alert(`Votre parcours comporte trop de lieux.\n
                Limitez vos choix pour en profiter.`);
            }
            else {
                markersSecondaires.push(loc);
                setMarkersSecondaires(markersSecondaires);
            }
        }}
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
        {markers.map(({ long, lat }, i) =>
            <Marker key={i} longitude={long} latitude={lat} anchor="center"
                onClick={function (e) {
                    e.originalEvent.preventDefault();
                    setEditRoute(true);
                    const cond = (lng: number, lt: number) => lng === long && lt === lat;
                    setMarkers(markers.filter(loc => !cond(loc.long, loc.lat)));
                }}
            >
                <i className="fa-solid  fa-landmark fa-2xl" ></i>
            </Marker>
        )}
        {markersSecondaires.map(({ long, lat }, i) =>
            <Marker key={i} longitude={long} latitude={lat} anchor="center"
                onClick={function (e) {
                    e.originalEvent.preventDefault();
                    setEditRoute(true);
                    const cond = (lng: number, lt: number) => lng === long && lt === lat;
                    setMarkersSecondaires(markersSecondaires.filter(loc => !cond(loc.long, loc.lat)));
                }}
            >
            </Marker>
        )}
    </MapBox>;
}