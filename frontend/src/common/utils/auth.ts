import axios from "axios";
import { BASE_URL } from "../config";

export const getUserRole = async (roles: [], accessToken: string) => {
    const rolee = roles.find(item => item != 'default-roles-stack')
    return await axios.get(`${BASE_URL}/api/role/${rolee}?type=name`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    }).then((res) => {
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
        axios.post(`${BASE_URL}/api/superset/guest/token`, { id: uuid }).then((response) => {
            console.log(response.status);
            resolve(response.data?.token);
        }).catch((err) => {
            console.log(err)
        });
    })
    
}

