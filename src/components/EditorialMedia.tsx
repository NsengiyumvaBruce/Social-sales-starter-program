import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface EditorialMediaProps {
  src: string;
  alt: string;
  caption?: string;
  aspect?: '16/9' | '4/3';
  overlayCaption?: string;
  className?: string;
}

export const EditorialMedia: React.FC<EditorialMediaProps> = ({
  src,
  alt,
  caption,
  aspect = '4/3',
  overlayCaption,
  className = '',
}) => {
  const [failed, setFailed] = useState(false);

  const aspectClass = aspect === '16/9' ? 'aspect-video' : 'aspect-[4/3]';

  return (
    <figure className={`overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface-alt)] ${className}`}>
      <div className={`relative w-full overflow-hidden ${aspectClass} h-full`}>
        {!failed ? (
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[var(--surface-alt)] p-6 text-center text-[var(--muted)]">
            <ImageIcon className="h-8 w-8 opacity-60" aria-hidden="true" />
            <span className="text-xs font-medium max-w-xs">{alt}</span>
          </div>
        )}

        {overlayCaption && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-4 pb-3.5 pt-10">
            <p className="text-xs font-medium text-white/95 leading-snug">{overlayCaption}</p>
          </div>
        )}
      </div>

      {caption && !overlayCaption && (
        <figcaption className="border-t border-[var(--line)] bg-[var(--surface)] px-4 py-2.5 text-xs text-[var(--muted)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
