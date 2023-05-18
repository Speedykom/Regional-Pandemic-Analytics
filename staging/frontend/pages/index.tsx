import Head from "next/head";
import Image from "next/image";
import css from "styled-jsx/css";
import {useForm} from "react-hook-form";
import * as z from 'zod'
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/router";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import jwt_decode from "jwt-decode";

const schema = z.object({
    username: z
        .string()
        .min(5, { message: 'Username must contain at least 5 character(s)' }),
    password: z
        .string()
        .min(5, { message: 'Password must contain at least 5 character(s)' }),
});


type TFormValues = {
    username: string;
    password: string;
};

type TPayload = {
    [key: string]: string;
};

const globalStyles = css.global`
  body {
    background-color: #eeeeee;
  }
`;

export default function LoginForm(){
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TFormValues>({ resolver: zodResolver(schema) });

    const handleLogin = (data: TFormValues) => {
        axios
            .post('/api/accounts/login/', JSON.stringify(data), {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => {
                if(response.status == 200){

                    let payload = jwt_decode(response?.data?.result?.access_token)

                    // @ts-ignore
                    secureLocalStorage.setItem("username", payload?.given_name)
                    secureLocalStorage.setItem("sua", "authenticated")

                    router.push("/dashboard/")
                }

            })
            .catch((error: unknown) => {
                if (error instanceof Error)
                    console.log(error);
            });
    };
    return(
        <>
            <Head>
                <title>Regional Pandemic Analytics Tool | Welcome</title>
            </Head>
            <style jsx>{globalStyles}</style>
            <section className="gradient-form md:h-screen">
                <div className="container mx-auto px-6" style={{marginTop:"10%"}}>
                    <div className="flex justify-center items-center flex-wrap g-6 text-gray-800">
                        <div className="xl:w-10/12">
                            <div className="block bg-white shadow-lg rounded-lg">
                                <div className="lg:flex lg:flex-wrap g-0">
                                    <div className="lg:w-6/12 px-4 md:px-0">
                                        <div className="md:p-12 md:mx-6">
                                            <div className="text-center">
                                                <Image
                                                    className="mx-auto w-48"
                                                    src="/images/igad_logo.jpg"
                                                    alt="logo"
                                                    width={450}
                                                    height={300}
                                                />
                                            </div>
                                            <form onSubmit={handleSubmit(handleLogin)}>
                                                <p className="mt-3 mb-4 text-center font-semibold">
                                                    Please login to your account
                                                </p>
                                                <div className="mb-4">
                                                    <input
                                                        {...register('username')}
                                                        id="username"
                                                        name="username"
                                                        type="username"
                                                        autoComplete="username"
                                                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                        placeholder="Username"
                                                    />
                                                    <span className="text-xs tracking-wide text-red-600">
                                                        {errors?.username && errors.username.message}
                                                    </span>
                                                </div>
                                                <div className="mb-4">
                                                    <input
                                                        {...register('password')}
                                                        id="password"
                                                        name="password"
                                                        type="password"
                                                        autoComplete="current-password"
                                                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                    />
                                                    <span className="text-xs tracking-wide text-red-600">
                                                        {errors?.password && errors.password.message}
                                                    </span>
                                                </div>
                                                <button
                                                    className="bg-emerald-700 inline-block px-6 py-2.5 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-emerald-500 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full mb-3"

                                                    data-mdb-ripple="true"
                                                    data-mdb-ripple-color="light"
                                                    onClick={()=> console.log("clicked")}
                                                >
                                                    Log in
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="bg-emerald-700 lg:w-6/12 flex items-center lg:rounded-r-lg rounded-b-lg lg:rounded-bl-none">
                                        <div className="text-white px-4 py-6 md:p-12 md:mx-6">
                                            <h4 className="text-2xl font-semibold mb-4">
                                                Welcome back!
                                            </h4>
                                            <p className="text-sm">
                                                Simply login to access the IGAD regional pandemic analytics tool to collect, analyze,
                                                and report granular and aggregated data from multiple sources for informed decision-making.
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
    )
} 