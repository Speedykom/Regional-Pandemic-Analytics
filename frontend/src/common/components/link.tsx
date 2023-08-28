import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

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

  if (asPath.startsWith(href) && href !== '/') active = true;
  else if (href === '/' && asPath === href) active = true;

  return (
    <Link
      href={href}
      className={`${className} ${active ? activeClassName : ''}`}
    >
      {children}
    </Link>
  );
};
