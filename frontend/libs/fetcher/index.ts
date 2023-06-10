import axios from "axios";

export const axiosFetcher = async (
  url: string,
  username: string,
  password: string
) => {
  const response = await axios.get(url, {
    auth: {
      username,
      password,
    },
  });

  return response.data;
};
