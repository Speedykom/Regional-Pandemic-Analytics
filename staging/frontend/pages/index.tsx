import { useKeycloak } from "@react-keycloak/ssr";
import Head from "next/head";

const Homepage = () => {
  const { keycloak } = useKeycloak()

  console.log(keycloak);
  
  return (
    <>
    <Head>
      <title>Welcome | IGAD Health Application</title>
      <meta name="description" content="IGAD - Health Platform" />
    </Head>
    </>
  );
};

export default Homepage;
