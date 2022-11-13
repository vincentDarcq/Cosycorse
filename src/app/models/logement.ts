import { NgxGalleryImage } from "@kolkov/ngx-gallery";

export class Logement {
    _id!: string;
    adresse!: string;
    ville!: string;
    description!: String;
    logement!: String;
    voyageurs!: Number;
    lits!: Number;
    sdbs!: Number;
    latitude!: number;
    longitude!: number;
    emailAnnonceur!: string;
    prix!: number;
    equipements!: Array<string>;
    images?: Array<string>;
    fumeur?: boolean;
    animaux?: boolean;
    access_handicap?: boolean;
    indexImage: number = 0;
    galleryImages?: NgxGalleryImage[];
    exposer: boolean;

    constructor(
        adresse: string,
        ville: string,
        description: String,
        logement: String,
        voyageurs: Number,
        lits: Number,
        sdbs: Number,
        latitude: number,
        longitude: number,
        emailAnnonceur: string,
        prix: number,
        equipements: Array<string>,
        fumeur: boolean,
        animaux: boolean,
        access_handicap: boolean,
        exposer?: boolean,
        images?: Array<string>,
    ) {
        this.adresse = adresse;
        this.ville = ville;
        this.description = description;
        this.logement = logement;
        this.voyageurs = voyageurs;
        this.lits = lits;
        this.sdbs = sdbs;
        this.latitude = latitude;
        this.longitude = longitude;
        this.emailAnnonceur = emailAnnonceur;
        this.prix = prix;
        this.equipements = equipements;
        this.fumeur = fumeur;
        this.animaux = animaux;
        this.access_handicap = access_handicap;
        this.exposer = exposer;
        this.images = images;
    }

    setId(id: string) {
        this._id = id;
    }

}