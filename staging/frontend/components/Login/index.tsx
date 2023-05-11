import Head from "next/head";
import Image from "next/image";
import {signIn, useSession} from "next-auth/react";
import css from "styled-jsx/css";
import { useEffect } from "react";
import { useRouter } from "next/router";

const globalStyles = css.global`
  body {
    background-color: #eeeeee;
  }
`;

export default function LoginForm() {
    const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      void signIn('keycloak');
    } else if (status === 'authenticated') {
      void router.push('/');
    }
  });
    
    return <div></div>;
}