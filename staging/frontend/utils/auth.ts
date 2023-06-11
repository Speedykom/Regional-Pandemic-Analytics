import secureLocalStorage from "react-secure-storage";

export const api_url = process.env.NEXT_PUBLIC_BASE_URL;

const user: any = secureLocalStorage.getItem("user") as object;

export const role: string = user?.realm_access?.roles;

export enum appRoles {
    ADMINISTRATOR = 'Administrator',
    DHO = 'District Health Officer (DHO)',
    M_AND_E = 'Monitoring and Evaluation (M&E) Expert'
}

export const roles = [
    {
        name: appRoles.ADMINISTRATOR,
        permissions: [ 'Users', 'System' ]
    },
    {
        name: appRoles.DHO,
        permissions: [ 'Home', 'Dashboards', 'Charts', 'Process Chains', 'Data' ]
    },
    {
        name: appRoles.M_AND_E,
        permissions: [ 'Home', 'Dashboards', 'Charts' ]
    }
]