import { Analytics } from '@vercel/analytics/react';
import c from 'classnames';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FC, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import FadeIn from 'react-fade-in';
import { RxCommit, RxDesktop, RxHeart, RxTwitterLogo } from 'react-icons/rx';
import Inline from '~/components/inline';
import Link from '~/components/link';
import Meta from '~/components/meta';
import useDebounce from '~/hooks/useDebounce';
import useRouterStatus from '~/hooks/useRouterStatus';
import useSession from '~/hooks/useSession';
import { getBuildId } from '~/utils/env';

const Loader: FC = () => {
  // Only show the loading indicator if the navigation takes a while.
  // This prevents the indicator from flashing during faster navigation.
  const isVisible = useDebounce(useRouterStatus() === 'loading', 300);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      // Progress is not representative of anything, it's just used
      // to give a sense that something is happening.
      // The value is increased inverse-hyperbolically, so that it
      // gradually slows down and never actually reaches 100%.
      setProgress((progress) => progress + 0.1 * (0.95 - progress) ** 2);
    }, 100);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <div
      className={c('h-1', {
        'bg-blue-500': isVisible
      })}
      style={{
        width: `${progress * 100}%`,
        transitionProperty: 'width',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        transitionDuration: '150ms'
      }}
    />
  );
};

const UserBar: FC = () => {
  const { data } = useSession();

  if (data) {
    return (
      <div className={c('text-lg', 'font-semibold')}>
        <Link variant="discreet" href={`/u/${data.user.id}`}>
          {data.user.name}
        </Link>
      </div>
    );
  }

  return (
    <div className={c('text-lg', 'font-semibold')}>
      <Link button variant="discreet" onClick={() => signIn()}>
        Sign in
      </Link>
    </div>
  );
};

const SearchBar: FC = () => {
  return (
    <input
      className={c(
        'px-4',
        'py-2',
        'border',
        'border-neutral-300',
        'hover:border-blue-500',
        'rounded-md',
        'bg-white',
        'appearance-none',
        'focus:outline-none'
      )}
      type="search"
      placeholder="Search"
    />
  );
};

const Header: FC = () => {
  return (
    <div className={c('border-b-2', 'border-neutral-100', 'bg-white')}>
      <header
        className={c('flex', 'container', 'max-w-5xl', 'mx-auto', 'p-4', 'items-center', 'gap-4')}
      >
        {/* Logo */}
        <div className={c('text-2xl', 'tracking-wide')}>
          <Link variant="hidden" href="/">
            <Inline>
              <RxDesktop />
              <div className={c('ml-1')}>MyFlickList</div>
            </Inline>
          </Link>
        </div>

        {/* Separator */}
        <div className={c('w-px', 'h-8', 'mt-1', 'border', 'border-neutral-200')} />

        {/* Navigation bar */}
        <nav className={c('flex', 'flex-grow', 'gap-4', 'text-lg')}>
          <div>
            <Link variant="discreet" href="/flicks">
              Flicks
            </Link>
          </div>

          <div>
            <Link variant="discreet" href="/flicks">
              Clicks
            </Link>
          </div>

          <div>
            <Link variant="discreet" href="/flicks">
              Shlicks
            </Link>
          </div>

          <div>
            <Link variant="discreet" href="/flicks">
              Dicks
            </Link>
          </div>
        </nav>

        {/* User bar */}
        <UserBar />

        {/* Search bar */}
        <SearchBar />
      </header>
    </div>
  );
};

const Main: FC<PropsWithChildren> = ({ children }) => {
  // Below is a hack to re-initialize the fade when the page changes
  const router = useRouter();
  const fadeKey = useMemo(() => Math.random().toString() + router.pathname, [router.pathname]);

  return (
    <main className={c('flex-grow', 'container', 'max-w-5xl', 'mx-auto', 'mt-6', 'mb-8', 'px-4')}>
      <FadeIn key={fadeKey}>{children}</FadeIn>
    </main>
  );
};

const Footer: FC = () => {
  return (
    <footer
      className={c(
        'flex',
        'flex-wrap',
        'p-4',
        'gap-3',
        'place-content-center',
        'text-sm',
        'text-neutral-400',
        'font-light'
      )}
    >
      <Link variant="discreet" href={`https://github.com/Tyrrrz/MyFlickList/tree/${getBuildId()}`}>
        <Inline>
          <RxCommit />
          <div className={c('font-mono')}>{getBuildId()}</div>
        </Inline>
      </Link>

      <div>&bull;</div>

      <Link variant="discreet" href="https://twitter.com/Tyrrrz">
        <Inline>
          <RxTwitterLogo />
          <div>Twitter</div>
        </Inline>
      </Link>

      <div>&bull;</div>

      <Link variant="discreet" href="https://tyrrrz.me/donate">
        <Inline>
          <RxHeart />
          <div>Donate</div>
        </Inline>
      </Link>
    </footer>
  );
};

type LayoutProps = PropsWithChildren;

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className={c('flex', 'flex-col', 'min-h-screen', 'bg-neutral-50')}>
      <Meta />
      <Analytics />

      <Loader />

      <Header />
      <Main>{children}</Main>
      <Footer />
    </div>
  );
};

export default Layout;
