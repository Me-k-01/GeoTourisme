
export interface Address {
    nom: string;
    adresse: string;
    lat: number;
    long: number; 
    desc: string;
    image: string; 
    note: number; // Entre 0 et 5 (0 pour pas noté)
    userNote?: number; // Entre 0 et 5 (0 pour pas noté)
}

