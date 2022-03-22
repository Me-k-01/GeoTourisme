import { useRef, useEffect } from "react"
import mapboxgl from "mapbox-gl"

// Grab the access token from your Mapbox account
// I typically like to store sensitive things like this
// in a .env file
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN!

export const Map = () => {
  const mapContainer = useRef(null)

  // this is where all of our map logic is going to live
  // adding the empty dependency array ensures that the map
  // is only created once
  useEffect(() => {
    // create the map and configure it
    // check out the API reference for more options
    // https://docs.mapbox.com/mapbox-gl-js/api/map/
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/satellite-streets-v11",
      center: [-119.99959421984575, 38.619551620333496],
      zoom: 14,
    })
  }, [])

  return (
    <div
      id="map"
      ref={mapContainer}
      style={{ width: "100%", height: "100vh" }}
    />
  )
}
