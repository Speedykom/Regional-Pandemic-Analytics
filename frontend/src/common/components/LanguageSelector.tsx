import React from 'react';

import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  return (
    <div className="language-selector flex items-center">
      <select
        className="border rounded-md px-2 py-1 focus:outline-none focus:ring focus:border-blue-300 mr-2"
        onChange={(e) => changeLanguage(e.target.value)}
        value={i18n.language}
      >
        <option value="en">English</option>
        <option value="fr">French</option>
      </select>
    </div>
  );
};
export default LanguageSelector;
