import { PageLoad } from "@/components/Loader";
import Head from "next/head";

const Homepage = () => {
  return (
    <>
    <Head>
      <title>Welcome | IGAD Health Application</title>
      <meta name="description" content="IGAD - Health Platform" />
    </Head>
    <PageLoad />
    </>
  );
};

export default Homepage;
