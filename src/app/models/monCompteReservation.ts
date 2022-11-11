import { Logement } from "./logement";
import { LogementReservation } from "./logementReservation";
import { User } from "./user.model";

export class MonCompteReservation{
    logementReservation: LogementReservation;
    logement: Logement;
    user: User;
    constructor(
        logement: Logement,
        logementReservation: LogementReservation,
        user: User
    ){
        this.logement = logement;
        this.user = user;
        this.logementReservation = logementReservation;
    }
}