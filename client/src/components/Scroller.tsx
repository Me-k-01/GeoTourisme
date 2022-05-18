import { FC, useState } from "react";
import { Address } from "../Address";

export interface IScrollerProps {
    list: Address[];
    onSelect: (address: Address) => void;
};

export const Scroller: FC<IScrollerProps> = ({ list, onSelect }) => {
    const [indexSel, setIndexSel] = useState<number>();

    const getClass = (i: number) => {
        return indexSel === i ? "selected" : "";
    }

    return (list.length === 0 ?
        <div>Pas de resultat</div> :
        <ul className="scroller">
            {list.map((address, i) =>
                <li key={i} className={getClass(i)} onClick={() => {
                    onSelect(address);
                    if (i === indexSel) {
                        setIndexSel(undefined);
                    } else {
                        setIndexSel(i);
                    }
                }}>
                    <h3>{address.nom}</h3>
                    <p>{address.adresse}</p>
                </li>
            )}
        </ul>
    );
}