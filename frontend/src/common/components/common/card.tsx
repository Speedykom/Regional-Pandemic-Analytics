import { ReactNode } from 'react';

interface props {
  children: ReactNode;
  className?: string | undefined;
}

export const IGADCard = ({ children, className }: props) => {
  return (
    <div className={`bg-white border mb-5 ${className || ''}`}>{children}</div>
  );
};
