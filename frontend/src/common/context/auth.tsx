import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import secureLocalStorage from "react-secure-storage";
import GlobalLoad from "../components/global-loader";
import axios from "axios";
import { BASE_URL } from "../config";
import Router from "next/router";

const AuthContext = createContext({});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    async function verifiedUser() {
      axios
        .get(`${BASE_URL}/api/auth/me`)
        .then((res) => {
          const data: any = secureLocalStorage.getItem("tokens");
          if (data) setUser(data);
        })
        .catch(handleError)
        .catch(({status }) => {
          if (status === 401 && Router.pathname !== "/login")
            Router.push("/login");
        })
        .finally(() => setLoading(false));
    }
    verifiedUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!user, isLoading: loading, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth: any = () => useContext(AuthContext);

interface props {
  children: ReactNode;
}

export const UnAuthorize = {
  redirect: {
    permanent: false,
    destination: `/login`,
  },
};

export const NoNetwork = {
  redirect: {
    permanent: false,
    destination: `/network`,
  },
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

export const ProtectRoute = ({ children }: props) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    if (
      isLoading ||
      (!isAuthenticated &&
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/not-found" &&
        window.location.pathname !== "/network")
    )
      return <GlobalLoad />;
  }

  return <>{children}</>;
};
