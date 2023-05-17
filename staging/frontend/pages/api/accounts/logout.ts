import {setCookie} from "cookies-next";
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST')
        return res.status(405).send(`Method ${req.method} not allowed`);

    setCookie('access', '', {
        req,
        res,
        maxAge: 0,
        sameSite: 'strict',
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        expires: new Date(0),
        path: '/',
    });
    return res.status(200).json({ status: 'logout successful' });
}