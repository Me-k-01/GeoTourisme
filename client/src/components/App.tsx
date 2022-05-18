import { useState } from "react";
import { Map, Location } from "./Map";
import {SideInterface} from "./SideInterface";

function App() {
  const [markers, setMarkers] = useState<Location[]>([]);
  const [markersSecondaires, setMarkersSecondaires] = useState<Location[]>([]);
  const totalMarker = markers.length + markersSecondaires.length + 1;
 

  return (
    <>
      <SideInterface markers={markers} setMarkers={setMarkers} totalMarker={totalMarker} /> 
      <Map markers={markers} setMarkers={setMarkers} markersSecondaires={markersSecondaires} setMarkersSecondaires={setMarkersSecondaires} />
    </>
  );
}

export default App;