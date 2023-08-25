import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import fs from 'fs';
// @ts-ignore
import formidable from 'formidable';
import FormData from 'form-data';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const server_url = serverRuntimeConfig.NEXT_PRIVATE_BASE_URL;

  if (req.method != 'POST') {
    return res.status(405).send(`Method ${req.method} not allowed`);
  }

  try {
    const form = new formidable.IncomingForm();

    // @ts-ignore
    form.parse(req, async (err, fields, files) => {
      if (err) {
        /* eslint-disable no-console */
        console.error(err);
        return res.status(500).json({ message: 'Failed to parse form data' });
      }

      // Access the fields and files from the parsed form data
      const { username, file_name } = fields;

      const formData = new FormData();

      formData.append('username', username);
      formData.append('file_name', file_name);

      // Access the uploaded files
      for (const key in files) {
        if (Object.hasOwnProperty.call(files, key)) {
          const file = files[key];
          formData.append('files', fs.createReadStream(file.filepath), {
            filename: file.originalFilename,
          });
        }
      }

      try {
        await axios.post(`${server_url}/api/data/upload/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return res.status(201).json({ result: 'File uploaded successfully' });
      } catch (error: unknown) {
        return res
          .status(500)
          .json({ result: 'Fail to upload file to server' });
      }
    });
  } catch (error) {
    return res.status(500).json({ result: 'Failed to upload file' });
  }
}
