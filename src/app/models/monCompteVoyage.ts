import { LogementReservation } from "./logementReservation";
import { Logement } from "./logement"

export class MonCompteVoyage{
    logementReservation!: LogementReservation;
    logement!: Logement;
    constructor(
        logementReservation: LogementReservation,
        logement: Logement
    ){
        this.logement = logement;
        this.logementReservation = logementReservation;
    }
}