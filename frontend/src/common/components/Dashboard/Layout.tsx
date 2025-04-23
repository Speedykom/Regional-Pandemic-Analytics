import { useState, ReactNode } from 'react';
import SideBar from './SideBar';
import TopBar from './TopBar';
import Drawer from '../common/Drawer';
import { SideNavLinks } from './Menu';
import { useMediaQuery } from 'react-responsive';
import { useSelector } from 'react-redux';
import Footer from '../Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [showMobileNav, setShowMobileNav] = useState(false);
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1024px)' });

  const { isOpen } = useSelector((store: any) => store.sidebar);

  return (
    <>
      <TopBar
        isOpen={showMobileNav}
        setIsOpen={setShowMobileNav}
        isTabletOrMobile={isTabletOrMobile}
      />
      <main className="flex min-h-screen">
        <div className={`mt-16`}>
          {!isTabletOrMobile && <SideBar isOpen={isOpen} />}
          <Drawer
            title="COHIS"
            placement="left"
            isOpen={showMobileNav}
            onClose={() => setShowMobileNav(false)}
          >
            <div className="px-4 py-4">
              <div className={`text-gray-500`}>
                <div className="px-4 flex items-center justify-center flex-col mx-4 my-auto">
                  <img
                    className={`w-24 h-auto py-4`}
                    src="/cohis.png"
                    alt="company-logo"
                  />
                </div>
                <SideNavLinks isOpen={true} />
              </div>
            </div>
          </Drawer>
        </div>
        <div className={`w-full pt-16 transition-all duration-[400ms]`}>
          <div className="bg-gray-100">
            <div className="mx-3 md:mx-16 py-10">{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
