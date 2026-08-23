import { useEffect, useState } from 'react';

/** Tracks which section id is currently in view for the nav indicator. */
export function useActiveSection(ids: string[], offset = 140): string {
  const [active, setActive] = useState(ids[0] ?? '');

  useEffect(() => {
    const onScroll = () => {
      let current = ids[0] ?? '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - offset <= 0) current = id;
      }
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 80;
      if (nearBottom) current = ids[ids.length - 1] ?? current;
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ids, offset]);

  return active;
}
