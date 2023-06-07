import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { url } = req.query;
    return await axios.get(`${url}`).then((data) => {
        const stream: any = data;
        const contentType = stream.headers['content-type'];

        res.writeHead(200, 'OK', {
            'Content-Type': 'binary/octet-stream',
            'Transfer-Encoding': 'chunked'
        })
        stream.on('data', function (chunk: any) {
            res.write(chunk);
        })
        stream.on('end', function () {
            res.end();
        })
        stream.on('error', function (err: any) {
            console.log(err)
        })
    }).catch(() => {
        return res.send("")
    })
}
