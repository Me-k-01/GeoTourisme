
import { Dispatch, FC, SetStateAction, useState } from "react";
import { Search } from "./Search";
import { Scroller } from "./Scroller";
import { Address } from "../address";
import { Location } from "./Map"
import { Preview } from "./Preview";
import { search } from '../connection';
import Expand from 'react-expand-animated';

interface ICatalogueProps {
    markers: Location[];
    setMarkers: Dispatch<SetStateAction<Location[]>>;
    totalMarker: number;
};

export const Catalogue: FC<ICatalogueProps> = ({ markers, setMarkers, totalMarker }) => {
    const [hideResult, setHideResult] = useState(true);
    const [address, setAddress] = useState<Address[]>([]);
    const [selIndex, setSelIndex] = useState<number>();
    const [showPreview, setShowPreview] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    return (
        <>
            <Expand open={showPreview}>
                {(selIndex !== undefined) && <Preview desc={address[selIndex].desc} img={address[selIndex].image} />}
            </Expand>
            <Search onSubmit={async (str) => {
                setHideResult(false);
                if (str === "") {
                    setAddress([]);
                } else {
                    setAddress(await search(str));
                }
                setIsLoading(false);
            }} />
            {!hideResult && <Scroller isLoading={isLoading} showPreview={showPreview} updateList={setAddress} selectedIndex={selIndex} list={address} onSelect={(adress: Address, i: number) => {
                // S'il y a trop de marqueur (limite à 12)
                if (totalMarker > 11)
                    return alert(`Votre parcours comporte trop de lieux.\nLimitez vos choix pour en profiter.`);

                // Fonction pour vérifier si le marqueur correspond au marqueur courrant
                const isEqual = ({ long, lat }: Location) => long === adress.long && lat === adress.lat;

                // Si le marqueur n'a pas déjà été créé  
                if (!markers.find(isEqual)) {
                    // On ajoute le nouveau marqueur
                    setMarkers(markers => [...markers, adress]);
                    // Et on selectionne pour une preview
                    setSelIndex(i);
                    setShowPreview(true);

                } else { // Retirer le marqueur
                    setMarkers(markers.filter(loc => !isEqual(loc)));
                    setShowPreview(false);
                }
            }} />}
        </>
    );
}
