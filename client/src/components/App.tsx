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
      axios.get(`/newUser/`).then((uuid) => {
        if (typeof uuid !== "string") {
          throw 'Parameter is not a string!';
        }
        localStorage.setItem('uuid', uuid);
      });
  }, [])


  //Toutes les 5s on va regarder ce qu'il y a autour
  function nearby(latbis : number,longbis : number){
    console.log("exploration de lat : " + latbis + " long : " + longbis);

    try {
      axios.get(`/near/${latbis}/${longbis}`).then((resp: any) => {
        console.log(resp)
      });
    } catch (err) {
      console.log(err);
    }

    //setTimeout(nearby,10000);
  };

  //nearby(lat,long);

  //fonction récupération de la note
  //Entrée : nom du lieu ; Sortie : note moyenne du lieux

  function showMark(nom : string){
    console.log("Quel est la moyenne de " + nom + " ?");

    try {
      axios.get(`/noteM/${nom}`).then((resp: any) => {
        console.log(resp.data)
        return(resp)
      });
    } catch (err) {
      console.log(err);
    }
  };

  //showMark("Cathedrale Sainte-Cecile");

  //fonction ajouter une note
  //Entrées : nom du lieu + note utilisateur + id utilisateur

  function addMark(nom : string, note : number , id : number){
    console.log("ajout à " + nom + " la note " + note + " de la part de " + id);

    try {
      axios.post(`/addNote/${nom}/${note}/${id}`).then((resp: any) => {
        console.log(resp.data)
        return(resp)
      });
    } catch (err) {
      console.log(err);
    }
  };

  //addMark("Cathedrale Sainte-Cecile",4,4);

  return (
    <>
      <SideInterface markers={markers} setMarkers={setMarkers} totalMarker={totalMarker} />
      <Map markers={markers} setMarkers={setMarkers} markersSecondaires={markersSecondaires} setMarkersSecondaires={setMarkersSecondaires} />
    </>
  );
}

export default App;