import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import Router, { useRouter } from "next/router";
import { useMeQuery } from "@/modules/auth/auth";
import { Loading } from "../components/Loading";
import axios from "axios";
import getConfig from "next/config";
import secureLocalStorage from "react-secure-storage";

const { publicRuntimeConfig } = getConfig();

const AuthContext = createContext({});

export const AuthProvider = ({ children }: any) => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const path = router.pathname;

  useEffect(() => {
    setLoading(true);

    async function loadUserFromCookies() {
      let headers = {};

      const tokens = secureLocalStorage.getItem("tokens") as {
        accessToken: string;
        refreshToken: string;
      };

      if (tokens) {
        const { accessToken } = tokens as any;
        headers = { AUTHORIZATION: accessToken };
      }

      await axios
        .get(`${publicRuntimeConfig.NEXT_PUBLIC_BASE_URL}/api/auth/me`, {
          headers,
        })
        .then((res) => res.data)
        .then(({ active, error }) => {
          if (active) setUser(active);

          if ((error || !active) && router.pathname !== "/login") Router.push("/login");

          if (active && router.pathname === "/login") {
            Router.push("/");
            return;
          }
        })
        .finally(() => setLoading(false));
    }

    loadUserFromCookies();
  }, [router.pathname]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!user, isLoading: loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth: any = () => useContext(AuthContext);

interface Props {
  children: ReactNode;
}

export const ProtectRoute = ({ children }: Props) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Loading />;
  else if (!isAuthenticated && window.location.pathname !== "/login") {
    router.push("/login");
    return <Loading />;
  }

  return children;
};

export const handleError = (err: any) => {
  const { response, code } = err;

  if (code === "ERR_NETWORK") throw { status: 307, data: "Network issue" };

  if (!response) throw err;

  const { status, data, statusText } = response;

  throw {
    status,
    data,
    statusText,
  };
};
