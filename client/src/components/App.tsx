import { useState } from "react";
import { Map } from "./Map"
import {Search, Adresse} from "./Search"

const axios = require('axios');

function App() {
  const [searchResultat, setSearchResultat] = useState<Adresse[]>([]);
  const [hideResult, setHideResult] = useState(true);

  //Début code de géolocalisation 
  const [lat, setlat] = useState();
  const [long, setlong] = useState();

  if(!navigator.geolocation) {
    //Géolocalisation non supportée
  } else {
    navigator.geolocation.getCurrentPosition(success, error, {enableHighAccuracy: true,
                                                              timeout: 5000,
                                                              maximumAge: 0});
  }

  function success(pos: any) {
    console.log(pos);
    setlat(pos.coords.latitude);
    setlong(pos.coords.longitude);
  }

  function error() {}
  //Fin code géolocalisation

  //Toutes les 2s on va regarder ce qu'il y a autour
  function nearby(latbis : any,longbis : any){
    console.log("exploration de lat : " + latbis + " long : " + longbis);

    try {
      axios.get(`/near/${lat}/${long}`).then((resp: any) => {
        console.log(resp.data)
      });
    } catch (err) {
      console.log(err);
    }

    //setTimeout(nearby,5000);
  }

  nearby(43.928902,2.146400);
  //nearby(lat,long);

  return (
    <div>
      <header className="fixed-top">
        <Search hideResult={hideResult} onSubmit={(str) => {
          setHideResult(false);

          try {
            if (str === "")
              setSearchResultat([]);
            else 
              axios.get(`/contains/${str}`).then((resp: any) => {
                console.log(resp.data);
                setSearchResultat(resp.data);
              });
          } catch (err) {
            console.log(err);
          }
        }} resultat={searchResultat} />
      </header>
      <Map />
      <div>

      </div>
    </div>
  );
}

export default App;
