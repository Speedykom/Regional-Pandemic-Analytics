import Head from 'next/head';
import Image from 'next/image';
import { Button } from '@tremor/react';
import { useAuth } from '@/common/hooks/use-auth';
import { KeyIcon } from '@heroicons/react/24/solid';

export default function LoginForm() {
  const { signInWithKeyCloak } = useAuth();
  return (
    <>
      <Head>
        <title>Regional Pandemic Analytics Tool | Login</title>
      </Head>
      <section className="gradient-form md:h-screen">
        <div className="container mx-auto px-6" style={{ marginTop: '10vh' }}>
          <div className="flex justify-center items-center flex-wrap g-6 text-gray-800">
            <div className="xl:w-10/12">
              <div className="block bg-white shadow-lg rounded-lg">
                <div className="lg:flex lg:flex-wrap g-0">
                  <div className="lg:w-6/12 px-4 md:px-0">
                    <div className="md:p-12 md:mx-6">
                      <div className="text-center">
                        <Image
                          className="mx-auto w-72"
                          src="/images/igad_logo.jpg"
                          alt="logo"
                          width={500}
                          height={200}
                        />
                      </div>
                      <div className="mb-5">
                        <Button
                          icon={KeyIcon}
                          id="login-button"
                          type="button"
                          className="w-full bg-prim text-white rounded-md border-0 hover:bg-green-700"
                          size="lg"
                          onClick={signInWithKeyCloak}
                        >
                          Sign-In with KeyCloak
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-prim lg:w-6/12 flex items-center lg:rounded-r-lg rounded-b-lg lg:rounded-bl-none">
                    <div className="text-white px-4 py-6 md:p-12 md:mx-6">
                      <h4 className="text-2xl font-semibold mb-4">
                        Welcome back!
                      </h4>
                      <p className="text-sm">
                        Simply login to access the IGAD regional pandemic
                        analytics tool to collect, analyze, and report granular
                        and aggregated data from multiple sources for informed
                        decision-making.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
