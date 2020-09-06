import React from 'react';
import { FiStar } from 'react-icons/fi';
import { FlickListingResponse } from '../../../infra/api.generated';
import { FlickHelper } from '../../../infra/helpers';
import { slugify } from '../../../infra/utils';
import Link from '../../../shared/Link';
import { routes } from '../../Routing';

interface FlickRowProps {
  flick: FlickListingResponse;
  position: number;
}

function FlickRow({ flick, position }: FlickRowProps) {
  const flickHelper = new FlickHelper(flick);

  return (
    <tr>
      <td className="px-6 py-2 text-center text-4xl font-bold text-gray-600">{position}</td>
      <td className="py-2">
        <div className="flex flex-row space-x-3">
          <img alt={flick.title} src={flickHelper.getCoverImageUrl()} width={100} />

          <div>
            <div>
              <Link
                className="font-bold text-truncate"
                href={routes.flick.href({ flickId: flick.id, flickTitle: slugify(flick.title) })}
              >
                {flick.title}
              </Link>
            </div>

            <div>{flickHelper.formatKind()}</div>
            <div>{flickHelper.formatDate()}</div>

            <div className="mt-3 space-x-2">
              {flick.tags?.slice(0, 3).map((t) => (
                <Link
                  key={t}
                  className="inline-block px-3 py-1 rounded-full bg-gray-200 text-sm"
                  href={routes.flicks.href({ filterTag: t })}
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </td>
      <td className="py-2 flex flex-row items-center text-center text-2xl font-semibold text-gray-700">
        <FiStar /> <span className="ml-1">{flickHelper.formatRating()}</span>
      </td>
    </tr>
  );
}

interface FlickTableProps {
  flicks: FlickListingResponse[];
  startingPosition: number;
}

export default function FlickTable({ flicks, startingPosition }: FlickTableProps) {
  return (
    <table className="w-full">
      <colgroup>
        <col className="w-auto mw-12" />
        <col />
        <col className="w-auto" />
      </colgroup>

      <tbody>
        {flicks.map((flick, i) => (
          <FlickRow key={flick.id} flick={flick} position={startingPosition + i} />
        ))}
      </tbody>
    </table>
  );
}
