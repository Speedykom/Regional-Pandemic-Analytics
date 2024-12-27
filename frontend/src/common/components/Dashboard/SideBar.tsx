import { useEffect } from 'react';
import Head from 'next/head';
import { BsFillArrowLeftSquareFill } from 'react-icons/bs';

import { motion, useAnimation } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { SideNavLinks } from './Menu';
import { closeSidebar, openSidebar } from './SidebarSlice';

interface SidebarProps {
  isOpen: boolean;
}

export default function SideBar({ isOpen }: SidebarProps) {
  const controls = useAnimation();
  const controlstext = useAnimation();
  const controlstextopacity = useAnimation();
  const controlsfeed = useAnimation();
  const reversecontrolsfeed = useAnimation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window !== undefined) {
      if (isOpen) {
        controls.start({
          width: '200px',
          transition: { duration: 0.0 },
        });
        controlstextopacity.start({
          opacity: 1,
          transition: { delay: 0.0 },
        });
        controlstext.start({
          opacity: 1,
          display: 'block',
          transition: { delay: 0.0 },
        });

        controlsfeed.start({
          display: 'flex',
        });
        reversecontrolsfeed.start({
          display: 'none',
        });
      } else {
        controls.start({
          width: '55px',
          transition: { duration: 0.0 },
        });
        controlsfeed.start({
          display: 'none',
        });
        reversecontrolsfeed.start({
          display: 'flex',
        });
        controlstextopacity.start({
          opacity: 0,
        });
        controlstext.start({
          opacity: 0,
          display: 'none',
        });
      }
    }
  });

  return (
    <div
      className={`bg-white ${
        isOpen && 'w-full'
      } h-full border-r border-gray-400/70`}
      style={isOpen ? { width: '200px' } : { width: '55px' }}
    >
      <Head>
        <title>d-OHP</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <motion.div
        animate={controls}
        className={`animation w-full duration-500 h-full group pt-10 relative shadow-xl text-gray-500 `}
      >
        <BsFillArrowLeftSquareFill
          onClick={() => {
            if (!isOpen) {
              dispatch(openSidebar());
              // showMore();
            } else {
              dispatch(closeSidebar());
              // showLess();
            }
          }}
          className={`cursor-pointer group-hover:block animate duration-300 absolute bg-prim text-white text-3xl -right-4 top-2 rounded-full border border-gray-400/70  ${
            isOpen == false && 'rotate-180'
          }`}
        />

        <motion.div
          // animate={reversecontrolsfeed}
          className="px-4 flex items-center justify-center flex-col mx-4 my-auto"
        >
          <img
            className={`w-44 h-auto ${!isOpen && 'w-10'}`}
            src="/cohis.png"
            alt="company logo"
          />
        </motion.div>

        <SideNavLinks
          controlstext={controlstext}
          controlstextopacity={controlstextopacity}
          isOpen={isOpen}
        />
      </motion.div>
    </div>
  );
}
