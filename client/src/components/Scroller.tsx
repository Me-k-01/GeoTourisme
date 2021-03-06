import { Dispatch, FC, SetStateAction } from "react";
import { Address } from "../address";
import ReactStars from 'react-stars';
import { addMark } from '../connection'; 


export interface IScrollerProps {
    list: Address[];
    onSelect: (address: Address, index: number) => void;
    selectedIndex: number | undefined;
    showPreview: boolean;
    updateList: Dispatch<SetStateAction<Address[]>>;
    isLoading: boolean;
};

export const Scroller: FC<IScrollerProps> = ({ isLoading, showPreview, list, updateList, onSelect, selectedIndex }) => {
    function stars(addr: Address, i: number, color: string) {         
        return <ReactStars count={5} value={addr.userNote || addr.note}

            onChange={(n) => {
                addMark(addr.nom, n).then((newAvgNote: number) => { // Recupération de la nouvelle note moyenne
                    updateList(list => {
                        const newList = [...list];
                        newList[i] = { ...addr, userNote: n, note: newAvgNote };
                        return newList;
                    });
                });
            }}
            size={24} color1={'#ccc'} color2={color} />;
    }

    const getClass = (i: number) => {
        return showPreview && selectedIndex === i ? "selected" : "";
    }

    return (list.length === 0 ?
        <div>{isLoading ? "Recherche en cours" : "Pas de resultat"}</div> :
        <ul className="scroller">
            {list.map((addr, i) => {
                return <li key={i} className={getClass(i)} onClick={() => {
                    onSelect(addr, i);
                }}>
                    <h3>{addr.nom}</h3>
                    <p>{addr.adresse}</p>
                    <div className="star-wrapper" onClick={(evt) => {
                        evt.stopPropagation();
                    }}>
                        {addr.userNote && stars(addr, i, '#00d7ff')}
                        {!addr.userNote && stars(addr, i, '#ffd700')}
                    </div>
                </li>
            }
            )}
        </ul>
    );
}