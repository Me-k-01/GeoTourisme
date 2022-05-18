import { useEffect, useState } from "react";
import { Map, Location } from "./Map";
import axios from 'axios';
import { SideInterface } from "./SideInterface";


function App() {
  const [markers, setMarkers] = useState<Location[]>([]);
  const [markersSecondaires, setMarkersSecondaires] = useState<Location[]>([]);
  const totalMarker = markers.length + markersSecondaires.length + 1;
  const [pos, setPos] = useState<Location>({ // Position par défaut: Albi
    lat: 43.928902,
    long: 2.146400
  });

  useEffect(() => {
    if (!localStorage.getItem('uuid')) // Générer un nouveau user id 
      axios.get(`/newUser/`).then(uuid => {
        if (typeof uuid !== "string") {
          throw 'Parameter is not a string!';
        }
        localStorage.setItem('uuid', uuid);
      }); 
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

  return (
    <>
      <SideInterface pos={pos} markers={markers} setMarkers={setMarkers} totalMarker={totalMarker} />
      <Map pos={pos} markers={markers} setMarkers={setMarkers} markersSecondaires={markersSecondaires} setMarkersSecondaires={setMarkersSecondaires} />
    </>
  );
}

export default App;