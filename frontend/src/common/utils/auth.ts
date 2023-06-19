import axios from "axios";
import secureLocalStorage from "react-secure-storage";

export const api_url = process.env.NEXT_PUBLIC_BASE_URL;

const user: any = secureLocalStorage.getItem("user") as object;

export const role: string = user?.realm_access?.roles;

export enum appRoles {
    ADMINISTRATOR = 'Administrator',
    DHO = 'District Health Officer (DHO)',
    M_AND_E = 'Monitoring and Evaluation (M&E) Expert'
}

export const getUserRole = async (roles: []) => {
    const rolee = roles.find(item => item != 'default-roles-stack')
    return await axios.get(`${api_url}/api/role/${rolee}?type=name`).then((res) => {
        let newRole = res?.data?.role;
        let roleAttributeKeys = Object.keys(newRole?.attributes);
        roleAttributeKeys.forEach((key, _) => {
            let keyValue = JSON.parse(newRole?.attributes?.[key][0])
            newRole.attributes[key] = keyValue
        })
        return newRole
    }).catch((err) => {
        console.log(err)
    })
}

export const getGuestToken = async (uuid: string): Promise<string> => {
    return new Promise<string>((resolve) => {
        console.log("====> Calling token!")
        axios.post(`${api_url}/api/superset/guest/token`, { id: uuid }).then((response) => {
            console.log(response.status);
            resolve(response.data?.token);
        }).catch((err) => {
            console.log(err)
        });
    })
    
}
