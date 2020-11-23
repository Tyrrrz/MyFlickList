import React from 'react';
import Link from '../../components/Link';
import Page from '../../components/Page';
import Section from '../../components/Section';
import Separator from '../../components/Separator';

export default function CreditsPage() {
  return (
    <Page title="Credits">
      <Section title="Credits">
        <p>
          This page lists all external assets used by MyFlickList that require formal attribution,
          along with their corresponding licenses.
        </p>

        <Separator />

        {/* Graphics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-xl font-light">Graphics</div>

          <div>
            <ul>
              <li>
                <Link href="https://feathericons.com">Feather Icons</Link> (MIT License)
              </li>
              <li>
                <Link href="https://flaticon.com/free-icon/tv-monitor_2916372">
                  TV Monitor icon by surang
                </Link>{' '}
                (Flaticon License)
              </li>
            </ul>
          </div>
        </div>
      </Section>
    </Page>
  );
}
