import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

interface props {
  href: string;
  children: ReactNode;
  activeClassName?: string;
  className?: string;
}

export const NavLink = ({
  href,
  activeClassName,
  className,
  children,
}: props) => {
  const { asPath } = useRouter();

  let active = false;

  if (asPath.startsWith(href) && href !== "/") active = true;
  else if (href === "/" && asPath === href) active = true;

  return (
    <Link
      href={href}
      className={` text-base ${active ? activeClassName : ""} ${className}`}
    >
      {children}
    </Link>
  );
};

interface MenuProps {
  icon?: ReactNode;
  label: string;
  children: ReactNode | ReactNode[];
}

export const MenuLink = ({ label, icon, children }: MenuProps) => {
  const [state, setState] = useState(false);
  return (
    <div className="mb-1">
      <div onClick={() => setState(!state)} className="flex items-center justify-between text-gray-300 hover:text-white cursor-pointer px-5 py-2">
        <div className="flex space-x-3 items-center">
          <p className="text-base">{icon}</p>
          <p className="font-extralight text-base">{label}</p>
        </div>
        {
          state ? 
          <BiChevronUp className="text-base" /> : 
          <BiChevronDown className="text-base" />
        }
      </div>
      {state ? <div className="menu-color py-2">{children}</div> : null}
    </div>
  );
};
