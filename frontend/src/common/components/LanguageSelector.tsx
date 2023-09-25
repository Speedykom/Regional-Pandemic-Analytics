import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem('language') || 'en'
  );

  const changeLanguage = (lng: string) => {
    // Update the language using i18n and also set it in local storage
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <div className="language-selector flex items-center">
      <select
        className="border rounded-md px-2 py-1 focus:outline-none focus:ring focus:border-blue-300 mr-2"
        onChange={(e) => changeLanguage(e.target.value)}
        value={currentLanguage}
      >
        <option value="en">English</option>
        <option value="fr">French</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
