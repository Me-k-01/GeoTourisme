
import { FunctionComponent, useState } from 'react';

interface ISearchProps {
    onSubmit: (input: string) => void;
}

const Search: FunctionComponent<ISearchProps> = ({ onSubmit }) => {
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
        <div id="result" className="scroller" hidden></div>
        </form>

    )
};

export default Search;

