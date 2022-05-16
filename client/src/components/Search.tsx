import { FC } from "react";

export interface Adresse {
    nom: string;
    adresse: string;
    lat: number;
    long: number;
}
 
interface IScrollerProps {
    list: Adresse[];
    onSelect: (address: Adresse) => void; 
};

const Scroller: FC<IScrollerProps> = ({ list, onSelect}) => {
    return (
        list.length === 0 ?
            <div>Pas de resultat</div> :
            <ul className="scroller">
                {list.map((address, i) =>
                    <li key={i}>
                        <div className='select' onClick={() => {
                            onSelect(address)
                        }}>
                            <h4>{address.nom}</h4>
                            <p>{address.adresse}</p>
                        </div>
                    </li>
                )}
            </ul>
    );
}

interface ISearchProps {
    onSubmit: (input: string) => void;
    resultat: Adresse[];
    hideResult: boolean;
    onSelect: (address: Adresse) => void; // selection d'un point d'intéret
}

export const Search: FC<ISearchProps> = ({ onSubmit, resultat, hideResult, onSelect }) => {
    let input = "";

    return (
        <form action="/" method="get">
            <label htmlFor="header-search">
                <span className="visually-hidden">Nom du lieu :</span>
            </label>
            <input
                onInput={e => input = e.currentTarget.value}
                type="text"
                placeholder="Recherchez un lieu"
            />
            <button type="submit" onClick={(e) => {
                e.preventDefault();
                onSubmit(input);
            }}>Rechercher</button>
            {! hideResult && <Scroller list={resultat} onSelect={onSelect} />}
        </form>

    )
};


