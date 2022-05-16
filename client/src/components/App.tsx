import { useState } from "react";
import { Map, Location } from "./Map"
import { Search, Adresse } from "./Search"
import axios from 'axios';

function App() {
  const [searchResultat, setSearchResultat] = useState<Adresse[]>([]);
  const [hideResult, setHideResult] = useState(true);
  const [markers, setMarkers] = useState<Location[]>([]);

  return (
    <div>
      <header className="fixed-top">
        <Search hideResult={hideResult} onSelect={(loc) => {
          // Verifie si le marqueur correspond au marqueur courrant
          const cond = ({ long, lat }: Location) => long === loc.long && lat === loc.lat; 

          if (!markers.find(cond)) // Ajout du marqueur
            setMarkers(markers => [...markers, loc]); 
          else // retirer le marqueur
            setMarkers(markers.filter(loc => ! cond(loc))); 
            
        }} onSubmit={(str) => {
          setHideResult(false);

          try {
            if (str === "")
              setSearchResultat([]);
            else
              axios.get(`/contains/${str}`).then((resp: any) => { 
                setSearchResultat(resp.data);
              });
          } catch (err) {
            console.log(err);
          }
        }} resultat={searchResultat} />
      </header>
      <Map markers={markers} />
      <div>

      </div>
    </div>
  );
}

export default App;