import { Analytics } from '@vercel/analytics/react';
import c from 'classnames';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FC, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import FadeIn from 'react-fade-in';
import { FiMenu } from 'react-icons/fi';
import { RxPerson } from 'react-icons/rx';
import Inline from '~/components/inline';
import Link from '~/components/link';
import Meta from '~/components/meta';
import useDebounce from '~/hooks/useDebounce';
import useRouterStatus from '~/hooks/useRouterStatus';
import useSession from '~/hooks/useSession';

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
      <Inline>
        <RxPerson />
        <div>{data.user.name}</div> (
        <Link button onClick={() => signOut()}>
          Sign out
        </Link>
        )
      </Inline>
    );
  }

  return (
    <Inline>
      <RxPerson />
      <Link button onClick={() => signIn()}>
        <div>Sign in</div>
      </Link>
    </Inline>
  );
};

type NavLinkProps = PropsWithChildren<{
  href: string;
}>;

const NavLink: FC<NavLinkProps> = ({ href, children }) => {
  const router = useRouter();
  const isActive = router.route === href || router.route.startsWith(href + '/');

  return (
    <div
      className={c(
        'px-2',
        'py-1',
        'rounded',
        'border-2',
        {
          'border-transparent': !isActive,
          'border-blue-500': isActive
        },
        {
          'bg-blue-100': isActive
        },
        'transition-colors',
        'duration-300'
      )}
    >
      <Link variant="discreet" href={href}>
        {children}
      </Link>
    </div>
  );
};

const Header: FC = () => {
  const links = [
    { href: '/', label: 'home' },
    { href: '/flicks', label: 'flicks' }
  ];

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  return (
    <header>
      <div
        className={c(
          'flex',
          'mx-auto',
          'p-4',
          'border-b-2',
          'border-neutral-100',
          'items-center',
          'justify-between'
        )}
      >
        {/* Logo */}
        <div className={c('my-1', 'text-xl', 'font-semibold', 'tracking-wide')}>
          <Link variant="hidden" href="/">
            MyFlickList
          </Link>
        </div>

        {/* Full nav */}
        <nav className={c('hidden', 'sm:flex', 'px-2', 'gap-x-2', 'text-lg')}>
          {links.map((link, i) => (
            <NavLink key={i} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* User bar */}
        <UserBar />

        {/* Mobile nav button */}
        <button
          className={c('sm:hidden', 'text-2xl', { 'text-blue-500': isMenuVisible })}
          onClick={() => setIsMenuVisible((v) => !v)}
        >
          <FiMenu />
        </button>
      </div>

      {/* Mobile nav */}
      <div className={c('sm:hidden', 'overflow-hidden')}>
        <nav
          className={c(
            { '-mt-[100%]': !isMenuVisible },
            'p-2',
            'border-b-2',
            'border-neutral-100',
            'space-y-1',
            'text-lg',
            'transition-all',
            'duration-300'
          )}
        >
          {links.map((link, i) => (
            <NavLink key={i} href={link.href}>
              <div>{link.label}</div>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

const Main: FC<PropsWithChildren> = ({ children }) => {
  // Below is a hack to re-initialize the fade when the page changes
  const router = useRouter();
  const fadeKey = useMemo(() => Math.random().toString() + router.pathname, [router.pathname]);

  return (
    <main className={c('mx-4', 'mt-6', 'mb-20')}>
      <FadeIn key={fadeKey}>{children}</FadeIn>
    </main>
  );
};

type LayoutProps = PropsWithChildren;

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Meta />
      <Analytics />

      <Loader />

      <div className={c('container', 'max-w-4xl', 'mx-auto')}>
        <Header />
        <Main>{children}</Main>
      </div>
    </>
  );
};

export default Layout;
