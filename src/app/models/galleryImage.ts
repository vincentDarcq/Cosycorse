export class galleryImage{
    public small!: string;
    public medium!: string;
    public big!: string;

    constructor(
        small: string,
        medium: string,
        big: string
    ){
        this.small = small;
        this.medium = medium;
        this.big = big;
    }
}