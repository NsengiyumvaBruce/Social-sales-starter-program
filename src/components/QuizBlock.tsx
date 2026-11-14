import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import type { QuizData } from '../types/course';

interface QuizBlockProps {
  quiz: QuizData;
  savedSelection?: number;
  onSelect: (index: number) => void;
  onReset: () => void;
}

export const QuizBlock: React.FC<QuizBlockProps> = ({
  quiz,
  savedSelection,
  onSelect,
  onReset,
}) => {
  const [wrongAttempts, setWrongAttempts] = useState<number[]>([]);
  const solved =
    savedSelection !== undefined && Boolean(quiz.options[savedSelection]?.isCorrect);

  const handleOptionClick = (index: number) => {
    if (solved) return;
    const option = quiz.options[index];
    if (option.isCorrect) {
      onSelect(index);
    } else {
      setWrongAttempts((prev) => (prev.includes(index) ? prev : [...prev, index]));
    }
  };

  const handleRetry = () => {
    setWrongAttempts([]);
    onReset();
  };

  return (
    <section
      className="no-print my-7 rounded-xl border border-[var(--line)] bg-[var(--bg)] p-5"
      aria-label="Lesson self-check"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
          Check yourself
        </span>
        {solved && (
          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Try again
          </button>
        )}
      </div>

      <p className="mt-2 font-semibold text-[var(--ink)]">{quiz.question}</p>

      <div className="mt-3 grid gap-2.5">
        {quiz.options.map((opt, idx) => {
          const isChosenCorrect = solved && savedSelection === idx;
          const isChosenWrong = !solved && wrongAttempts.includes(idx);

          return (
            <button
              key={opt.label}
              type="button"
              disabled={solved || isChosenWrong}
              onClick={() => handleOptionClick(idx)}
              className={`flex w-full cursor-pointer items-start justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors min-h-[44px] ${
                isChosenCorrect
                  ? 'border-[var(--leaf)] bg-[var(--leaf-soft)] font-semibold text-[var(--ink)]'
                  : isChosenWrong
                  ? 'border-[var(--warn)] bg-[var(--warn-soft)] text-[var(--ink)] opacity-85 cursor-default'
                  : 'border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--ink)] disabled:cursor-default'
              }`}
            >
              <span className={isChosenWrong ? 'line-through' : ''}>{opt.label}</span>
              {isChosenCorrect && (
                <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[var(--leaf)]">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  Correct
                </span>
              )}
              {isChosenWrong && (
                <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[var(--warn)]">
                  <XCircle className="h-4 w-4" aria-hidden="true" />
                  Not quite
                </span>
              )}
            </button>
          );
        })}
      </div>

      {solved && (
        <p className="mt-3 text-sm text-[var(--ink)]">
          <span className="font-semibold text-[var(--leaf)]">Correct: </span>
          {quiz.explain}
        </p>
      )}
      {!solved && wrongAttempts.length > 0 && (
        <p className="mt-3 text-sm text-[var(--warn)]">
          Not quite. Pick another option to test your understanding.
        </p>
      )}
    </section>
  );
};
