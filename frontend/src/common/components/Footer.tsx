import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="bg-white py-4 fixed bottom-0 w-full">
      <div className="container mx-auto max-w-screen-lg">
        <div className="px-4 flex flex-col md:flex-row items-center justify-between text-gray-600">
          <div className="mb-4 md:mb-0 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <ul className="mb-4 md:mb-0 flex space-x-4">
              <li>
                <Link href="/footer/learn-more" className="text-prim text-xs">
                  {t('learnMore')}
                </Link>
              </li>
              <li>
                <Link href="/footer/privacy" className="text-prim text-xs">
                  {t('Privacy')}
                </Link>
              </li>
              <li>
                <Link
                  href="/footer/terms-of-service"
                  className="text-prim text-xs"
                >
                  {t('TermsOfService')}
                </Link>
              </li>
              <li>
                <Link
                  href="/footer/business-agreement"
                  className="text-prim text-xs"
                >
                  {t('BusinessAgreement')}
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-xs text-gray-500">
            &copy; {currentYear}
            IGAD.{t('AllRightsReserved')}.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
