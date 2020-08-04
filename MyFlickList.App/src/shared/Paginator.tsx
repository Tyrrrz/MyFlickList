import React from 'react';
import Link from './Link';

function getAvailablePageNumbers(currentPage: number, lastPage: number) {
  // The intent is to show first page, last page, current page, and a few pages around current.
  // If some of these overlap, then duplicates are avoided (e.g. for page 2/10, only [1, 2, 3, 4, 10] is shown).

  const candidates = [1, currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2, lastPage]
    .filter((p) => p >= 1 && p <= lastPage)
    .sort((x, y) => x - y);

  return [...new Set(candidates)];
}

interface PageButtonProps {
  href: string;
  active?: boolean | undefined;
  children: React.ReactNode;
}

function PageButton({ href, active, children }: PageButtonProps) {
  return (
    <li className={`page-item ${active && 'active'}`}>
      {!active ? (
        <Link className="page-link" href={href}>
          {children}
        </Link>
      ) : (
        <span className="page-link">{children}</span>
      )}
    </li>
  );
}

interface PaginatorProps {
  currentPage: number;
  lastPage: number;
  getPageHref: (p: number) => string;
}

export default function Paginator({ currentPage, lastPage, getPageHref }: PaginatorProps) {
  const pages = getAvailablePageNumbers(currentPage, lastPage);

  const pageButtons = [];
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
      <PageButton key={page} active={page === currentPage} href={getPageHref(page)}>
        {page}
      </PageButton>
    );
  }

  return (
    <nav aria-label="Page navigation" className="">
      <ul className="pagination justify-content-center">{pageButtons}</ul>
    </nav>
  );
}
