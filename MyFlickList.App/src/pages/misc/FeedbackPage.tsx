import React from 'react';
import Card from '../../components/Card';
import HorizontalSeparator from '../../components/HorizontalSeparator';
import Link from '../../components/Link';
import Page from '../../components/Page';

export default function DonatePage() {
  return (
    <Page title="Feedback">
      <Card>
        <p>
          If you found a <i>bug</i> or have a <i>feature</i> suggestion, you can submit it in a form
          of a GitHub issue. As MyFlickList is completely open source, GitHub is used as the primary
          tool for project management and collaboration.
        </p>
        <p>
          If you just have a <i>question</i> or are unsure about something, the best place to ask is
          on the official Discord server. Please avoid creating new issues for questions.
        </p>

        <HorizontalSeparator />

        <div className="grid grid-cols-2 gap-4">
          {/* Bugs & features */}
          <div className="text-xl font-light">Bugs &amp; features</div>

          <div>
            <div>
              <Link href="https://github.com/Tyrrrz/MyFlickList/issues">GitHub Issues</Link>
            </div>

            <p className="text-sm italic">You will need a GitHub account to create new issues</p>
          </div>

          {/* Questions */}
          <div className="text-xl font-light">Questions</div>

          <div>
            <div>
              <Link href="https://discord.gg/hgVa7qS">Discord Server</Link>
            </div>

            <p className="text-sm italic">You will need a Discord account to join</p>
          </div>
        </div>
      </Card>
    </Page>
  );
}
