import { Dispatch, FC, MouseEventHandler, SetStateAction, useState } from "react";
import { Address } from "../Address";
import ReactStars from 'react-stars';
import axios from 'axios';


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
    const rdmNote = () => Math.trunc(Math.random() * 5) + 1;

    return (list.length === 0 ?
        <div>Pas de resultat</div> :
        <ul className="scroller">
            {list.map((addr, i) => {
                console.log(addr.userNote, addr.note) ;
                
                return <li key={i} className={getClass(i)} onClick={() => onSelect(addr, i)}>
                    <h3>{addr.nom}</h3>
                    <p>{addr.adresse}</p>
                    <div className="star-wrapper" onClick={(evt) => {
                        evt.stopPropagation();
                    }}>
                        <ReactStars count={5} value={addr.userNote || addr.note} onChange={(n) => {
                            // console.log("Note ajouté:", n);
                            const uuid = localStorage.getItem('uuid');
                            axios.post(`/addNote/${addr.nom}/${n}/${uuid}`);
                            updateList(list => {
                                const newList = [...list];
                                newList[i] = { ...addr, userNote: n };
                                return newList;
                            });
                        }} size={24} color1={'#ccc'} color2={addr.userNote ? '#00d7ff' : '#ffd700'} />
                    </div>
                </li>
            }
            )}
        </ul>
    );
}