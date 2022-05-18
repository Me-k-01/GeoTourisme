import { FC, MouseEventHandler, useState } from "react";
import { Address } from "../Address";
import ReactStars from 'react-stars';
import axios from 'axios';

interface IDisplayAddressProps {
    address: Address;
    className: string;
    onClick: MouseEventHandler<HTMLLIElement>;
    key: number;
};

export const DisplayAddress: FC<IDisplayAddressProps> = ({ key, className, address, onClick }) => {
    // const [userNote, setUserNote] = useState(address.userNote);

    return (
        <li key={key} className={className} onClick={onClick}>
            <h3>{address.nom}</h3>
            <p>{address.adresse}</p>
            <div className="star-wrapper" onClick={(evt) => {
                evt.stopPropagation();
            }}>
                <ReactStars count={5} value={address.userNote || Math.trunc(Math.random() * 5) + 1} onChange={(n) => {
                    console.log("Note ajouté:", n);
                    const uuid = localStorage.getItem('uuid'); 
                    axios.post(`/addNote/${address.nom}/${n}/${uuid}`);
                    // setUserNote(n);
                }} size={24} color1={'#ccc'} color2={'#ffd700'} />
            </div>
        </li>
    );
}


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
            {list.map((address, i) => {
                <DisplayAddress key={i} className={getClass(i)} address={address} onClick={() => {
                    onSelect(address, i);
                }} />
            }
            )}
        </ul>
    );
}