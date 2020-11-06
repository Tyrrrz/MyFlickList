import classnames from 'classnames';
import React from 'react';
import Link from './Link';

function getAvailablePages(currentPage: number, lastPage: number) {
  // The intent is to show first page, last page, current page, and a few pages around current.
  // If some of these overlap, then duplicates are filtered out (e.g. for page 2/10, only [1, 2, 3, 4, 10] are shown).

  const candidates = [
    1,
    currentPage - 2,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage + 2,
    lastPage
  ].filter((p) => p >= 1 && p <= lastPage);

  return [...new Set(candidates)];
}

interface PageButtonProps {
  href: string;
  isActive?: boolean;
  children: React.ReactNode;
}

function PageButton({ href, isActive, children }: PageButtonProps) {
  if (isActive) {
    return (
      <Link
        className={classnames(
          'px-4',
          'py-1',
          'border',
          'rounded',
          'border-gray-300',
          'bg-gray-200'
        )}
        href={href}
        underline={false}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link
      className={classnames(
        'px-4',
        'py-1',
        'font-light',
        'border',
        'rounded',
        'border-gray-300',
        'hover:bg-gray-300'
      )}
      href={href}
      underline={false}
      onClick={() => window.scrollTo(0, 0)}
    >
      {children}
    </Link>
  );
}

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  getPageHref: (p: number) => string;
}

export default function Pagination({ currentPage, lastPage, getPageHref }: PaginationProps) {
  const pages = getAvailablePages(currentPage, lastPage);

  // Populate page buttons
  const pageButtons = [] as JSX.Element[];
  for (let i = 0; i < pages.length; i++) {
    const prevPage = pages[i - 1];
    const page = pages[i];

    // If there was a jump from previous page, insert ellipsis
    if (prevPage && prevPage !== page - 1) {
      pageButtons.push(
        <PageButton key={prevPage + 1} href={getPageHref(prevPage + 1)}>
          …
        </PageButton>
      );
    }

    pageButtons.push(
      <PageButton key={page} isActive={page === currentPage} href={getPageHref(page)}>
        {page}
      </PageButton>
    );
  }

  return (
    <nav className={classnames('mt-3', 'flex', 'justify-center', 'space-x-1', 'text-xl')}>
      {pageButtons}
    </nav>
  );
}
