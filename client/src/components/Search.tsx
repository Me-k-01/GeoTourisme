import { FC } from "react";

export interface Adresse {
    nom: string;
    adresse: string;
    lat: number;
    long: number;
}

/* 
//Ancienne methode de la folie: 

for (let k in resp.data) {
    const div = document.createElement("div");
    div.classList.add("select");
    div.setAttribute("lat", resp.data[k][2]);
    div.setAttribute("long", resp.data[k][3]);
    const h4 = document.createElement("h4");
    h4.innerHTML = resp.data[k][0];
    const p = document.createElement("p");
    p.innerHTML = resp.data[k][1];
    div.appendChild(h4);
    div.appendChild(p);
    div.addEventListener('click', function (e) {
    console.log(div.getAttribute("lat") + " " + div.getAttribute("long"));
    });
    res.appendChild(div);
} 
*/

interface IScrollerProps {
    list: Adresse[];
};

const Scroller: FC<IScrollerProps> = ({ list }) => {
    return (
        list.length === 0 ?
            <div>Pas de resultat</div> :
            <ul>
                {list.map(({ nom, adresse, lat, long }, i) =>
                    <li key={i}>
                        <div className='select' onClick={() => {
                            console.log(lat, long);
                        }}>
                            <h4>{nom}</h4>
                            <p>{adresse}</p>
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
}

export const Search: FC<ISearchProps> = ({ onSubmit, resultat, hideResult }) => {
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
            {! hideResult && <Scroller list={resultat}/>}
        </form>

    )
};


