import Layout from "@/common/components/Dashboard/Layout";
import { Loader } from "@/common/components/Loader";
import { Loading } from "@/common/components/Loading";
import LoginForm from "@/modules/login/views/login";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

const LoginPage = () => {
	const router = useRouter();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const authState = secureLocalStorage.getItem("sua") as string;

	useEffect(() => {
		if (authState === "authenticated") {
			router.push("/home");
			setIsAuthenticated(true);
		} else {
			setIsAuthenticated(false);
		}
	}, []);

	return <div>{typeof window != undefined ? <Loading /> : !isAuthenticated ? <LoginForm /> : <Loading />}</div>;
};

export default LoginPage;
