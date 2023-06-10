import secureLocalStorage from "react-secure-storage";

const user: any = secureLocalStorage.getItem("user");

export const roles = user?.realm_access?.roles;

export enum appRoles {
    ADMINISTRATOR = 'Administrator',
    DHO = 'District Health Officer (DHO)',
    M_AND_E = 'Monitoring and Evaluation (M&E) Expert'
}