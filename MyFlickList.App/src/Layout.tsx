import React, { Suspense, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { pageview as trackPageView } from 'react-ga';
import { useForm } from 'react-hook-form';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FiTv } from 'react-icons/fi';
import { useHistory, useLocation } from 'react-router';
import config from './infra/config';
import { AuthTokenHelper } from './infra/helpers';
import Routing, { routes } from './Routing';
import ErrorAlert from './shared/ErrorAlert';
import Link from './shared/Link';
import useAuthToken from './shared/useAuthToken';

function HeaderUserBox() {
  const [token] = useAuthToken();

  // Not signed in
  if (!token) {
    return (
      <Link className="text-xl font-semibold" href={routes.signIn()}>
        Sign in
      </Link>
    );
  }

  const tokenHelper = new AuthTokenHelper(token);

  // TODO: use actual avatar
  const avatarUrl = `https://robohash.org/${tokenHelper.getProfileId()}_${tokenHelper.getUsername()}.png?size=300x300`;

  // Signed in
  return (
    <Link
      className="inline-flex items-center text-xl font-semibold group"
      href={routes.profile({
        profileId: tokenHelper.getProfileId(),
        profileName: tokenHelper.getUsername()
      })}
    >
      <img
        className="rounded-full shadow opacity-75 group-hover:opacity-100"
        alt="Avatar"
        width={32}
        height={32}
        src={avatarUrl}
      />

      <span className="ml-3 truncate">{tokenHelper.getUsername()}</span>
    </Link>
  );
}

function HeaderSearchBox() {
  const history = useHistory();
  const { register, handleSubmit } = useForm({ defaultValues: { query: '' } });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        history.push(routes.search({ query: data.query }));
      })}
    >
      <input
        className="mt-1 rounded-full"
        type="search"
        name="query"
        placeholder="Search"
        ref={register}
      />

      <input type="submit" hidden />
    </form>
  );
}

function Header() {
  return (
    <header className="flex flex-row items-center py-4">
      {/* Brand */}
      <div className="mr-3 flex-grow">
        <Link
          className="inline-flex items-center text-4xl text-black tracking-wide font-normal"
          href={routes.home()}
        >
          <FiTv /> <span className="ml-2">MyFlickList</span>
        </Link>
      </div>

      {/* Profile */}
      <HeaderUserBox />

      {/* Separator */}
      <div className="w-px h-8 mt-1 mx-4 border border-gray-200" />

      {/* Navigation */}
      <nav className="mr-6 text-xl space-x-4">
        <Link className="font-normal" href={routes.flicks({})}>
          Flicks
        </Link>
        <Link className="font-normal" href={routes.flicks({})}>
          Characters
        </Link>
        <Link className="font-normal" href={routes.flicks({})}>
          Actors
        </Link>
        <Link className="font-normal" href={routes.flicks({})}>
          Network
        </Link>
      </nav>

      {/* Search */}
      <HeaderSearchBox />
    </header>
  );
}

function PageErrorFallback({ error, reset }: { error: unknown; reset: () => void }) {
  const history = useHistory();

  // Reset error when navigating away
  history.listen(() => reset());

  return <ErrorAlert error={error} />;
}

function PageBusyFallback() {
  const [isVisible, setIsVisible] = useState(false);

  // Add a delay before showing the indicator to prevent flickering
  useEffect(() => {
    const timeout = window.setTimeout(() => setIsVisible(true), 200);

    return () => window.clearTimeout(timeout);
  }, []);

  if (!isVisible) {
    return <></>;
  }

  return (
    <div className="p-12 text-center">
      <AiOutlineLoading3Quarters className="mx-auto animate-spin text-6xl text-blue-600" />
    </div>
  );
}

function Page() {
  return (
    <main className="flex-grow py-8">
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <PageErrorFallback error={error} reset={resetErrorBoundary} />
        )}
      >
        <Suspense fallback={<PageBusyFallback />}>
          <Routing />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}

function Footer() {
  return (
    <footer className="my-4 mx-auto py-1 border-t-2 uppercase text-sm">
      <Link className="font-normal" href="https://twitter.com/My_Flick_List">
        Twitter
      </Link>
      {' • '}
      <Link className="font-normal" href="https://discord.gg/hgVa7qS">
        Discord
      </Link>
      {' • '}
      <Link className="font-normal" href="https://github.com/Tyrrrz/MyFlickList">
        Source
      </Link>
      {' • '}
      <Link className="font-normal" href={routes.credits()}>
        Credits
      </Link>
      {' • '}
      <Link className="font-normal" href={routes.feedback()}>
        Feedback
      </Link>
      {' • '}
      <Link className="font-normal" href={routes.donate()}>
        Donate
      </Link>
    </footer>
  );
}

export default function Layout() {
  const { pathname, search } = useLocation();

  // Track navigation
  useEffect(() => {
    if (config.googleAnalyticsToken) {
      trackPageView(pathname + search);
    }
  }, [pathname, search]);

  return (
    <div className="flex flex-col container min-h-screen mx-auto">
      <Header />
      <Page />
      <Footer />
    </div>
  );
}
