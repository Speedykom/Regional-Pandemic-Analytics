import axios from "axios";
import { BASE_URL } from "../config";

export const getUserRole = async (roles: []) => {
    const rolee = roles.find(item => item != 'default-roles-stack')
    return await axios.get(`${BASE_URL}/api/role/${rolee}?type=name`).then((res) => {
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

const getToken = async (uuid: string) => {
    return await axios.get(`${BASE_URL}/api/superset/auth/token/${uuid}`).then((res) => {
        return res.data
    }).catch((err) => {
        console.log(err)
    })
}

export const getGuestToken = async (uuid: string): Promise<string> => {
    const token = await getToken(uuid);
    return new Promise<string>((resolve) => {
        axios.post(`https://analytics2.igad-health.eu/api/v1/security/guest_token/`,
            token?.payload,
            {
                headers: {
                    Authorization: `Bearer ${token?.tokens?.access_token}`
                }
            }
        ).then((response) => {
            console.log(response.status);
            resolve(response.data?.token);
        }).catch((err) => {
            console.log(err)
        });
    })
    
}

