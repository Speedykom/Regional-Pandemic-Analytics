import React, { useState } from 'react';
import { languages, defaultLanguage } from '../config/language';
import { useRouter } from 'next/router';

const LanguageSelector: React.FC = () => {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    router.locale || defaultLanguage
  );

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    router.push(router.pathname, undefined, { locale: languageCode });
    //router.reload();
    //console.log(`Lang chang to ${languageCode}`);
  };

  return (
    <div className="language-selector flex items-center">
      <select
        className="border rounded-md px-2 py-1 focus:outline-none focus:ring focus:border-blue-300 mr-2"
        onChange={(e) => handleLanguageChange(e.target.value)}
        value={selectedLanguage}
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
