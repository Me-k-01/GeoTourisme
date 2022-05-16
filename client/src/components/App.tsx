import { useState } from "react";
import { Map, Location } from "./Map"
import {Search, Adresse} from "./Search"
import axios from 'axios';

function App() {
  const [searchResultat, setSearchResultat] = useState<Adresse[]>([]);
  const [hideResult, setHideResult] = useState(true);
  const [markers, setMarkers] = useState<Location[]>([]);

  return (
    <div>
      <header className="fixed-top">
        <Search hideResult={hideResult} onSelect={(position) => {
          setMarkers(markers => [...markers, position])
        }} onSubmit={(str) => {
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
      <Map markers={markers} />
      <div>

      </div>
    </div>
  );
}

export default App;
