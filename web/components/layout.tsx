import { signIn, signOut } from 'next-auth/react';
import { FC, PropsWithChildren } from 'react';
import useSession from '~/hooks/useSession';

const UserPanel: FC = () => {
  const { data } = useSession();

  if (data) {
    return (
      <div>
        {data.user.name} ({data.user.id}) <button onClick={() => signOut()}>Sign Out</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => signIn()}>Sign In</button>
    </div>
  );
};

type LayoutProps = PropsWithChildren;

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <div>
        <UserPanel />
      </div>
      <div>{children}</div>
    </>
  );
};

export default Layout;
