import { useRouter } from 'next/router';

import React, { useEffect, useRef } from 'react';
import keycloak from '@/common/config/keycloak';
import {
  selectIsAuthenticated,
  setCredentials,
  useLoginMutation,
  useMeQuery,
} from '@/modules/auth/auth';
import { OAuthParams } from '@/modules/auth/interface';
import { useDispatch, useSelector } from 'react-redux';
import { Loading } from '../components/Loading';
import { parseQuery } from '../utils/misc';

export interface AuthContextValue {
  signInWithKeyCloak: () => void;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);
AuthContext.displayName = 'AuthContext';

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const { refetch } = useMeQuery('');
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();
  const oauthRef = useRef<OAuthParams | null>(null);
  const currentUrl = window.location.href;
  const isLoginPage = router.pathname === '/';
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated && router.asPath !== '/') {
      router.push('/');
    } else if (isAuthenticated && router.asPath === '/') {
      router.push('/home');
    }
  }, [isAuthenticated, router]);

  const signInWithKeyCloak = () => {
    keycloak.init({
      onLoad: 'login-required',
      redirectUri: currentUrl,
      checkLoginIframe: false,
    });
  };

  useEffect(() => {
    // Check if token is not expired
    if (isAuthenticated) {
      refetch();
    }
  }, [router.asPath, isAuthenticated]);

  useEffect(() => {
    const { asPath } = router;
    const hash = asPath.split('#')[1];
    if (!oauthRef.current && isLoginPage && hash) {
      const params = parseQuery(hash) as OAuthParams;
      oauthRef.current = params;
      login(params)
        .unwrap()
        .then((payload) => {
          dispatch(
            setCredentials({
              permissions: payload.permissions,
              accessToken: payload.access_token,
              refreshToken: payload.refresh_token,
            })
          );

          router.push('/home');
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider
      value={{
        signInWithKeyCloak,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error(`useAuth must be used within an AuthProvider`);
  }
  return context;
};
