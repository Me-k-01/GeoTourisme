import { useState } from "react";
import { Map, Location } from "./Map"
import { Search } from "./Search"
import axios from 'axios';
import { Scroller } from "./Scroller";
import { Adresse } from "../Adresse";

function App() {
  const [searchResult, setSearchResult] = useState<Adresse[]>([]);
  const [hideResult, setHideResult] = useState(true);
  const [markers, setMarkers] = useState<Location[]>([]);
  const [markersSecondaires, setMarkersSecondaires] = useState<Location[]>([]);
  const [showMenu, setShowMenu] = useState(true);

  const whenHidden = (className: string) => showMenu ? "" : "  " + className;

  return (
    <>
      <aside className={"side-interface" + whenHidden("closed")}>
        <Search onSubmit={(str) => {
          setHideResult(false);

          try {
            if (str === "")
              setSearchResult([]);
            else
              axios.get(`/contains/${str}`).then((resp: any) => {
                setSearchResult(resp.data);
              });
          } catch (err) {
            console.log(err);
          }
        }} />
        {!hideResult && <Scroller list={searchResult} onSelect={(loc) => {

          // s'il y a trop de marqueur
          if (markers.length + markersSecondaires.length > 10)
            return alert(`Votre parcours comporte trop de lieux.\nLimitez vos choix pour en profiter.`);

          // Fonction pour vérifier si le marqueur correspond au marqueur courrant
          const cond = ({ long, lat }: Location) => long === loc.long && lat === loc.lat;

          // Si le marqueur n'a pas déjà été créé  
          if (!markers.find(cond)) // On ajoute le nouveau marqueur
            setMarkers(markers => [...markers, loc]);
          else // Retirer le marqueur
            setMarkers(markers.filter(loc => !cond(loc)));
        }} />}
      </aside>
      <div className="expander-wrapper">
        <button className="expander" onClick={() => {
          setShowMenu(!showMenu);
          const interval = setInterval(() => {
            window.dispatchEvent(new Event('resize'))
          }, 10)
          setTimeout(() => {
            clearTimeout(interval);
          }, 500);
        }}>
          <i className={"fa-solid fa-caret-left" + whenHidden("rotate")} />
        </button>

      </div>
      <Map markers={markers} setMarkers={setMarkers} markersSecondaires={markersSecondaires} setMarkersSecondaires={setMarkersSecondaires} />
    </>
  );
}

export default App;