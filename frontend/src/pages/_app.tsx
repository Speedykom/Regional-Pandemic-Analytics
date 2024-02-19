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

const Tour = dynamic(() => import('../common/components/Tour'), { ssr: false });

function CsrApp({ Component, pageProps }: AppProps) {
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
      <Tour />
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
