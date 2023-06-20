import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const token = async () => {
    return await axios
        .post(
            `http://localhost:8088/api/v1/security/login`,
            {
                username: "admin",
                password: "admin",
                provider: "db",
                refresh: true,
            },
            {
                headers: {
                    Accept: "application/json",
                },
            }
        )
        .then((res) => {
            return res?.data?.access_token;
        })
        .catch((err) => {
            console.log(err);
        });
};

export default async function dashboards(req: NextApiRequest, res: NextApiResponse) {
    const myToken = await token();
    const url = `http://localhost:8088/api/v1/dashboard/`;
    return await axios
        .get(url, {
            headers: {
                "Accept": "application/json",
                Authorization: `Bearer ${myToken}`,
            },
        })
        .then((resp) => {
            return res.status(200).send(resp.data)
        }).catch((err) => {
            console.log(err)
        });
}