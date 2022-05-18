import { FC, useState } from "react";
import { Address } from "../Address";

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
                </li>
            )}
        </ul>
    );
}