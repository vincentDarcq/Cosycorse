export class Activite {
    _id: string;
    indexImage: number;
    titre: String;
    ville: string;
    type: string;
    duree: string;
    description: string;
    latitude: number;
    longitude: number;
    proposeur: string;
    images: Array<string>;
    animationState: string;

    constructor(){}
}