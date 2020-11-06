import classnames from 'classnames';
import React from 'react';
import { useLocation } from 'react-router';
import dinoDizzyAsset from '../assets/dino-dizzy.png';
import Alert from '../components/Alert';
import Link from '../components/Link';
import Page from '../components/Page';
import routes from '../routes';

export default function NotFoundPage() {
  const location = useLocation();

  return (
    <Page title="Not Found">
      <Alert type="error" title="Requested page does not exist" sub={`Path: ${location.pathname}`}>
        <div className={classnames('flex')}>
          <Link className={classnames('flex-grow')} href={routes.home()}>
            Go home
          </Link>

          <img className={classnames('opacity-25')} src={dinoDizzyAsset} width={100} height={100} />
        </div>
      </Alert>
    </Page>
  );
}
