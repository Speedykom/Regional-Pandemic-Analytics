import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useRef,
} from "react";
const Keycloak = typeof window !== "undefined" ? require("keycloak-js") : null;

const AuthContext = createContext({});

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const isRun = useRef(false);
  const [isLogin, setLogin] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const [keycloak, setClient] = useState<any>();

  useEffect(() => {
    if (isRun.current) return;

    isRun.current = true;
    const client = Keycloak({
      clientId: "frontend",
      realm: "regional-pandemic-analytics",
      url: "https://auth2.igad-health.eu/",
    });

    client
      .init({ onLoad: "login-required" })
      .then((res: boolean) => {
        setLogin(res);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth: any = () => useContext(AuthContext);
