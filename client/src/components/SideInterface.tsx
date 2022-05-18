import { FC, useState, Dispatch, SetStateAction } from "react";
import { Search } from "./Search"
import axios from 'axios';
import { Scroller } from "./Scroller";
import { Address } from "../address";
import { Location } from "./Map"
import { Preview } from "./Preview";
import { getUserId } from '../connection';
import Expand from 'react-expand-animated';

interface ISideInterfaceProps {
    markers: Location[];
    setMarkers: Dispatch<SetStateAction<Location[]>>;
    totalMarker: number;
};

export const SideInterface: FC<ISideInterfaceProps> = ({ markers, setMarkers, totalMarker }) => {
    const [address, setAddress] = useState<Address[]>([]);
    const [showMenu, setShowMenu] = useState(true);
    const [hideResult, setHideResult] = useState(true);
    const [selIndex, setSelIndex] = useState<number>();
    const [showPreview, setShowPreview] = useState(false);

    const [state, setState] = useState<"search" | "proximity">("search");

    const whenHidden = (className: string) => showMenu ? "" : "  " + className;

    return (<>
        <aside className={"side-interface" + whenHidden("closed")}>
            <nav>
                <button onClick={() => setState("search")}><i className="fa-solid fa-book"></i></button>
                <button onClick={() => setState("proximity")}><i className="fa-solid fa-crosshairs"></i></button>
            </nav>

            <Expand open={showPreview}>
                {(selIndex !== undefined) && <Preview desc={address[selIndex].desc!} img={address[selIndex].image!} />}
            </Expand>

            <Search onSubmit={async (str) => {
                setHideResult(false);
                if (str === "")
                    setAddress([]);
                else
                    axios.get(`/contains/${str}/${await getUserId()}`)
                        .then(resp => setAddress(resp.data));
            }} />
            {!hideResult && <Scroller showPreview={showPreview} updateList={setAddress} selectedIndex={selIndex} list={address} onSelect={(adress: Address, i: number) => {
                // S'il y a trop de marqueur (limite à 12)
                if (totalMarker > 11)
                    return alert(`Votre parcours comporte trop de lieux.\nLimitez vos choix pour en profiter.`);

                // Fonction pour vérifier si le marqueur correspond au marqueur courrant
                const isEqual = ({ long, lat }: Location) => long === adress.long && lat === adress.lat;

                // Si le marqueur n'a pas déjà été créé  
                if (!markers.find(isEqual)) {
                    // On ajoute le nouveau marqueur
                    setMarkers(markers => [...markers, adress]);
                    // Et on selectionne pour une preview
                    setSelIndex(i);
                    setShowPreview(true);

                } else { // Retirer le marqueur
                    setMarkers(markers.filter(loc => !isEqual(loc)));
                    setShowPreview(false);
                }
            }} />}
        </aside>
        <div className="expander-wrapper">
            <button className="expander" onClick={() => {
                setShowMenu(!showMenu);
                // On force le resize de la fenêtre à cause du temps d'animation css
                const interval = setInterval(() => {
                    window.dispatchEvent(new Event('resize'));
                }, 10)
                setTimeout(() => {
                    clearTimeout(interval);
                }, 500);
            }}>
                <i className={"fa-solid fa-caret-left" + whenHidden("rotate")} />
            </button>
        </div>
    </>);
}
