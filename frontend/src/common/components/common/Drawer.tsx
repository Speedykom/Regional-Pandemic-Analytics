import React, { ReactNode, useRef } from 'react';
import ReactDom from 'react-dom';
import { FiX } from 'react-icons/fi';

interface props {
  children: ReactNode;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  placement?: string;
  width?: number;
  footer?: ReactNode;
}

const Portal = ({ children }: Pick<props, 'children'>) => {
  return ReactDom.createPortal(children, document.body);
};

const Drawer = ({
  children,
  title,
  isOpen,
  onClose,
  placement = 'left',
  width = 300,
  footer,
}: props) => {
  const drawerRef = useRef<any>();

  const checkAndCloseDrawer = (e: any) => {
    if (drawerRef?.current?.contains(e.target)) return;
    onClose();
  };

  const wrapperClasses = () => {
    if (isOpen) return 'top-0 bottom-0 left-0 right-0';

    switch (placement) {
      case 'right':
        return 'w-0 top-0 bottom-0 right-0';
      case 'left':
        return 'w-0 top-0 bottom-0 left-0';
      case 'top':
        return 'h-0 left-0 right-0 top-0';
      case 'bottom':
        return 'h-0 left-0 right-0 bottom-0';
    }
  };

  const drawerClasses = () => {
    switch (placement) {
      case 'right':
        return `right-0 w-[${width}px] h-full ${
          !isOpen ? ' translate-x-full' : ''
        }`;
      case 'left':
        return `left-0 w-[${width}px] h-full ${
          !isOpen ? ' -translate-x-full' : ''
        }`;
      case 'top':
        return `top-0 h-[${width}px] w-full ${
          !isOpen ? ' -translate-y-full' : ''
        }`;
      case 'bottom':
        return `bottom-0 h-[${width}px] w-full ${
          !isOpen ? ' translate-y-full' : ''
        }`;
    }
  };

  return (
    <>
      <Portal>
        <div
          className={`fixed z-[1000] mt-16 ${wrapperClasses()}`}
          onClick={checkAndCloseDrawer}
        >
          <div className="absolute w-full h-full bg-black bg-opacity-30" />
          <div
            ref={drawerRef}
            className={`absolute flex flex-col bg-white transition duration-500 overflow-auto ${drawerClasses()}`}
          >
            <div className="flex justify-between items-center p-4">
              <div>{title}</div>
              <button className="w-8 h-8" onClick={onClose}>
                <FiX />
              </button>
            </div>
            <div>{children}</div>
            <footer className="mt-auto border-t py-2">{footer}</footer>
          </div>
        </div>
      </Portal>
    </>
  );
};

export default Drawer;
