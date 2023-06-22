import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import secureLocalStorage from "react-secure-storage";
import GlobalLoad from "../components/global-loader";

const AuthContext = createContext({});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    async function loadUserFromLocalStorage() {
      const data: any = secureLocalStorage.getItem("user");
      if (data) setUser(data);
      setLoading(false);
    }
    loadUserFromLocalStorage();
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
