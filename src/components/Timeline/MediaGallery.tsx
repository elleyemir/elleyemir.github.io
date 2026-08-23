import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import type { TimelineMedia } from '../../types/timeline';
import { asset } from '../../config';

interface MediaGalleryProps {
  media: TimelineMedia[];
  title: string;
}

function resolve(src: string): string {
  return /^(https?:)?\/\//.test(src) ? src : asset(src);
}

/**
 * Renders one image, a carousel for several, or embeds. Any media that fails to
 * load is skipped so a missing file never breaks the modal.
 */
export default function MediaGallery({ media, title }: MediaGalleryProps) {
  const [index, setIndex] = useState(0);
  const [broken, setBroken] = useState<Record<number, boolean>>({});

  const items = useMemo(
    () => media.filter((item, i) => !(item.type === 'image' && broken[i])),
    [media, broken],
  );

  if (media.length === 0) return null;

  if (items.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-parchment/[0.1] bg-parchment/[0.03] px-4 py-5 text-sm text-parchment/[0.5]">
        <ImageOff className="h-4 w-4" aria-hidden="true" />
        Media for this entry is not available.
      </div>
    );
  }

  const safeIndex = Math.min(index, items.length - 1);
  const current = items[safeIndex];
  const multiple = items.length > 1;

  return (
    <figure className="space-y-3">
      <div className="relative overflow-hidden rounded-xl border border-parchment/[0.12] bg-ink-950">
        {current.type === 'image' ? (
          <img
            src={resolve(current.src)}
            alt={current.alt || `${title} — image ${safeIndex + 1}`}
            loading="lazy"
            decoding="async"
            className="max-h-[52vh] w-full object-contain"
            onError={() =>
              setBroken((prev) => ({ ...prev, [media.indexOf(current)]: true }))
            }
          />
        ) : (
          <div className="aspect-video w-full">
            <iframe
              src={resolve(current.src)}
              title={current.title || `${title} — embed`}
              loading="lazy"
              allowFullScreen
              className="h-full w-full border-0"
            />
          </div>
        )}

        {multiple && (
          <>
            <button
              type="button"
              onClick={() => setIndex((safeIndex - 1 + items.length) % items.length)}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-parchment/[0.15] bg-ink-950/[0.75] p-2 text-parchment/[0.8] backdrop-blur transition-colors hover:text-gold-400"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setIndex((safeIndex + 1) % items.length)}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-parchment/[0.15] bg-ink-950/[0.75] p-2 text-parchment/[0.8] backdrop-blur transition-colors hover:text-gold-400"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {(current.caption || multiple) && (
        <figcaption className="flex items-center justify-between gap-4 text-xs text-parchment/[0.5]">
          <span>{current.caption}</span>
          {multiple && (
            <span className="font-mono tabular-nums">
              {safeIndex + 1} / {items.length}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
