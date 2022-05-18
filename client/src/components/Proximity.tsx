
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import axios from 'axios';
import { Scroller } from "./Scroller";
import { Address } from "../address";
import { Location } from "./Map"
import { Preview } from "./Preview";
import Expand from 'react-expand-animated';
import { nearby } from "../connection";

interface IProximityProps {
    markers: Location[];
    setMarkers: Dispatch<SetStateAction<Location[]>>;
    totalMarker: number;
    pos: Location;
};

export const Proximity: FC<IProximityProps> = ({ pos, markers, setMarkers, totalMarker }) => {
    const [address, setAddress] = useState<Address[]>([]);
    const [selIndex, setSelIndex] = useState<number>();
    const [showPreview, setShowPreview] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setInterval(() => {
            // Fetch des lieu a proximité
            nearby(pos.lat, pos.long).then((d) => {
                setAddress(d);
                setIsLoading(false);
            });
        }, 5000);
    }, [])

    return (
        <>
            <h2>Lieu a proximité</h2>
            <Expand open={showPreview}>
                {(selIndex !== undefined) && <Preview desc={address[selIndex].desc} img={address[selIndex].image} />}
            </Expand>
            {<Scroller isLoading={isLoading} showPreview={showPreview} updateList={setAddress} selectedIndex={selIndex} list={address} onSelect={(adress: Address, i: number) => {
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
