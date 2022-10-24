export class Lieu {
    _id!: string;
    nom!: String;
    ville!: string;
    type!: string;
    description!: string;
    latitude!: number;
    longitude!: number;
    annonceur!: string;
    images!: Array<string>;

    constructor(){}
}