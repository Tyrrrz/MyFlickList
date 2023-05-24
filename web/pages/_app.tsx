import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { FC } from 'react';
import Layout from '~/components/layout';

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
