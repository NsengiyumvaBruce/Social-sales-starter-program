import React from 'react';
import { Check, FileText } from 'lucide-react';
import { LESSONS } from '../data/courseData';
import type { LessonId } from '../types/course';

interface LessonSidebarProps {
  activeId: LessonId;
  done: LessonId[];
  notes: Record<string, string>;
  onSelectLesson: (id: LessonId) => void;
}

export const LessonSidebar: React.FC<LessonSidebarProps> = ({
  activeId,
  done,
  notes,
  onSelectLesson,
}) => {
  return (
    <nav
      id="curriculum"
      aria-label="Course lessons"
      className="no-print lg:sticky lg:top-20"
    >
      <div className="mb-2 hidden lg:block px-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
        Course syllabus
      </div>

      {/* Horizontal scrolling strip on mobile/tablet, vertical list on desktop */}
      <ol className="flex gap-2 overflow-x-auto pb-2 lg:grid lg:gap-1 lg:overflow-visible lg:pb-0">
        {LESSONS.map((lesson) => {
          const isActive = lesson.id === activeId;
          const isDone = done.includes(lesson.id);
          const hasNotes = (notes[lesson.id] || '').trim().length > 0;

          return (
            <li key={lesson.id} className="shrink-0 lg:shrink">
              <a
                href={`#${lesson.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectLesson(lesson.id);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`group flex items-start gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors no-underline min-h-[44px] border ${
                  isActive
                    ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]'
                    : isDone
                    ? 'border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--ink)]'
                    : 'border-transparent bg-[var(--surface)] lg:bg-transparent text-[var(--ink)] hover:bg-[var(--surface)] hover:border-[var(--line)]'
                }`}
              >
                <span
                  className={`font-display mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-extrabold tabular-nums ${
                    isActive
                      ? 'bg-[var(--bg)] text-[var(--ink)]'
                      : isDone
                      ? 'bg-[var(--leaf-soft)] text-[var(--leaf)]'
                      : 'bg-[var(--surface-alt)] text-[var(--muted)]'
                  }`}
                >
                  {isDone ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : lesson.number}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block font-semibold leading-snug whitespace-nowrap lg:whitespace-normal">
                    {lesson.shortTitle}
                  </span>
                  <span
                    className={`hidden lg:flex items-center gap-1.5 text-xs mt-0.5 ${
                      isActive ? 'text-[var(--bg)]/80' : 'text-[var(--muted)]'
                    }`}
                  >
                    <span>{lesson.duration}</span>
                    {isDone && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className={isActive ? 'text-[var(--bg)]' : 'text-[var(--leaf)] font-medium'}>
                          Done
                        </span>
                      </>
                    )}
                    {hasNotes && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-0.5" title="Has saved notes">
                          <FileText className="h-3 w-3" aria-hidden="true" />
                          <span>Notes</span>
                        </span>
                      </>
                    )}
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
