export interface Name {
    firstname: string;
    lastname: string;
    midlename: string;
}

export interface Address {
    address1: string;
    address2: string;
    city: string;
    country: string;
    postalCode: string;
    state: string;
}

export class Users {
    constructor(
        public name: Name,
        public address: Address,
        public gender: string,
        public id?: string
    ) {}
}
