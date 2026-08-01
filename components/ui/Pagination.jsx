'use client';

// components/ui/Pagination.jsx
//
// Shared, responsive pagination control. Matches the current design system
// (ring-based borders, bg-card/bg-secondary tokens, rounded-xl) used across
// Matches/Jobs/Profile.
//
// Responsive behavior: full numbered page buttons with smart ellipsis on
// sm+ screens; collapses to a compact "3 / 12" indicator plus Prev/Next
// only on narrow screens, so it never wraps awkwardly or overflows a phone
// width.

import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, lastPage, onPageChange, className = '' }) {
  if (!lastPage || lastPage <= 1) return null;

  const pages = getPageList(currentPage, lastPage);

  function go(page) {
    if (page < 1 || page > lastPage || page === currentPage) return;
    onPageChange(page);
  }

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={`flex items-center justify-between gap-3 ${className}`}
    >
      <button
        type="button"
        onClick={() => go(currentPage - 1)}
        disabled={currentPage <= 1}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-card px-3.5 py-2.5 text-[13.5px] font-medium text-foreground ring-1 ring-black/5 transition-colors hover:text-secondary hover:ring-secondary/50 disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Numbered pages -- sm and up */}
      <div className="hidden items-center gap-1.5 sm:flex">
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-1.5 text-[13px] text-slate-soft">
              &hellip;
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => go(p)}
              aria-current={p === currentPage ? 'page' : undefined}
              className={`min-w-[38px] rounded-xl px-3 py-2 text-[13.5px] font-medium transition-colors duration-150 ${
                p === currentPage
                  ? 'bg-secondary text-white ring-1 ring-secondary/5'
                  : 'bg-card text-foreground ring-1 ring-black/5 hover:text-secondary hover:ring-secondary/50'
              }`}
            >
              {p}
            </button>
          )
        )}
      </div>

      {/* Compact indicator -- below sm only */}
      <span className="font-mono text-[13px] tabular-nums text-slate sm:hidden">
        Page {currentPage} of {lastPage}
      </span>

      <button
        type="button"
        onClick={() => go(currentPage + 1)}
        disabled={currentPage >= lastPage}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-card px-3.5 py-2.5 text-[13.5px] font-medium text-foreground ring-1 ring-black/5 transition-colors hover:text-secondary hover:ring-secondary/50 disabled:pointer-events-none disabled:opacity-40"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

// Standard "1 ... 4 5 [6] 7 8 ... 20" range builder, with one sibling on
// each side of the current page. Falls back to showing every page when the
// total is small enough that ellipsis would save nothing.
function getPageList(current, last, siblings = 1) {
  const totalVisible = siblings * 2 + 5; // first + last + current + 2 siblings + wiggle room

  if (last <= totalVisible) {
    return range(1, last);
  }

  const leftSibling = Math.max(current - siblings, 1);
  const rightSibling = Math.min(current + siblings, last);

  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < last - 1;

  if (!showLeftDots && showRightDots) {
    const leftItemCount = 3 + siblings * 2;
    return [...range(1, leftItemCount), '...', last];
  }

  if (showLeftDots && !showRightDots) {
    const rightItemCount = 3 + siblings * 2;
    return [1, '...', ...range(last - rightItemCount + 1, last)];
  }

  if (showLeftDots && showRightDots) {
    return [1, '...', ...range(leftSibling, rightSibling), '...', last];
  }

  return range(1, last);
}

function range(start, end) {
  const length = end - start + 1;
  return Array.from({ length }, (_, i) => start + i);
}