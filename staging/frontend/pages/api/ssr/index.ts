import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const encodedParams = new URLSearchParams();

  encodedParams.set('grant_type', 'client_credentials');
  encodedParams.set('client_id', 'frontend');
  encodedParams.set('client_secret', "eH7E3q1MuswBqA38WUhM7houi61pScQy");

  const url = 'https://auth2.igad-health.eu/realms/regional-pandemic-analytics/protocol/openid-connect/token';

  const response = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: encodedParams
  });

  const data = await response.json();  

  const helloResponse = await fetch('http://localhost:3000', {
    headers: {
      'Authorization': `Bearer ${data.access_token}`,
    }
  })

  const helloData = await helloResponse.text();

  return res.send(helloData)
}