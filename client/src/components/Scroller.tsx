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

    return (list.length === 0 ?
        <div>Pas de resultat</div> :
        <ul className="scroller">
            {list.map((address, i) => 
                <li  key={i} className={getClass(i)} onClick={() => onSelect(address, i)}>
                    <h3>{address.nom}</h3>
                    <p>{address.adresse}</p>
                    <div className="star-wrapper" onClick={(evt) => {
                        evt.stopPropagation();
                    }}>
                        <ReactStars count={5} value={address.userNote || address.note } onChange={(n) => {
                            // console.log("Note ajouté:", n);
                            const uuid = localStorage.getItem('uuid');
                            axios.post(`/addNote/${address.nom}/${n}/${uuid}`); 
                            updateList(list => {
                                const newList = [...list]; 
                                newList[i] = {...address, userNote: n};
                                return newList;
                            }); 
                        }} size={24} color1={'#ccc'} color2={'#ffd700'} />
                    </div>
                </li>
            )}
        </ul>
    );
}