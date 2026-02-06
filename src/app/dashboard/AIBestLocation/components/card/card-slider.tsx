'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function CardSlider({
                                     children,
                                     cardWidth = 425,
                                     gap = 16,
                                   }: {
  children: React.ReactNode;
  cardWidth?: number;
  gap?: number;
}) {
  const railRef = React.useRef<HTMLDivElement | null>(null);

  // ✅ null 포함 + 배열 타입 명확히
  const itemRefs = React.useRef<Array<HTMLDivElement | null>>([]);

  const [maxH, setMaxH] = React.useState<number | null>(null);

  const items = React.useMemo(() => React.Children.toArray(children), [children]);

  // ✅ children 개수 바뀌면 refs 길이도 정리(안전)
  React.useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, items.length);
  }, [items.length]);

  React.useLayoutEffect(() => {
    const el = railRef.current;
    if (!el) return;

    const measure = () => {
      let h = 0;
      for (const node of itemRefs.current) {
        if (!node) continue;
        h = Math.max(h, node.getBoundingClientRect().height);
      }
      setMaxH(h || null);
    };

    measure();

    const ro = new ResizeObserver(measure);
    for (const n of itemRefs.current) if (n) ro.observe(n);
    ro.observe(el);

    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [items.length]);

  const nearestIndex = React.useCallback(() => {
    const el = railRef.current;
    if (!el) return 0;

    const cx = el.scrollLeft + el.clientWidth / 2;

    let best = 0;
    let bestDist = Infinity;

    itemRefs.current.forEach((node, i) => {
      if (!node) return;
      const left = node.offsetLeft;
      const w = node.offsetWidth;
      const center = left + w / 2;
      const d = Math.abs(center - cx);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });

    return best;
  }, []);

  const scrollToIndex = React.useCallback((idx: number) => {
    const el = railRef.current;
    const node = itemRefs.current[idx];
    if (!el || !node) return;

    const target = node.offsetLeft + node.offsetWidth / 2 - el.clientWidth / 2;
    el.scrollTo({ left: target, behavior: 'smooth' });
  }, []);

  React.useEffect(() => {
    const el = railRef.current;
    if (!el) return;

    let t: number | undefined;

    const onScroll = () => {
      if (t) window.clearTimeout(t);
      t = window.setTimeout(() => scrollToIndex(nearestIndex()), 90);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (t) window.clearTimeout(t);
      el.removeEventListener('scroll', onScroll);
    };
  }, [nearestIndex, scrollToIndex]);

  const prev = () => scrollToIndex(Math.max(0, nearestIndex() - 1));
  const next = () => scrollToIndex(Math.min(items.length - 1, nearestIndex() + 1));

  const sidePad = `calc(50% - ${cardWidth / 2}px)`;

  return (
    <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden' }}>
      <IconButton
        onClick={prev}
        sx={{
          position: 'absolute',
          left: 8,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 'none',
          '&:hover': { bgcolor: 'background.paper' },
        }}
      >
        <ChevronLeftIcon />
      </IconButton>

      <IconButton
        onClick={next}
        sx={{
          position: 'absolute',
          right: 8,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 'none',
          '&:hover': { bgcolor: 'background.paper' },
        }}
      >
        <ChevronRightIcon />
      </IconButton>

      {/* 레일 */}
      <Box
        ref={railRef}
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          gap: `${gap}px`,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollPaddingInline: sidePad,
          px: sidePad,
          py: 1,
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        }}
      >
        {items.map((child, i) => (
          <Box
            key={i}
            // ✅ 여기서 "return" 절대 안 함 (블록 바디)
            ref={(node: HTMLDivElement | null) => {
              itemRefs.current[i] = node;
            }}
            sx={{
              flex: '0 0 auto',
              width: cardWidth,
              scrollSnapAlign: 'center',
              display: 'flex',
              minHeight: maxH ? `${maxH}px` : undefined,
            }}
          >
            <Box sx={{ flex: 1, display: 'flex' }}>{child}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
