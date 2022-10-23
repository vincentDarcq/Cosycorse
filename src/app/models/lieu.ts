export class Lieu {
    _id!: string;
    ville!: string;
    type!: string;
    description!: string;
    latitude!: number;
    longitude!: number;
    annonceur!: string;
    images!: Array<string>;

    constructor(){}
}