import React, { ReactNode, useEffect, useRef, useState } from 'react';
import ReactDom from 'react-dom';

interface props {
  children: any;
  title?: string;
  okText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  position?: string;
  isDismissible?: boolean;
}

interface portalProps {
  children: ReactNode;
}

const Portal = ({ children }: portalProps) => {
  return ReactDom.createPortal(children, document.body);
};

const Popconfirm = ({
  children,
  title = 'Are you sure?',
  okText = 'Yes',
  cancelText = 'No',
  onConfirm,
  onCancel,
  position = 'left',
  isDismissible = true,
}: props) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef: any = useRef();
  const elementRef: any = useRef();
  const space = 5;

  useEffect(() => {
    if (!isDismissible || !isOpen) return;
    document.addEventListener('click', checkAndHidePopconfirm);
    return () => document.removeEventListener('click', checkAndHidePopconfirm);
  }, [isOpen]);

  const checkAndHidePopconfirm = (e: any) => {
    if (
      popoverRef.current?.contains(e.target) ||
      elementRef.current?.contains(e.target)
    )
      return;
    setIsOpen(false);
  };

  const handleClickElement = (e: any) => {
    e.preventDefault();
    setIsOpen((isOpen) => !isOpen);
    const { x, y } = getPoint(
      elementRef.current,
      popoverRef.current,
      position,
      space
    );
    popoverRef.current.style.left = `${x}px`;
    popoverRef.current.style.top = `${y}px`;
  };

  const handleClickOk = () => {
    setIsOpen(false);
    onConfirm();
  };

  const handleClickCancel = (e: any) => {
    e.preventDefault();
    setIsOpen(false);
    if (onCancel) {
      onCancel();
    }
  };

  const getPoint = (
    element: HTMLElement,
    popover: HTMLElement,
    position: string,
    space: number
  ) => {
    const eleRect = element.getBoundingClientRect();
    const pt = { x: 0, y: 0 };
    switch (position) {
      case 'bottom': {
        pt.x = eleRect.left + (element.offsetWidth - popover.offsetWidth) / 2;
        pt.y = eleRect.bottom + (space + 10);
        break;
      }
      case 'left': {
        pt.x = eleRect.left - (popover.offsetWidth + (space + 10));
        pt.y = eleRect.top + (element.offsetHeight - popover.offsetHeight) / 2;
        break;
      }
      case 'right': {
        pt.x = eleRect.right + (space + 10);
        pt.y = eleRect.top + (element.offsetHeight - popover.offsetHeight) / 2;
        break;
      }
      case 'top': {
        pt.x = eleRect.left + (element.offsetWidth - popover.offsetWidth) / 2;
        pt.y = eleRect.top - (popover.offsetHeight + (space + 10));
        break;
      }
    }
    return pt;
  };

  const posDepClasses = () => {
    switch (position) {
      case 'top':
        return " after:absolute after:content-[''] after:left-1/2 after:top-full after:-translate-x-1/2 after:border-[10px] after:border-transparent after:border-t-white ";
      case 'bottom':
        return " after:absolute after:content-[''] after:left-1/2 after:bottom-full after:-translate-x-1/2 after:border-[10px] after:border-transparent after:border-b-white ";
      case 'left':
        return " after:absolute after:content-[''] after:top-1/2 after:left-full after:-translate-y-1/2 after:border-[10px] after:border-transparent after:border-l-white ";
      case 'right':
        return " after:absolute after:content-[''] after:top-1/2 after:right-full after:-translate-y-1/2 after:border-[10px] after:border-transparent after:border-r-white ";
    }
  };
  const popoverClasses = `fixed z-50 bg-white border rounded-sm p-5 shadow-[0_3px_6px_-4px_#0000001f,0_6px_16px_#00000014,0_9px_28px_8px_#0000000d] transition ${
    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
  } ${posDepClasses()}`;

  return (
    <>
      {React.cloneElement(children, {
        onClick: handleClickElement,
        ref: elementRef,
      })}

      <Portal>
        <div ref={popoverRef} className={popoverClasses}>
          <div className="flex px-2 mb-4">
            <span>
              <i className="fa-solid fa-circle-info text-blue-500" />
            </span>
            <span>{title}</span>
          </div>
          <div className="flex">
            <button
              onClick={handleClickCancel}
              className="ml-auto mx-4 py-1 px-2 rounded-sm hover:bg-gray-200"
            >
              {cancelText}
            </button>
            <button
              onClick={handleClickOk}
              className="bg-indigo-400 text-white py-1 px-2 rounded-sm hover:bg-indigo-600"
            >
              {okText}
            </button>
          </div>
        </div>
      </Portal>
    </>
  );
};

export default Popconfirm;
