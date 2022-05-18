
export interface Address {
    nom: string;
    adresse: string;
    lat: number;
    long: number; 
    desc: string;
    image: string;
    // Nouveau
    note: number; // Entre 1 et 5 
    userNote?: number | null; // Entre 1 et 5 
}

