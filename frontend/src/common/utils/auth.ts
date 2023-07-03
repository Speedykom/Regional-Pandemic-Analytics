import axios from "axios";
import { BASE_URL } from "../config";
import secureLocalStorage from "react-secure-storage";

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
const tokens: any = secureLocalStorage.getItem("tokens");
const accessToken = tokens && 'accessToken' in tokens ? tokens.accessToken : '' 
export const getGuestToken = async (uuid: string): Promise<string> => {
    return new Promise<string>((resolve) => {
        axios.post(`${BASE_URL}/api/superset/guest/token`, { id: uuid },{
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${accessToken}`
            },
        }).then((response) => {
            console.log(response.status);
            resolve(response.data?.token);
        }).catch((err) => {
            console.log(err)
        });
    })
    
}

