import React from 'react';
import Link from '../../shared/Link';
import Meta from '../../shared/Meta';

export default function DonatePage() {
  return (
    <div>
      <Meta title="Feedback" />

      <div className="w-3/4 mx-auto space-y-5">
        <h1>Feedback</h1>

        <p>
          If you found a <i>bug</i> or have a <i>feature</i> suggestion, you can submit it in a form
          of a GitHub issue. As MyFlickList is completely open source, GitHub is used as the primary
          tool for project management and collaboration.
        </p>
        <p>
          If you just have a <i>question</i> or are unsure about something, the best place to ask is
          on the official Discord server. Please avoid creating new issues for questions.
        </p>

        <hr className="w-3/4 mx-auto" />

        <div className="grid grid-cols-2 gap-4">
          {/* Bugs & features */}
          <div className="text-xl font-light">Bugs &amp; features</div>

          <div>
            <div>
              <Link href="https://github.com/Tyrrrz/MyFlickList/issues" target="_blank">
                GitHub Issues
              </Link>
            </div>

            <p className="text-sm italic">You will need a GitHub account to create new issues</p>
          </div>

          {/* Questions */}
          <div className="text-xl font-light">Questions</div>

          <div>
            <div>
              <Link href="https://discord.gg/hgVa7qS" target="_blank">
                Discord Server
              </Link>
            </div>

            <p className="text-sm italic">You will need a Discord account to join</p>
          </div>
        </div>
      </div>
    </div>
  );
}
