import { FC } from "react";

interface ISearchProps {
    onSubmit: (input: string) => void;
}

export const Search: FC<ISearchProps> = ({ onSubmit }) => {
    let input = "";

    return (
        <form action="/" method="get">
            <input
                onInput={e => input = e.currentTarget.value}
                type="text"
                placeholder="Recherchez un lieu"
            />
            <button type="submit" onClick={(e) => {
                e.preventDefault();
                onSubmit(input);
            }}><i className="fa-solid fa-magnifying-glass"></i></button>
        </form>
    )
};


