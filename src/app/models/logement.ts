import { NgxGalleryImage } from "@kolkov/ngx-gallery";

export class Logement {
    _id!: string;
    addresse!: string;
    ville!: string;
    description!: String;
    logement!: String;
    voyageurs!: Number;
    lits!: Number;
    sdbs!: Number;
    latitude!: number;
    longitude!: number;
    annonceur!: string;
    prix!: Number;
    equipements!: Array<string>;
    images?: Array<string>;
    fumeur?: boolean;
    animaux?: boolean;
    access_handicap?: boolean;
    indexImage: number = 0;
    galleryImages?: NgxGalleryImage[];

    constructor(
        addresse: string,
        ville: string,
        description: String,
        logement: String,
        voyageurs: Number,
        lits: Number,
        sdbs: Number,
        latitude: number,
        longitude: number,
        annonceur: string,
        prix: Number,
        equipements: Array<string>,
        fumeur: boolean,
        animaux: boolean,
        access_handicap: boolean,
        images?: Array<string>,
    ) {
        this.addresse = addresse;
        this.ville = ville;
        this.description = description;
        this.logement = logement;
        this.voyageurs = voyageurs;
        this.lits = lits;
        this.sdbs = sdbs;
        this.latitude = latitude;
        this.longitude = longitude;
        this.annonceur = annonceur;
        this.prix = prix;
        this.equipements = equipements;
        this.fumeur = fumeur;
        this.animaux = animaux;
        this.access_handicap = access_handicap;
        this.images = images;
    }

    setId(id: string) {
        this._id = id;
    }

}