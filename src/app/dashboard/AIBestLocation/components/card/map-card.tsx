'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import Box from '@mui/material/Box';

import type { RecoLocItem } from '../../../../../types/AIBestLocation/reco';

type MapCardProps = {
  height: number;
  points: RecoLocItem[];
};

const MARKER_IMG = '/assets/rcmdPoint.svg';

export default function MapCard({ height, points }: MapCardProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

  useEffect(() => {
    // eslint-disable-next-line unicorn/prefer-global-this
    if (window.naver?.maps) setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded || !mapRef.current || points.length === 0) return;

    // eslint-disable-next-line unicorn/prefer-global-this
    const naver = window.naver;
    if (!naver) return;

    // 지도 생성 (첫 번째 포인트 기준)
    const center = new naver.maps.LatLng(points[0].lat, points[0].lng);
    const map = new naver.maps.Map(mapRef.current, {
      center,
      zoom: 15,
    });

    // 마커 생성
    for (const item of points) {
      const position = new naver.maps.LatLng(item.lat, item.lng);

      new naver.maps.Marker({
        position,
        map,
        icon: {
          content: makeMarkerHTML(item.reco_loc_rank),
          anchor: new naver.maps.Point(18, 36),
        },
      });
    }
  }, [loaded, points]);

  if (!clientId) {
    return <Box>지도 키를 확인해주세요.</Box>;
  }

  return (
    <Box sx={{ height, borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
      <Script
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`}
        strategy="afterInteractive"
        onLoad={() => setLoaded(true)}
      />
      <Box ref={mapRef} sx={{ width: '100%', height: '100%' }} />
    </Box>
  );
}

/**
 * 순위 숫자 뱃지 마커 HTML
 */
function makeMarkerHTML(rank: number) {
  return `
    <div style="position:relative;width:36px;height:36px;transform:translate(-50%,-100%);">
      <img src="${MARKER_IMG}" style="width:36px;height:36px;display:block;" />
      <div style="
        position:absolute;
        top:2px;               /* 숫자 높이 조절 포인트 */
        left:0; right:0;
        margin:0 auto;
        width:18px; height:18px;
        border-radius:999px;
        background:#fff;
        border:2px solid #f57c00;
        display:flex;
        align-items:center;
        justify-content:center;
        font-weight:900;
        font-size:11px;
        color:#f57c00;
        box-sizing:border-box;
      ">
        ${rank}
      </div>
    </div>
  `;
}
