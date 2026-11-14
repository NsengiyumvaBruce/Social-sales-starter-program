import React, { useState } from 'react';
import { FileDown, FileText, ImageDown } from 'lucide-react';
import { LESSONS } from '../data/courseData';
import type { LessonId } from '../types/course';
import {
  downloadSummaryPdf,
  downloadSummaryPng,
  downloadSummaryTxt,
  isCourseComplete,
} from '../utils/summaryExport';

interface ProgressSummarySectionProps {
  nameInputRef: React.RefObject<HTMLInputElement | null>;
  done: LessonId[];
  tickedCount: number;
  totalChecklists: number;
  notes: Record<string, string>;
  learnerName: string;
  onLearnerNameChange: (val: string) => void;
  finishDate: string;
  onFinishDateChange: (val: string) => void;
}

export const ProgressSummarySection: React.FC<ProgressSummarySectionProps> = ({
  nameInputRef,
  done,
  tickedCount,
  totalChecklists,
  notes,
  learnerName,
  onLearnerNameChange,
  finishDate,
  onFinishDateChange,
}) => {
  const [statusText, setStatusText] = useState<string>('');
  const completedCount = LESSONS.filter((l) => done.includes(l.id)).length;
  const complete = isCourseComplete(done);

  const validateName = (): boolean => {
    if (!learnerName.trim()) {
      setStatusText('Enter your name first.');
      nameInputRef.current?.focus();
      return false;
    }
    return true;
  };

  const handleSavePdf = () => {
    if (!validateName()) return;
    const ok = downloadSummaryPdf({
      learnerName: learnerName.trim(),
      date: finishDate,
      done,
      tickedCount,
      totalChecklists,
      notes,
    });
    setStatusText(
      ok
        ? 'Your PDF summary (social-sales-starter-summary.pdf) has been downloaded.'
        : 'Your browser could not create the PDF. Try downloading as a picture (PNG) or text.'
    );
  };

  const handlePng = async () => {
    if (!validateName()) return;
    const ok = await downloadSummaryPng({
      learnerName: learnerName.trim(),
      date: finishDate,
      done,
      tickedCount,
      totalChecklists,
      notes,
    });
    setStatusText(
      ok
        ? 'Your picture (social-sales-starter-summary.png) has been downloaded.'
        : 'Your browser could not create the picture. Try "Save as PDF" instead.'
    );
  };

  const handleTxt = () => {
    if (!validateName()) return;
    downloadSummaryTxt({
      learnerName: learnerName.trim(),
      date: finishDate,
      done,
      tickedCount,
      totalChecklists,
      notes,
    });
    setStatusText('Your text file (social-sales-starter-summary.txt) has been downloaded.');
  };

  return (
    <section
      id="summarySection"
      aria-labelledby="completion-title"
      className="no-print mt-8 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8"
    >
      <h2
        id="completion-title"
        className="font-display text-2xl font-extrabold tracking-tight text-[var(--ink)]"
      >
        Your progress summary
      </h2>
      <p className="mt-2 max-w-[66ch] text-sm sm:text-base text-[var(--ink)] leading-relaxed">
        Create a personal summary of your progress and notes. Save it as a PDF, download it as a
        picture or download it as text. When all 8 sections are complete it becomes a completion
        summary. It is a record of your own self-study, not an accredited certificate or proof of
        independently assessed skills.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 max-w-xl">
        <label className="grid gap-1.5 text-xs font-semibold text-[var(--ink)]">
          <span>Your name</span>
          <input
            ref={nameInputRef}
            id="learnerName"
            type="text"
            maxLength={80}
            value={learnerName}
            onChange={(e) => onLearnerNameChange(e.target.value)}
            placeholder="Enter your name"
            className="rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3.5 py-2.5 text-sm font-normal text-[var(--ink)] min-h-[44px]"
          />
        </label>

        <label className="grid gap-1.5 text-xs font-semibold text-[var(--ink)]">
          <span>Date</span>
          <input
            id="finishDate"
            type="date"
            value={finishDate}
            onChange={(e) => onFinishDateChange(e.target.value)}
            className="font-mono-num rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3.5 py-2.5 text-sm font-normal text-[var(--ink)] min-h-[44px]"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={handleSavePdf}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-ink)] hover:bg-[var(--accent-hover)] transition-colors whitespace-nowrap min-h-[44px]"
        >
          <FileDown className="h-4 w-4" aria-hidden="true" />
          Save as PDF
        </button>

        <button
          type="button"
          onClick={handlePng}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-sm font-semibold text-[var(--ink)] hover:border-[var(--ink)] transition-colors whitespace-nowrap min-h-[44px]"
        >
          <ImageDown className="h-4 w-4" aria-hidden="true" />
          Download as picture (PNG)
        </button>

        <button
          type="button"
          onClick={handleTxt}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-sm font-semibold text-[var(--ink)] hover:border-[var(--ink)] transition-colors whitespace-nowrap min-h-[44px]"
        >
          <FileText className="h-4 w-4" aria-hidden="true" />
          Download as text
        </button>
      </div>

      <p className="mt-3 text-xs text-[var(--muted)]" role="status" aria-live="polite">
        {statusText ||
          (complete
            ? 'All sections are complete. Your summary will be a completion summary.'
            : `${completedCount} of ${LESSONS.length} sections complete. Your summary will show your progress so far.`)}
      </p>
    </section>
  );
};
