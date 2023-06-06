import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export const getAvatar = async (req: NextApiRequest, res: NextApiResponse) => {
    const { url } = req.query;
    return await axios.get(`${url}`).then((data) => {
        return res.status(200).send(data.data)
    }).catch(() => {
        return res.send("")
    })
}

export default getAvatar;