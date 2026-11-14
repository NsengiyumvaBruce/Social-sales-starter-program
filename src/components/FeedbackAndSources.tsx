import React, { useState } from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { COURSE_AUTHOR, SOURCES } from '../data/courseData';
import { copyToClipboard } from '../utils/clipboard';

export const FeedbackAndSources: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = async () => {
    const ok = await copyToClipboard(COURSE_AUTHOR.email);
    if (ok) {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 1800);
    }
  };

  return (
    <>
      <section
        id="feedback"
        aria-labelledby="fbh"
        className="no-print mt-8 rounded-2xl bg-[var(--ink)] p-6 text-[var(--bg)] sm:p-8"
      >
        <h2 id="fbh" className="font-display text-2xl font-extrabold tracking-tight">
          Tell me how this course helped
        </h2>
        <p className="mt-2 max-w-[60ch] text-sm sm:text-base opacity-90">
          What did you learn? What did you try? What is missing? Copy my email address or message me
          on LinkedIn. Your answers decide what I add next.
        </p>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={handleCopyEmail}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[var(--bg)] px-4 py-2.5 text-sm font-semibold text-[var(--ink)] hover:opacity-90 transition-opacity whitespace-nowrap min-h-[44px]"
          >
            {copiedEmail ? (
              <Check className="h-4 w-4 text-[var(--leaf)]" aria-hidden="true" />
            ) : (
              <Copy className="h-4 w-4" aria-hidden="true" />
            )}
            <span>{copiedEmail ? 'Copied email address' : 'Copy email address'}</span>
          </button>

          <a
            href={COURSE_AUTHOR.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--bg)]/40 bg-transparent px-4 py-2.5 text-sm font-semibold text-[var(--bg)] hover:bg-[var(--bg)]/10 transition-colors no-underline whitespace-nowrap min-h-[44px]"
          >
            <span>Message me on LinkedIn</span>
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <p className="mt-4 text-xs opacity-80">
          Email address: <span className="font-mono-num">{COURSE_AUTHOR.email}</span>
        </p>
      </section>

      <footer id="sources" className="no-print mt-8 border-t border-[var(--line)] pt-6 pb-8">
        <h2 className="font-display text-base font-bold text-[var(--ink)]">Sources</h2>
        <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
          {SOURCES.map((src) => (
            <li key={src.url}>
              <a
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--accent)] hover:underline underline-offset-4"
              >
                {src.title}
              </a>{' '}
              <span>({src.detail})</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-xs text-[var(--muted)]">
          {COURSE_AUTHOR.name} · {COURSE_AUTHOR.company} · {COURSE_AUTHOR.affiliation}
        </p>
      </footer>
    </>
  );
};
