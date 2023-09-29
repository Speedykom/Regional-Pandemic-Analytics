import { ToastContainer } from 'react-toastify';
import { AppProps } from 'next/app';
import '@/common/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { store } from '@/common/redux/store';
import { ModalProvider } from '@/common/hooks/use-modal';
import dynamic from 'next/dynamic';
import { AuthProvider } from '@/common/hooks/use-auth';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

function CsrApp({ Component, pageProps }: AppProps) {
  // Lisez la langue sélectionnée depuis le localStorage
  const selectedLanguage =
    typeof window !== 'undefined' && localStorage.getItem('language');

  // Définissez la direction du texte (RTL) en fonction de la langue sélectionnée
  if (selectedLanguage === 'ar') {
    document.body.classList.add('rtl');
  } else {
    document.body.classList.remove('rtl');
  }

  // Initialisez la langue de l'application avec la langue sélectionnée ou par défaut
  const languageToUse = selectedLanguage || 'en';
  i18n.changeLanguage(languageToUse);

  return (
    <Provider store={store}>
      <ModalProvider>
        <AuthProvider>
          <ConfigProvider
            theme={{
              components: {},
              token: {
                colorPrimary: '#007b38',
                fontSize: 14,
              },
            }}
          >
            <I18nextProvider i18n={i18n}>
              <Component {...pageProps} />
            </I18nextProvider>
            <ToastContainer />
          </ConfigProvider>
        </AuthProvider>
      </ModalProvider>
    </Provider>
  );
}

// Désactivez le rendu côté serveur (SSR) pour toute l'application
const App = dynamic(async () => CsrApp, { ssr: false });

export default App;
