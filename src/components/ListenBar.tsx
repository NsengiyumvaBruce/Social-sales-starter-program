import React from 'react';
import { Pause, Play, Square, Volume2 } from 'lucide-react';

interface ListenBarProps {
  supported: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoiceUri: string;
  onVoiceChange: (uri: string) => void;
  rate: number;
  onRateChange: (rate: number) => void;
  status: 'idle' | 'speaking' | 'paused';
  progress: { current: number; total: number };
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export const ListenBar: React.FC<ListenBarProps> = ({
  supported,
  voices,
  selectedVoiceUri,
  onVoiceChange,
  rate,
  onRateChange,
  status,
  progress,
  onStart,
  onPause,
  onResume,
  onStop,
}) => {
  if (!supported) return null;

  return (
    <div
      className="no-print mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3"
      aria-label="Audio lesson controls"
    >
      <div className="flex flex-wrap items-center gap-2">
        {status === 'idle' && (
          <button
            type="button"
            onClick={onStart}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-[var(--accent-ink)] hover:bg-[var(--accent-hover)] transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
          >
            <Volume2 className="h-4 w-4" aria-hidden="true" />
            Listen to this lesson
          </button>
        )}

        {status === 'speaking' && (
          <>
            <button
              type="button"
              onClick={onPause}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[var(--ink)] px-4 py-2 text-xs font-semibold text-[var(--bg)] transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
            >
              <Pause className="h-4 w-4" aria-hidden="true" />
              Pause
            </button>
            <button
              type="button"
              onClick={onStop}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--bg)] px-3.5 py-2 text-xs font-semibold text-[var(--ink)] hover:border-[var(--ink)] transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
            >
              <Square className="h-3.5 w-3.5" aria-hidden="true" />
              Stop
            </button>
          </>
        )}

        {status === 'paused' && (
          <>
            <button
              type="button"
              onClick={onResume}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-[var(--accent-ink)] hover:bg-[var(--accent-hover)] transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              Resume
            </button>
            <button
              type="button"
              onClick={onStop}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--bg)] px-3.5 py-2 text-xs font-semibold text-[var(--ink)] hover:border-[var(--ink)] transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
            >
              <Square className="h-3.5 w-3.5" aria-hidden="true" />
              Stop
            </button>
          </>
        )}

        {status !== 'idle' && progress.total > 0 && (
          <span className="font-mono-num text-xs font-medium text-[var(--muted)] px-1">
            Reading {progress.current} of {progress.total}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs font-medium text-[var(--muted)]">
          <span>Speed</span>
          <select
            value={rate}
            onChange={(e) => onRateChange(parseFloat(e.target.value))}
            className="rounded-lg border border-[var(--line)] bg-[var(--bg)] px-2.5 py-1.5 text-xs font-medium text-[var(--ink)] min-h-[38px]"
          >
            <option value={0.85}>Slow (0.85×)</option>
            <option value={1}>Normal (1.0×)</option>
            <option value={1.15}>Fast (1.15×)</option>
            <option value={1.3}>Faster (1.3×)</option>
          </select>
        </label>

        {voices.length > 0 && (
          <label className="flex items-center gap-2 text-xs font-medium text-[var(--muted)]">
            <span>Voice</span>
            <select
              value={selectedVoiceUri}
              onChange={(e) => onVoiceChange(e.target.value)}
              className="max-w-[180px] truncate rounded-lg border border-[var(--line)] bg-[var(--bg)] px-2.5 py-1.5 text-xs font-medium text-[var(--ink)] min-h-[38px]"
            >
              {voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
    </div>
  );
};
