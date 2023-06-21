import Router, { useRouter } from "next/router";
import { ReactNode } from "react";
import { useAuth } from "./auth";

export const checkPermissions = (route: string, user: any) => {
  const subRoute = route.trim().split("/")[1];

  let path = subRoute.replace("-", " ").toLowerCase();

  return true;
};

interface props {
  children: ReactNode;
}

export const Permission = ({ children }: props) => {
  let access = true;

  const { user, isAuthenticated } = useAuth();
  const { pathname } = useRouter();

  if (
    (pathname === "/login" ||
      pathname === "/change-password" ||
      pathname === "/network") &&
    isAuthenticated &&
    user &&
    user.status != "Password Pending"
  ) {
    access = false;
    window.location.pathname = "/";
  }

  if (pathname === "/network" && isAuthenticated && !user) {
    access = false;
    window.location.pathname = "/login";
  }

  if (pathname !== "/network" && pathname !== "/login" && !isAuthenticated) {
    access = false;
    window.location.pathname = "/login";
  }

  if (isAuthenticated && pathname === "/not-found") {
    access = false;
    window.location.pathname = "/";
  }

  access = true;

  if (!access) window.location.pathname = "/";

  return access ? <>children</> : null;
};
