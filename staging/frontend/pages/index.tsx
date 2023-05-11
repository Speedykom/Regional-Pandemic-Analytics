import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Login from '@/components/Login';
import Head from 'next/head';
const Homepage = () => {
  const data = useSession();
  const router = useRouter();

  const head = (
    <Head>
      <title>Welcome | IGAD Health Application</title>
      <meta name="description" content="IGAD - Health Platform" />
    </Head>
  );

  let ret = <></>;

  switch (data.status) {
    case 'authenticated':
      router.push('/dashboard');
      return <></>;
    case 'unauthenticated':
      ret = <Login />;
      break;
    default:
      ret = <></>;
      break;
  }
  return (
    <>
      {head}
      {ret}
    </>
  );
};

export default Homepage;
