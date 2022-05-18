import { FC } from "react";
import { Address } from "../Address";
import ReactStars from 'react-stars';
import axios from 'axios';
 
export interface IScrollerProps {
    list: Address[];
    onSelect: (address: Address, index: number) => void;
    selectedIndex: number | undefined;
    showPreview: boolean;
};

export const Scroller: FC<IScrollerProps> = ({ showPreview, list, onSelect, selectedIndex }) => {

    const getClass = (i: number) => {
        return showPreview && selectedIndex === i ? "selected" : "";
    }

    return (list.length === 0 ?
        <div>Pas de resultat</div> :
        <ul className="scroller">
            {list.map((address, i) =>
                <li key={i} className={getClass(i)} onClick={() => {
                    onSelect(address, i);
                }}>
                    <h3>{address.nom}</h3>
                    <p>{address.adresse}</p>
                    <div className="star-wrapper" onClick={(evt) => {
                        evt.stopPropagation();
                    }}>
                        <ReactStars count={5} value={address.note || Math.trunc(Math.random() * 5) + 1} onChange={(n) => {
                            console.log("Note ajouté:", n);
                            const uuid = localStorage.getItem("mapbox.eventData.uuid:")
                            console.log(uuid);
                            
                            // TODO
                            // axios.post(`/addNote/<nom_l>/<note>/<id>`);
                        }} size={24} color1={'#ccc'} color2={'#ffd700'} />
                    </div>
                </li>
            )}
        </ul>
    );
}