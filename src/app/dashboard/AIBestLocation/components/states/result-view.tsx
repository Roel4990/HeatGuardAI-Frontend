'use client';

import * as React from 'react';
import Box from '@mui/material/Box';

import type { RecoApiResponse, RecoRequestBody } from '@/types/AIBestLocation/reco';

import StateCard from '../card/state-card';
import ResultCard from '../card/result-card';
import MapCard from '../card/map-card';
import CardSlider from "@/app/dashboard/AIBestLocation/components/card/card-slider";

function priorityText(cd: 1 | 2 | 3) {
  if (cd === 1) return '취약계층 보호 우선';
  if (cd === 2) return '유동 인구 우선';
  return '체감 온도 저감 우선';
}

export default function ResultView({
                                     mapHeight,
                                     request,
                                     data,
                                   }: {
  mapHeight: number;
  request: RecoRequestBody;
  data: RecoApiResponse;
}) {
  const items = data.data!.result;

  return (
    <>
      {/* 지도 */}
      <MapCard height={mapHeight} points={items} />
      <Box
        sx={{
          flexShrink: 0,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 1
        }}
      >
        <StateCard label="분석 지역 범위 📉" value={data.data!.result_address} />
        <StateCard label="우선순위 🏆" value={priorityText(request.reco_loc_type_cd)} />
        <StateCard label="가능 추천 위치 수 🌐" value={data.data!.result_count} unit="개소" />
        <StateCard label="예상 보호 인원 👨‍👦‍👦" value={25_345} unit="명" />
      </Box>
      {/* 결과 카드 리스트 */}
      <CardSlider>
        {items.map((item) => (
          <Box
            key={`${item.reco_loc_rank}-${item.gee_loc_adress}`}
            sx={{ width: { xs: 260, sm: 280, md: 320 } }}
          >
            <ResultCard item={item} />
          </Box>
        ))}
      </CardSlider>

    </>
  );
}
