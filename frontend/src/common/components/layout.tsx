import { useState, useEffect, ReactNode } from "react";
import Menu from "./menu";
import Head from "next/head";
import Nav from "./nav";

interface props {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title }: props) {
  const [menu, setMenu] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  function handleResize() {
    if (innerWidth <= 640) {
      setMenu(false);
      setIsMobile(true);
    } else {
      setMenu(true);
      setIsMobile(false);
    }
  }

  const onChange = (state: boolean) => {
    setMenu(state);
  };

  useEffect(() => {
    if (typeof window != undefined) {
      addEventListener("resize", handleResize);
    }

    return () => {
      removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <Head>
        <title>{title} | RePAN</title>
        <meta name="description" content="SpeedyKom" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="flex h-screen w-full">
        <Menu menu={menu}/>
        <div className="flex flex-1 flex-col">
          <Nav menu={menu} onChange={onChange} />
          <main className="transition-all duration-[400ms] flex-1 overflow-y-auto container mx-auto">
            <div className="px-4 md:px-10 py-10 bg-gray-100 h-screen">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
