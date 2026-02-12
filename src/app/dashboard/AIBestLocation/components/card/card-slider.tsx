'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export type CardSliderProps = {
  children: React.ReactNode;
  cardWidth?: number;
  cardHeight?: number;
  resetKey?: string | number;
  activeIndex?: number;
  gap?: number;
};

const CardSlider: React.FC<CardSliderProps> = ({
  children,
  cardWidth = 425,
  cardHeight,
  resetKey,
  activeIndex,
  gap = 16,
}) => {
  const railRef = React.useRef<HTMLDivElement | null>(null);

  // ??null ?ы븿 + 諛곗뿴 ???紐낇솗??
  const itemRefs = React.useRef<Array<HTMLDivElement | null>>([]);

  const [maxH, setMaxH] = React.useState<number | null>(null);

  const items = React.useMemo(() => React.Children.toArray(children), [children]);

  // ??children 媛쒖닔 諛붾뚮㈃ refs 湲몄씠???뺣━(?덉쟾)
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

    globalThis.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      globalThis.removeEventListener('resize', measure);
    };
  }, [items.length]);

  const nearestIndex = React.useCallback(() => {
    const el = railRef.current;
    if (!el) return 0;

    const cx = el.scrollLeft + el.clientWidth / 2;

    let best = 0;
    let bestDist = Infinity;

    for (const [i, node] of itemRefs.current.entries()) {
      if (!node) continue;
      const left = node.offsetLeft;
      const w = node.offsetWidth;
      const center = left + w / 2;
      const d = Math.abs(center - cx);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    }

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

    let t: ReturnType<typeof setTimeout> | undefined;

    const onScroll = () => {
      if (t) globalThis.clearTimeout(t);
      t = globalThis.setTimeout(() => scrollToIndex(nearestIndex()), 90);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (t) globalThis.clearTimeout(t);
      el.removeEventListener('scroll', onScroll);
    };
  }, [nearestIndex, scrollToIndex]);

  React.useEffect(() => {
    if (items.length === 0) return;
    scrollToIndex(0);
  }, [resetKey, items.length, scrollToIndex]);

  React.useEffect(() => {
    if (typeof activeIndex !== 'number') return;
    if (activeIndex < 0 || activeIndex >= items.length) return;
    scrollToIndex(activeIndex);
  }, [activeIndex, items.length, scrollToIndex]);

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

      {/* ?덉씪 */}
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
            // ???ш린??"return" ?덈? ????(釉붾줉 諛붾뵒)
            ref={(node: HTMLDivElement | null) => {
              itemRefs.current[i] = node;
            }}
            sx={{
              flex: '0 0 auto',
              width: cardWidth,
              height: cardHeight ? `${cardHeight}px` : undefined,
              scrollSnapAlign: 'center',
              display: 'flex',
              minHeight: cardHeight ? undefined : maxH ? `${maxH}px` : undefined,
            }}
          >
            <Box sx={{ flex: 1, display: 'flex' }}>{child}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CardSlider;
