import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import getConfig from "next/config"
 
const { publicRuntimeConfig } = getConfig()

export const getUserRole = async (roles: []) => {
    const rolee = roles.find(item => item != 'default-roles-stack')
    return await axios.get(`${publicRuntimeConfig.NEXT_PUBLIC_BASE_URL}/api/role/${rolee}?type=name`).then((res) => {
        let newRole = res?.data?.role;
        let roleAttributeKeys = Object.keys(newRole?.attributes);
        roleAttributeKeys.forEach((key, _) => {
            let keyValue = JSON.parse(newRole?.attributes?.[key][0])
            newRole.attributes[key] = keyValue
        })
        return newRole
    })
}

export const getGuestToken = async (uuid: string): Promise<string> => {
    const tokens: any = secureLocalStorage.getItem("tokens");
    const accessToken = tokens && 'accessToken' in tokens ? tokens.accessToken : '';

    return axios.post(`${publicRuntimeConfig.NEXT_PUBLIC_BASE_URL}/api/superset/guest/token`, { id: uuid },{
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`
        },
    }).then((response) => {
        return response.data?.token;
    })
    
}

