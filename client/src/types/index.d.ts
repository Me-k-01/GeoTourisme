/*declare namespace mapboxgl {

    export interface DirectionOptions {
        unit?: string; 
        profile?: string;
        container?: string;
        proximity?: Array<number>;
    }

    export default class MapBoxDirections  extends Control {
        constructor(options?: DirectionOptions)
    
        code: string
        uuid: string
        waypoints: {
            distance: number
            name: string
            location: number[]
        }[]
        routes: {
            distance: number
            duration: number
            geometry: {
                coordinates: number[][]
                type: string
            }
            legs: {
                admins: {
                    iso_3166_1: string
                    iso_3166_1_alpha3: string
                }[]
                distance: number
                duration: number
                steps: []
                summary: string
                weight: number
            }[]
            weight: number
            weight_name: string
        }[]
    }
}
*/

declare module '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions' {
    import { Control } from "mapbox-gl"

    export interface DirectionOptions {
        unit?: string; 
        profile?: string;
        container?: string;
        proximity?: Array<number>;
        accessToken: string;
    }

    export default class MapBoxDirections  extends Control {
        constructor(options?: DirectionOptions)
    
        code: string
        uuid: string
        waypoints: {
            distance: number
            name: string
            location: number[]
        }[]
        routes: {
            distance: number
            duration: number
            geometry: {
                coordinates: number[][]
                type: string
            }
            legs: {
                admins: {
                    iso_3166_1: string
                    iso_3166_1_alpha3: string
                }[]
                distance: number
                duration: number
                steps: []
                summary: string
                weight: number
            }[]
            weight: number
            weight_name: string
        }[]
    }
}

declare module "react/jsx-runtime" {
    export default any;
}