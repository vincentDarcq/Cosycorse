export class User {
    _id: string;
    email: string;
    nom: string;
    prenom: string;
    password: string;
    stripeUserId: string;

    constructor(
        id?: string,
        email?: string,
        prenom?: string,
        nom?: string
    ) {
        this._id = id;
        this.email = email;
        this.prenom = prenom;
        this.nom = nom;
    }

}