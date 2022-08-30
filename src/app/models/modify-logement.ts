import { Logement } from "./logement";

export class ModifyLogement {
    logement!: Logement;
    indexNewImages!: number;
    files: File[] = [];
    formData = new FormData();
    imagesLoaded: Array<string | null> = [];

    constructor(
        logement: Logement,
        indexNewImages: number,
        files: File[]
    ){
        this.logement = logement;
        this.indexNewImages = indexNewImages;
        this.files = files;
    }
}