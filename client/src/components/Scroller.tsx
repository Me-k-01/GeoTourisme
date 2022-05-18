import { FC } from "react";
import { Adresse } from "../Adresse";

export interface IScrollerProps {
    list: Adresse[];
    onSelect: (address: Adresse) => void;
};

export const Scroller: FC<IScrollerProps> = ({ list, onSelect }) => {
    return (
        list.length === 0 ?
            <div>Pas de resultat</div> :
            <ul className="scroller">
                {list.map((address, i) =>
                    <li key={i} onClick={() => onSelect(address)}>
                        <h3>{address.nom}</h3>
                        <p>{address.adresse}</p>
                    </li>
                )}
            </ul>
    );
}