export class User {
    _id: string;
    email: string;
    name: string;
    password: string;

    constructor(
        id?: string,
        email?: string,
        name?: string,
        password?: string
    ) {
        this._id = id!;
        this.email = email!;
        this.name = name!;
        this.password = password!;
    }

    public setEmail(email: string) {
        this.email = email;
    }

    public setName(name: string) {
        this.name = name;
    }

    public setPasword(password: string) {
        this.password = password;
    }

}