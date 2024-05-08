import { ToastContainer } from 'react-toastify';
import { AppProps } from 'next/app';
import '@/common/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { store } from '@/common/redux/store';
import { ModalProvider } from '@/common/hooks/use-modal';
import dynamic from 'next/dynamic';
import { AuthProvider } from '@/common/hooks/use-auth';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

function CsrApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ModalProvider>
        <AuthProvider>
          <I18nextProvider i18n={i18n}>
            <Component {...pageProps} />
          </I18nextProvider>
          <ToastContainer />
        </AuthProvider>
      </ModalProvider>
    </Provider>
  );
}

// We are disabling the SSR for the whole app since the rendering
// depends mainly on the current user status (logged in or not)
// Since the user token is stored in the browser local storage, the CSR / SSR rendering
// will be different.
//
// See more info here: https://nextjs.org/docs/messages/react-hydration-error
const App = dynamic(async () => CsrApp, { ssr: false });

export default App;
