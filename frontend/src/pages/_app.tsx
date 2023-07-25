import { ToastContainer } from 'react-toastify';
import { SWRConfig } from 'swr';
import axios from 'axios';
import { AppProps } from 'next/app';
import '@/common/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { store } from '@/common/redux/store';
import { ModalProvider } from '@/common/hooks/use-modal';
import dynamic from 'next/dynamic';

function CsrApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 3000,
        fetcher: (resource, init) =>
          axios.get(resource, init).then((res) => res.data),
      }}
    >
      <ModalProvider>
        <Provider store={store}>
          <ConfigProvider
            theme={{
              components: {},
              token: {
                colorPrimary: '#007b38',
                fontSize: 14,
              },
            }}
          >
            <Component {...pageProps} />
            <ToastContainer />
          </ConfigProvider>
        </Provider>
      </ModalProvider>
    </SWRConfig>
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
