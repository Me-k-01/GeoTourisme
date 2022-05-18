import { Dispatch, FC, SetStateAction } from "react";
import { Address } from "../address";
import ReactStars from 'react-stars';
import { addMark, getUserId } from '../connection';


export interface IScrollerProps {
    list: Address[];
    onSelect: (address: Address, index: number) => void;
    selectedIndex: number | undefined;
    showPreview: boolean;
    updateList: Dispatch<SetStateAction<Address[]>>;
};

export const Scroller: FC<IScrollerProps> = ({ showPreview, list, updateList, onSelect, selectedIndex }) => {

    const getClass = (i: number) => {
        return showPreview && selectedIndex === i ? "selected" : "";
    }

    return (list.length === 0 ?
        <div>Pas de resultat</div> :
        <ul className="scroller">
            {list.map((addr, i) =>
                <li key={i} className={getClass(i)} onClick={() => {
                    onSelect(addr, i);
                }}>
                    <h3>{addr.nom}</h3>
                    <p>{addr.adresse}</p>
                    <div className="star-wrapper" onClick={(evt) => {
                        evt.stopPropagation();
                    }}>
                        <ReactStars count={5} value={addr.userNote || addr.note} onChange={async (n) => {
                            const newNote = await addMark(addr.nom, n);
                            updateList(list => {
                                const newList = [...list];
                                newList[i] = { ...addr, userNote: n, note: newNote };
                                return newList;
                            });
                        }} size={24} color1={'#ccc'} color2={addr.userNote ? '#00d7ff' : '#ffd700'} />
                    </div>
                </li>
            )}
        </ul>
    );
}