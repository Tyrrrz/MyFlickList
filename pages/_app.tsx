import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import { FC } from 'react';
import Layout from '~/components/layout';
import '~/pages/globals.css';

const App: FC<AppProps> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
};

export default App;
