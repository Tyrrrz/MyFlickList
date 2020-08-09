import React from 'react';
import api from '../../../infra/api';
import { FlickKind, FlickListingResponse } from '../../../infra/api.generated';
import Link from '../../../shared/Link';

function formatKind(flick: FlickListingResponse) {
  return flick.episodeCount && flick.episodeCount > 0 ? `${flick.kind} (${flick.episodeCount} eps)` : flick.kind.toString();
}

function formatDate(flick: FlickListingResponse) {
  if (!flick.premiereDate) return '--';

  if (flick.kind === FlickKind.Movie) return `${flick.premiereDate.getUTCFullYear()}`;

  if (flick.finaleDate) return `${flick.premiereDate.getUTCFullYear()} - ${flick.finaleDate.getUTCFullYear()}`;
  return `${flick.premiereDate.getUTCFullYear()} - ...`;
}

function formatRating(flick: FlickListingResponse) {
  if (!flick.externalRating) return '--';
  return flick.externalRating.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

interface FlickRowProps {
  flick: FlickListingResponse;
  position: number;
}

function FlickRow({ flick, position }: FlickRowProps) {
  const flickUrl = `/catalog/flicks/${flick.id}`;
  const flickImageUrl = (flick.imageId && api.utils.getImageUrl(flick.imageId)) || '/images/poster-placeholder.png';

  return (
    <tr>
      <td className="h1 font-weight-bold text-center text-muted align-middle">{position}</td>
      <td>
        <div className="d-flex m-0 p-0 flex-row">
          <img className="mr-3" style={{ width: '4rem' }} alt={flick.title} src={flickImageUrl} />
          <div>
            <div>
              <Link className="font-weight-bold text-truncate" href={flickUrl}>
                {flick.title}
              </Link>
            </div>
            <div>{formatKind(flick)}</div>
            <div>{formatDate(flick)}</div>
            <div>
              {flick.tags?.slice(0, 5).map((t) => (
                <Link key={t} className="badge badge-pill badge-secondary mr-1" href={`/catalog/tags/${t}`}>
                  {t}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </td>
      <td className="h5 text-center text-muted align-middle">{formatRating(flick)}</td>
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
