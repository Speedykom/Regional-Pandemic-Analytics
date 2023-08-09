import { ReactNode, useState } from 'react'
import { Dialog } from '@headlessui/react'

interface Props {
    state: boolean;
    onClose: () => void;
    children: ReactNode;
    className: string;
}

export const AppModal = ({state, onClose, children, className}: Props) => {
  return (
    <Dialog
      open={state}
      onClose={onClose}
      className="relative z-50"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* The actual dialog panel  */}
        <Dialog.Panel className={`rounded bg-white ${className}`}>
          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}