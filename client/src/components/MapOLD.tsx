import { useRef, useEffect, useState } from "react"
import mapboxgl from "mapbox-gl"
import turf from "turf"

// Accès du token dans le fichier .en.local
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN!

type Localisaiton = {
    lat: number;
    long: number;
};

export const Map = () => {
    // réference d'API: https://docs.mapbox.com/mapbox-gl-js/api/map/
    const mapContainer = useRef(null); 
    const map = useRef(null); 
    const [zoom, setZoom] = useState(9);

    const [loc, setLoc] = useState<Localisaiton>({
        lat: 43.928902,
        long: 2.146400
    });

    function onSuccess(pos: GeolocationPosition) {
        console.log("position actuelle:", pos);
        setLoc({
            lat: pos.coords.latitude,
            long: pos.coords.longitude
        }) 
    }
    function onError() {
    }

    if (!navigator.geolocation) {
        console.error("Géolocalisation non supportée");
    } else {
        navigator.geolocation.getCurrentPosition(onSuccess, onError, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    }

    // Create a GeoJSON feature collection for drop-off locations
    const dropoffs = turf.featureCollection([turf.point([43.9304, 2.14427])]);

    useEffect(() => {
        // Pas besoin de recharger à chaques changements de position la map
        const map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v11",
            center: [loc.long, loc.lat], 
            zoom: 12,
            pitch: 0,
            //bearing: 80, // Orientation
        });
        // On modifie les couches qu'après que la map s'est completement chargée
        map.on("load", async () => {
            map.addLayer({
                id: "add-3d-buildings",
                source: "composite",
                "source-layer": "building",
                filter: ["==", "extrude", "true"],
                type: "fill-extrusion",
                minzoom: 15,
                paint: {
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
                }
            });

            // Creer un nouveau marqueur
            const marker = document.createElement('div');
            marker.classList.add('marker');
            new mapboxgl.Marker(marker).setLngLat([loc.long, loc.lat]).addTo(map);


            map.addLayer({
                id: 'interest-point-symbol',
                type: 'symbol',
                source: {
                    data: dropoffs,
                    type: 'geojson'
                },
                layout: {
                    'icon-image': 'grocery-15',
                    'icon-size': 1
                },
                paint: {
                    'text-color': '#3887be'
                }
            });
            /*
            map.addLayer(
            {
                id: 'routearrows',
                type: 'symbol',
                source: 'route',
                layout: {
                    'symbol-placement': 'line',
                    'text-field': '▶',
                    'text-size': ['interpolate', ['linear'], ['zoom'], 12, 24, 22, 60],
                    'symbol-spacing': ['interpolate', ['linear'], ['zoom'], 12, 30, 22, 160],
                    'text-keep-upright': false
                },
                paint: {
                    'text-color': '#3887be',
                    'text-halo-color': 'hsl(55, 11%, 96%)',
                    'text-halo-width': 3
                }
              },
              'waterway-label'
            );*/
            return map;
        }
        );


        // Add geolocate control to the map.
        map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            // When active the map will receive updates to the device's location as it changes.
            trackUserLocation: true,
            // Draw an arrow next to the location dot to indicate which direction the device is heading.
            showUserHeading: true
        })
        );
    }, []);

    return (
        <div
            id="map"
            ref={mapContainer}
            style={{ width: "100%", height: "100vh" }}
        />
    )
}
