import { FC, useEffect } from "react";
import axios from 'axios';
import { Address } from "../Address";
import ReactStars from 'react-stars';

export interface IScrollerProps {
    list: Address[];
    onSelect: (address: Address, index: number) => void;
    selectedIndex: number | undefined;
    showPreview: boolean;
};

//fonction récupération de l'user id
async function getUserId() {
    var uid = localStorage.getItem('uuid');
    if (uid === "string")
        return +uid;
    return await axios.get(`/newUser/`).then((uuid) => {
        localStorage.setItem('uuid', uuid.data);
        return +uuid.data;
    });
 };

//fonction récupération de la note
//Entrée : nom du lieu ; Sortie : note moyenne du lieux

function showMark(nom: string) {
    console.log("Quel est la moyenne de " + nom + " ?");

    try {
        axios.get(`/noteM/${nom}`).then((resp: any) => {
            console.log(resp.data)
            return (resp)
        });
    } catch (err) {
        console.log(err);
    }
};
//showMark("Cathedrale Sainte-Cecile");

//fonction ajouter une note
//Entrées : nom du lieu + note utilisateur + id utilisateur

function addMark(nom: string, note: number, id: number) {
    console.log("ajout à " + nom + " la note " + note + " de la part de " + id);

    try {
        axios.post(`/addNote/${nom}/${note}/${id}`).then((resp: any) => {
            console.log(resp.data)
            return (resp)
        });
    } catch (err) {
        console.log(err);
    }
};

  //addMark("Cathedrale Sainte-Cecile",4,4);

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
                        <ReactStars count={5} onChange={(n) => {
                            getUserId().then((uid) => {
                                addMark(address.nom, n, uid);
                            });
                            console.log(n);
                            console.log(localStorage.getItem("mapbox.eventData.uuid:"));
                        }} size={24} color2={'#ffd700'} />
                    </div>
                </li>
            )}
        </ul>
    );
}