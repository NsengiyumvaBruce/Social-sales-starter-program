import React, { useRef, useState } from 'react';
import { ArrowRight, Download, Moon, RotateCcw, Sun, Upload } from 'lucide-react';
import { COURSE_AUTHOR, LESSONS, QUIZZES } from '../data/courseData';
import { COURSE_IMAGES } from '../data/courseImages';
import type { LessonId } from '../types/course';
import { EditorialMedia } from './EditorialMedia';

interface CourseHeroProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  done: LessonId[];
  tickedCount: number;
  totalChecklists: number;
  quizzes: Record<string, number>;
  onSelectLesson: (id: LessonId) => void;
  onJumpToCurriculum: () => void;
  onExportBackup: () => void;
  onImportBackup: (raw: string) => { ok: boolean; message: string };
  onResetAll: () => void;
}

const LESSON_MINUTES: Record<LessonId, number> = {
  start: 3,
  'lesson-1': 10,
  'lesson-2': 10,
  'lesson-3': 12,
  'lesson-4': 12,
  'lesson-5': 12,
  'lesson-6': 10,
  'lesson-7': 8,
};

export const CourseHero: React.FC<CourseHeroProps> = ({
  theme,
  onToggleTheme,
  done,
  tickedCount,
  totalChecklists,
  quizzes,
  onSelectLesson,
  onJumpToCurriculum,
  onExportBackup,
  onImportBackup,
  onResetAll,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const completedCount = LESSONS.filter((l) => done.includes(l.id)).length;
  const totalSections = LESSONS.length;
  const percent = Math.round((completedCount / totalSections) * 100);

  const remainingMinutes = LESSONS.filter((l) => !done.includes(l.id)).reduce(
    (sum, l) => sum + LESSON_MINUTES[l.id],
    0
  );

  const nextIncomplete = LESSONS.find((l) => !done.includes(l.id)) || LESSONS[0];

  const quizKeys = Object.keys(QUIZZES) as LessonId[];
  const correctQuizzes = quizKeys.filter((id) => {
    const selectedIdx = quizzes[id];
    const q = QUIZZES[id];
    return selectedIdx !== undefined && q?.options[selectedIdx]?.isCorrect;
  }).length;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = onImportBackup(String(reader.result || ''));
      setStatusMessage(result.message);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <section className="no-print border-b border-[var(--line)] pb-8 pt-8">
      {/* 2-Column Editorial Hero Split */}
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] items-stretch">
        <div className="flex flex-col justify-between gap-6">
          <div className="space-y-3.5">
            <p className="text-xs font-semibold tracking-wider uppercase text-[var(--muted)]">
              Free self-paced course · 7 practical lessons · About 10 min/day
            </p>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-[var(--ink)] sm:text-5xl">
              Social Sales Starter
            </h1>
            <p className="text-base text-[var(--ink)] sm:text-lg leading-relaxed max-w-[60ch]">
              Go from no plan to a working system for finding customers on social media. Read each
              lesson, listen to it, and build your offer, profile, content calendar, and lead list
              step by step.
            </p>
            <p className="text-sm text-[var(--muted)]">
              By <span className="font-semibold text-[var(--ink)]">{COURSE_AUTHOR.name}</span>,{' '}
              {COURSE_AUTHOR.affiliation}. {COURSE_AUTHOR.company}. {COURSE_AUTHOR.credentials}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                onSelectLesson(nextIncomplete.id);
                onJumpToCurriculum();
              }}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-ink)] hover:bg-[var(--accent-hover)] transition-colors whitespace-nowrap shrink-0 min-h-[44px]"
            >
              <span>
                {completedCount === 0
                  ? 'Start course'
                  : completedCount === totalSections
                  ? 'Review course'
                  : `Continue: ${nextIncomplete.shortTitle}`}
              </span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <a
              href="#curriculum"
              onClick={(e) => {
                e.preventDefault();
                onJumpToCurriculum();
              }}
              className="inline-flex items-center rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm font-semibold text-[var(--ink)] hover:border-[var(--ink)] transition-colors no-underline whitespace-nowrap shrink-0 min-h-[44px]"
            >
              Browse 7 lessons
            </a>
          </div>
        </div>

        <EditorialMedia
          src={COURSE_IMAGES.heroWorkspace}
          alt="Small business owner photographing packaged coffee and woven crafts by a sunlit window in Kigali using a smartphone"
          aspect="16/9"
          overlayCaption="Real products, natural window light, and one phone — everything you need to start selling on social media."
          className="h-full min-h-[240px]"
        />
      </div>

      {/* Full-Width 4-Column Progress & Learning Strip */}
      <div className="mt-6 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Overall progress
          </span>
          <span className="font-mono-num text-xs font-semibold text-[var(--ink)]">
            {completedCount} of {totalSections} sections done ({percent}%)
          </span>
        </div>

        <div
          className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--line)]"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Course completion percentage"
        >
          <div
            className="h-full bg-[var(--leaf)] transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-[var(--line)] pt-4 sm:grid-cols-4">
          <div>
            <div className="font-mono-num text-xl font-bold text-[var(--ink)]">
              {completedCount}/{totalSections}
            </div>
            <div className="text-xs text-[var(--muted)]">Sections completed</div>
          </div>
          <div>
            <div className="font-mono-num text-xl font-bold text-[var(--ink)]">
              {tickedCount}/{totalChecklists}
            </div>
            <div className="text-xs text-[var(--muted)]">Action checklist</div>
          </div>
          <div>
            <div className="font-mono-num text-xl font-bold text-[var(--ink)]">
              {correctQuizzes}/{quizKeys.length}
            </div>
            <div className="text-xs text-[var(--muted)]">Quizzes passed</div>
          </div>
          <div>
            <div className="font-mono-num text-xl font-bold text-[var(--ink)]">
              {remainingMinutes > 0 ? `${remainingMinutes} min` : 'Complete'}
            </div>
            <div className="text-xs text-[var(--muted)]">Remaining study time</div>
          </div>
        </div>
      </div>

      {/* Workspace Utilities Toolbar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-pressed={theme === 'dark'}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--bg)] px-3.5 py-2 text-xs font-semibold text-[var(--ink)] hover:border-[var(--ink)] transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>

          <button
            type="button"
            onClick={() => {
              onExportBackup();
              setStatusMessage('Progress backup downloaded as JSON.');
            }}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--bg)] px-3.5 py-2 text-xs font-semibold text-[var(--ink)] hover:border-[var(--ink)] transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
          >
            <Download className="h-4 w-4" />
            Backup JSON
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--bg)] px-3.5 py-2 text-xs font-semibold text-[var(--ink)] hover:border-[var(--ink)] transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
          >
            <Upload className="h-4 w-4" />
            Restore JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Restore course backup JSON file"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--bg)] px-3.5 py-2 text-xs font-semibold text-[var(--muted)] hover:border-[var(--warn)] hover:text-[var(--warn)] transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset progress
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-[var(--warn)] bg-[var(--warn-soft)] px-3 py-1.5 text-xs">
              <span className="font-semibold text-[var(--ink)]">Clear all saved data?</span>
              <button
                type="button"
                onClick={() => {
                  onResetAll();
                  setConfirmReset(false);
                  setStatusMessage('All progress, checklists, tools, and notes have been reset.');
                }}
                className="cursor-pointer rounded bg-[var(--warn)] px-2.5 py-1 font-semibold text-white whitespace-nowrap"
              >
                Confirm reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="cursor-pointer rounded border border-[var(--line)] bg-[var(--surface)] px-2.5 py-1 font-semibold text-[var(--ink)] whitespace-nowrap"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {statusMessage && (
        <p className="mt-3 text-xs font-medium text-[var(--leaf)]" role="status" aria-live="polite">
          {statusMessage}
        </p>
      )}
    </section>
  );
};
