import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import type { LessonId } from '../types/course';
import { copyToClipboard } from '../utils/clipboard';

interface LessonNotesProps {
  lessonId: LessonId;
  value: string;
  onChange: (value: string) => void;
}

export const LessonNotes: React.FC<LessonNotesProps> = ({ lessonId, value, onChange }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value.trim()) return;
    const ok = await copyToClipboard(value);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <section
      className="no-print my-7 rounded-xl border border-[var(--line)] bg-[var(--bg)] p-5"
      aria-label="Personal lesson notes"
    >
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={`notes-${lessonId}`} className="font-semibold text-[var(--ink)]">
          My notes for this lesson
        </label>
        <span className="font-mono-num text-xs text-[var(--muted)]">
          {value.length} chars
        </span>
      </div>

      <textarea
        id={`notes-${lessonId}`}
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your ideas, questions, or customer details here. Notes save automatically in this browser."
        className="mt-2.5 w-full resize-y rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3 text-sm text-[var(--ink)] placeholder:text-[var(--muted)]/70 min-h-[104px]"
      />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-[var(--muted)]" role="status">
          {value.trim() ? 'Saved automatically on this device.' : 'Saved on this device when you type.'}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!value.trim()}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2 text-xs font-semibold text-[var(--ink)] hover:border-[var(--ink)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap min-h-[38px]"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-[var(--leaf)]" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied notes' : 'Copy notes'}
        </button>
      </div>
    </section>
  );
};
