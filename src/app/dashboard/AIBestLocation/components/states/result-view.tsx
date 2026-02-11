'use client';

import * as React from 'react';
import Box from '@mui/material/Box';

import type { RecoApiResponse, RecoRequestBody, RecoLocItem } from '@/types/AIBestLocation/reco';

import StateCard from '../card/state-card';
import ResultCard from '../card/result-card';
import MapCard from '../card/map-card';
import CardSlider from "@/app/dashboard/AIBestLocation/components/card/card-slider";
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import StarsOutlinedIcon from '@mui/icons-material/StarsOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import { createMapFocusHandler } from '../map-focus';

function priorityText(cd: 0 | 1 | 2) {
  if (cd === 0) return '종합지수';
  if (cd === 1) return '고온핵심';
  return '녹지부족';
}

export default function ResultView({
                                     mapHeight,
                                     request,
                                     data,
                                     resultKey,
                                   }: {
  mapHeight: number;
  request: RecoRequestBody;
  data: RecoApiResponse;
  resultKey: number;
}) {
  const items = data?.data?.result ?? [];
  const resultAddress = data?.data?.result_address ?? '-';
  const resultCount = data?.data?.result_count ?? 0;
  const [focusItem, setFocusItem] = React.useState<RecoLocItem | null>(null);
  const [focusKey, setFocusKey] = React.useState(0);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const resetKey = `${resultKey}`;

  React.useEffect(() => {
    setFocusItem(null);
    setActiveIndex(0);
    setFocusKey(0);
  }, [resetKey]);

  const MapCardWithFocus = MapCard as React.FC<{
    height: number;
    points: RecoLocItem[];
    focusPoint?: RecoLocItem | null;
    focusKey?: number;
    onSelectPoint?: (item: RecoLocItem, index: number) => void;
    activeIndex?: number;
  }>;
  const CardSliderWithActive = CardSlider as React.FC<{
    children: React.ReactNode;
    cardWidth?: number;
    resetKey?: string | number;
    activeIndex?: number;
  }>;

  const focusHandler = React.useMemo(
    () => createMapFocusHandler({ setFocusItem, setFocusKey, setActiveIndex }),
    [setFocusItem, setFocusKey, setActiveIndex]
  );

  return (
    <>
      <Box
        sx={{
          flexShrink: 0,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1.3fr 1fr', md: '1.4fr 1fr 1fr 1fr' },
          gap: 1.5,
          mb: 0.5
        }}
      >
        <StateCard
          label="분석 지역 범위"
          value={resultAddress}
          icon={<MapOutlinedIcon />}
        />
        <StateCard
          label="우선순위"
          value={priorityText(request.reco_loc_type_cd)}
          icon={<StarsOutlinedIcon />}
        />
        <StateCard
          label="가능 추천 위치 수"
          value={resultCount}
          unit="개소"
          icon={<PlaceOutlinedIcon />}
        />
        <StateCard
          label="예상 보호 인원"
          value={25_345}
          unit="명"
          icon={<GroupOutlinedIcon />}
        />
      </Box>

      {/* 지도 */}
      <MapCardWithFocus
        height={mapHeight}
        points={items}
        focusPoint={focusItem}
        focusKey={focusKey}
        onSelectPoint={focusHandler}
        activeIndex={activeIndex}
      />

      {/* 결과 카드 리스트 */}
      <CardSliderWithActive cardWidth={720} resetKey={resetKey} activeIndex={activeIndex}>
        {items.map((item, idx) => (
          <Box
            key={`${item.gee_address_full ?? 'item'}-${idx}`}
            sx={{ width: '100%' }}
          >
            <ResultCard item={item} displayRank={idx + 1} onFocus={() => focusHandler(item, idx)} />
          </Box>
        ))}
      </CardSliderWithActive>

    </>
  );
}
