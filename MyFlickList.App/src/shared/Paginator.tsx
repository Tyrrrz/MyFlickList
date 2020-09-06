import React from 'react';
import Link from './Link';

function scrollToTop() {
  window.scrollTo(0, 0);
}

function getAvailablePageNumbers(currentPage: number, lastPage: number) {
  // The intent is to show first page, last page, current page, and a few pages around current.
  // If some of these overlap, then duplicates are avoided (e.g. for page 2/10, only [1, 2, 3, 4, 10] are shown).

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
  active?: boolean;
  children: React.ReactNode;
}

function PageButton({ href, active, children }: PageButtonProps) {
  if (active) {
    return <Link href="#">{children}</Link>;
  }

  return (
    <Link href={href} onClick={() => scrollToTop()}>
      {children}
    </Link>
  );
}

interface PaginatorProps {
  currentPage: number;
  lastPage: number;
  getPageHref: (p: number) => string;
}

export default function Paginator({ currentPage, lastPage, getPageHref }: PaginatorProps) {
  const pages = getAvailablePageNumbers(currentPage, lastPage);

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
      <PageButton key={page} active={page === currentPage} href={getPageHref(page)}>
        {page}
      </PageButton>
    );
  }

  return <nav className="m-3 flex flex-row justify-center space-x-3 text-2xl">{pageButtons}</nav>;
}
