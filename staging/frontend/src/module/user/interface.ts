export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    enabled: boolean;
    emailVerified: boolean;
    attributes: {
        code: string[],
        phone: string[],
        gender: string[],
        country: string[],
        avatar: string[]
    },
    realmRoles?: []
}