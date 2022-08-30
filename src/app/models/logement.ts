import {NgxGalleryImage} from '@kolkov/ngx-gallery';

export class Logement {
    _id!: string;
    addresse!: string;
    description!: String;
    logement!: String;
    voyageurs!: Number;
    lits!: Number;
    sdbs!: Number;
    latitude!: Number;
    longitude!: Number;
    annonceur!: String;
    prix!: Number;
    equipements!: Array<string>;
    images?: Array<string>;
    gallery: NgxGalleryImage[] = new Array();

    constructor(
        addresse: string,
        description: String,
        logement: String,
        voyageurs: Number,
        lits: Number,
        sdbs: Number,
        latitude: Number,
        longitude: Number,
        annonceur: String,
        prix: Number,
        equipements: Array<string>,
        images?: Array<string>,
    ){
        this.addresse = addresse;
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
        this.images = images;
    }

    setId(id: string){
        this._id = id;
    }
  
  }