import { useRef, useEffect } from "react"
import mapboxgl from "mapbox-gl"

// Grab the access token from your Mapbox account
// I typically like to store sensitive things like this
// in a .env file
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN!

export const Map = () => {
    const mapContainer = useRef(null)


    useEffect(() => {
        // API reference: https://docs.mapbox.com/mapbox-gl-js/api/map/
        const map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/outdoors-v11",
            center: [2.146400, 43.928902],      
            zoom: 12,      
            pitch: 60,      
            //bearing: 80, // Orientation
        });
        // On modifie les couches qu'après que la map s'est completement chargée
        map.on("load", () => 
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
        });
    }, []);

    return (
        <div
            id="map"
            ref={mapContainer}
            style={{ width: "100%", height: "100vh" }}
        />
    )
}
