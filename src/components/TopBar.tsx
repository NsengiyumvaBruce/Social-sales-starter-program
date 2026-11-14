import React from 'react';

interface TopBarProps {
  onJumpToSummary: () => void;
  onJumpToCurriculum: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onJumpToSummary, onJumpToCurriculum }) => {
  return (
    <header className="no-print sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--bg)]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1160px] items-center justify-between gap-8 px-4 py-3 sm:px-6">
        <a
          href="#start"
          onClick={(e) => {
            e.preventDefault();
            onJumpToCurriculum();
          }}
          className="font-display text-lg font-extrabold tracking-tight text-[var(--ink)] whitespace-nowrap shrink-0 no-underline"
        >
          Social Sales Starter
        </a>

        <nav
          aria-label="Page sections"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--muted)]"
        >
          <a
            href="#curriculum"
            onClick={(e) => {
              e.preventDefault();
              onJumpToCurriculum();
            }}
            className="hover:text-[var(--ink)] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 no-underline"
          >
            Curriculum
          </a>
          <a
            href="#summarySection"
            onClick={(e) => {
              e.preventDefault();
              onJumpToSummary();
            }}
            className="hover:text-[var(--ink)] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 no-underline"
          >
            Progress Summary
          </a>
          <a
            href="#feedback"
            className="hover:text-[var(--ink)] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 no-underline"
          >
            Feedback
          </a>
          <a
            href="#sources"
            className="hover:text-[var(--ink)] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 no-underline"
          >
            Sources
          </a>
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onJumpToSummary}
            className="cursor-pointer rounded-lg bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-[var(--accent-ink)] transition-colors hover:bg-[var(--accent-hover)] whitespace-nowrap shrink-0 min-h-[40px]"
          >
            Export Summary
          </button>
        </div>
      </div>
    </header>
  );
};
