import { PaymentMethod } from "@stripe/stripe-js";

export class LogementReservation {
    _id: string;
    dateDebut: string;
    dateFin: string;
    emailDemandeur: string;
    prix: number;
    message: string;
    emailAnnonceur: string;
    logementId: string;
    pm: string;
    pi: string;
    nuits: number;
    constructor(){}
}