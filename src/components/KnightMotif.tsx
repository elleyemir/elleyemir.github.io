import { useMemo, useState } from 'react';
import { KnightMark } from './Logo';

const SIZE = 5;
const MOVES = [
  [1, 2],
  [2, 1],
  [-1, 2],
  [-2, 1],
  [1, -2],
  [2, -1],
  [-1, -2],
  [-2, -1],
] as const;

/**
 * Small interactive chess motif: move the knight around a 5x5 board and see
 * where it can go next. Fully keyboard accessible, no game logic beyond
 * knight geometry.
 */
export default function KnightMotif() {
  const [pos, setPos] = useState({ r: 2, c: 1 });

  const targets = useMemo(() => {
    const set = new Set<string>();
    for (const [dr, dc] of MOVES) {
      const r = pos.r + dr;
      const c = pos.c + dc;
      if (r >= 0 && r < SIZE && c >= 0 && c < SIZE) set.add(`${r}-${c}`);
    }
    return set;
  }, [pos]);

  return (
    <div className="glass rounded-2xl p-5">
      <p className="eyebrow mb-3">Knight&rsquo;s tour</p>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))` }}
        role="group"
        aria-label="Interactive knight move board"
      >
        {Array.from({ length: SIZE * SIZE }).map((_, index) => {
          const r = Math.floor(index / SIZE);
          const c = index % SIZE;
          const isKnight = pos.r === r && pos.c === c;
          const isTarget = targets.has(`${r}-${c}`);
          const dark = (r + c) % 2 === 1;
          return (
            <button
              key={index}
              type="button"
              onClick={() => setPos({ r, c })}
              aria-label={`Square ${String.fromCharCode(97 + c)}${SIZE - r}${
                isKnight ? ', knight here' : isTarget ? ', reachable by knight' : ''
              }`}
              className={`relative aspect-square rounded-[5px] transition-all duration-300 ${
                dark ? 'bg-parchment/[0.05]' : 'bg-parchment/[0.015]'
              } ${
                isTarget
                  ? 'ring-1 ring-inset ring-gold-500/[0.45] hover:bg-gold-500/[0.12]'
                  : 'hover:bg-parchment/[0.08]'
              }`}
            >
              {isKnight && (
                <KnightMark className="absolute inset-0 m-auto h-[86%] w-[86%] text-gold-400" />
              )}
              {isTarget && !isKnight && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 m-auto h-1.5 w-1.5 rounded-full bg-gold-500/[0.7]"
                />
              )}
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-xs leading-relaxed text-parchment/[0.55]">
        Pick a square to move the knight. The same habit applies to building software: look at where
        you can go before you commit to a move.
      </p>
    </div>
  );
}
