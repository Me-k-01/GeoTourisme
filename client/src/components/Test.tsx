import { FeatureCollection, Geometry } from '@turf/turf';

// type GeoJsonProperties = { [name: string]: any; } | null;
import * as React from 'react';
import Map, { Source, Layer, LayerProps } from 'react-map-gl';

const geojson = {
    type: 'FeatureCollection' as const,
    features: [
        {
            type: 'Feature' as const, geometry:
            {
                type: 'Point' as const, coordinates: [-122.4, 37.8]
            },
            properties: {}
        }
    ]
};
const geojsonFeature = {
    type: 'Feature' as const,
    properties: {
        name: 'Coors Field',
        amenity: 'Baseball Stadium',
        popupContent: 'This is where the Rockies play!'
    },
    geometry: {
        type: 'Point' as const,
        coordinates: [-104.99404, 39.75621]
    }
};


const layerStyle: LayerProps = {
    id: 'point',
    type: 'circle' as const,
    paint: {
        'circle-radius': 10,
        'circle-color': '#007cbf'
    }
};

function Test() {
    return <Map
        initialViewState={{
            longitude: -122.4,
            latitude: 37.8,
            zoom: 14
        }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
    >
        <Source id="my-data" type="geojson" data={geojson}>
            <Layer {...layerStyle} />
        </Source>
    </Map>;
}