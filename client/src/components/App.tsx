import { useEffect, useState } from "react";
import { Map, Location } from "./Map";
import axios from 'axios';
import { SideInterface } from "./SideInterface";


function App() {
  const [markers, setMarkers] = useState<Location[]>([]);
  const [markersSecondaires, setMarkersSecondaires] = useState<Location[]>([]);
  const totalMarker = markers.length + markersSecondaires.length + 1;

  useEffect(() => {
    if (!localStorage.getItem('uuid')) // Générer un nouveau user id
      axios.get(`/newUser/`).then(uuid => {
        if (typeof uuid !== "string") {
          throw 'Parameter is not a string!';
        }
        localStorage.setItem('uuid', uuid);
      });
  }, []);

  return (
    <>
      <SideInterface markers={markers} setMarkers={setMarkers} totalMarker={totalMarker} />
      <Map markers={markers} setMarkers={setMarkers} markersSecondaires={markersSecondaires} setMarkersSecondaires={setMarkersSecondaires} />
    </>
  );
}

export default App;