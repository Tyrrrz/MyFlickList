import React from 'react';
import { FlickListingResponse } from '../../../infra/api.generated';
import { FlickHelper } from '../../../infra/helpers';
import Link from '../../../shared/Link';
import { routes } from '../../PageRouter';

interface FlickRowProps {
  flick: FlickListingResponse;
  position: number;
}

function FlickRow({ flick, position }: FlickRowProps) {
  const flickHelper = new FlickHelper(flick);

  return (
    <tr>
      <td className="h1 font-weight-bold text-center text-muted align-middle">{position}</td>
      <td>
        <div className="d-flex m-0 p-0 flex-row">
          <img
            className="mr-3"
            style={{ width: '4rem' }}
            alt={flick.title}
            src={flickHelper.getImageUrl()}
          />
          <div>
            <div>
              <Link className="font-weight-bold text-truncate" href={routes.catalogFlick(flick.id)}>
                {flick.title}
              </Link>
            </div>
            <div>{flickHelper.formatKind()}</div>
            <div>{flickHelper.formatDate()}</div>
            <div>
              {flick.tags?.slice(0, 5).map((t) => (
                <Link
                  key={t}
                  className="badge badge-pill badge-secondary mr-1"
                  href={`/catalog/tags/${encodeURIComponent(t)}`}
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </td>
      <td className="h5 text-center text-muted align-middle">{flickHelper.formatRating()}</td>
      <td className="h5 text-center text-muted align-middle">N/A</td>
      <td className="h5 text-center text-muted align-middle">N/A</td>
    </tr>
  );
}

interface FlickTableProps {
  flicks: FlickListingResponse[];
  startingPosition: number;
}

export default function FlickTable({ flicks, startingPosition }: FlickTableProps) {
  return (
    <table className="table table-striped table-borderless">
      <colgroup>
        <col className="w-auto" />
        <col />
        <col className="w-auto" />
        <col className="w-auto" />
        <col className="w-auto" />
      </colgroup>

      <thead>
        <tr>
          <th className="text-center">#</th>
          <th>Flick</th>
          <th className="text-center">Avg. Rating</th>
          <th className="text-center">Your Rating</th>
          <th className="text-center">Listing</th>
        </tr>
      </thead>

      <tbody>
        {flicks.map((flick, i) => (
          <FlickRow key={flick.id} flick={flick} position={startingPosition + i} />
        ))}
      </tbody>
    </table>
  );
}
