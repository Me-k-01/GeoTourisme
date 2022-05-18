import { FC, useState, Dispatch, SetStateAction } from "react";
import { Location } from "./Map"
import { Catalogue } from "./Catalogue";
import { Proximity } from "./Proximity";

interface ISideInterfaceProps {
    markers: Location[];
    setMarkers: Dispatch<SetStateAction<Location[]>>;
    totalMarker: number;
    pos: Location;
};

export const SideInterface: FC<ISideInterfaceProps> = ({ pos, markers, setMarkers, totalMarker }) => {
    const [showMenu, setShowMenu] = useState(true);

    const [state, setState] = useState<"search" | "proximity">("search");

    const whenHidden = (className: string) => showMenu ? "" : "  " + className;

    return (<>
        <aside className={"side-interface" + whenHidden("closed")}>
            <nav>
                <button title="Catalogue de recherche" onClick={() => setState("search")}>
                    <i className="fa-solid fa-book" />
                </button>
                <button title="Lieu à proximité" onClick={() => setState("proximity")}>
                    <i className="fa-solid fa-crosshairs" />
                </button>
            </nav>{
                state === "search" ?
                    <Catalogue markers={markers} setMarkers={setMarkers} totalMarker={totalMarker} /> :
                    <Proximity pos={pos} markers={markers} setMarkers={setMarkers} totalMarker={totalMarker} />
            }
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
