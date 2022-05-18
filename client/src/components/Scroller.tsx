import { Dispatch, FC, SetStateAction } from "react";
import { Address } from "../address";
import axios from 'axios';
import { Address } from "../Address";
import ReactStars from 'react-stars';
import { addMark } from '../connection';


export interface IScrollerProps {
    list: Address[];
    onSelect: (address: Address, index: number) => void;
    selectedIndex: number | undefined;
    showPreview: boolean;
    updateList: Dispatch<SetStateAction<Address[]>>;
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

export const Scroller: FC<IScrollerProps> = ({ showPreview, list, updateList, onSelect, selectedIndex }) => {

    const getClass = (i: number) => {
        return showPreview && selectedIndex === i ? "selected" : "";
    }

    return (list.length === 0 ?
        <div>Pas de resultat</div> :
        <ul className="scroller">
            {list.map((addr, i) =>
                <li key={i} className={getClass(i)} onClick={() => {
                    onSelect(address, i);
                }}>
                    <h3>{addr.nom}</h3>
                    <p>{addr.adresse}</p>
                    <div className="star-wrapper" onClick={(evt) => {
                        evt.stopPropagation();
                    }}>
                        <ReactStars count={5} value={addr.userNote || addr.note} onChange={async (n) => {
                            getUserId().then((uid) => {
                                const newNote = await addMark(addr.nom, n, uid);
                                updateList(list => {
                                    const newList = [...list];
                                    newList[i] = { ...addr, userNote: n, note: newNote };
                                    return newList;
                                });
                            });
                        }} size={24} color1={'#ccc'} color2={addr.userNote ? '#00d7ff' : '#ffd700'} />
                    </div>
                </li>
            )}
        </ul>
    );
}