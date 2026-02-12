'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import Box from '@mui/material/Box';

import type { RecoLocItem } from '@/types/AIBestLocation/reco';
import * as React from "react";

export type MapCardProps = {
  height: number;
  points: RecoLocItem[];
  focusPoint?: RecoLocItem | null;
  focusKey?: number;
  onSelectPoint?: (item: RecoLocItem, index: number) => void;
  activeIndex?: number;
};

const MARKER_IMG = '/assets/marker.svg';

type NaverLatLng = {
  lat: number;
  lng: number;
};

type NaverPoint = {
  x: number;
  y: number;
};

type NaverMap = {
  setCenter: (center: NaverLatLng) => void;
  setZoom: (zoom: number) => void;
};

type NaverMarker = {
  setMap: (map: NaverMap | null) => void;
};

type NaverMapConstructor = new (
  element: HTMLElement,
  options: { center: NaverLatLng; zoom: number }
) => NaverMap;

type NaverLatLngConstructor = new (lat: number, lng: number) => NaverLatLng;
type NaverMarkerConstructor = new (options: {
  position: NaverLatLng;
  map: NaverMap;
  icon: { content: string; anchor: NaverPoint };
}) => NaverMarker;
type NaverPointConstructor = new (x: number, y: number) => NaverPoint;

type NaverMaps = {
  LatLng: NaverLatLngConstructor;
  Map: NaverMapConstructor;
  Marker: NaverMarkerConstructor;
  Point: NaverPointConstructor;
};

type NaverGlobal = { maps: NaverMaps };
type NaverWindow = typeof globalThis & { naver?: NaverGlobal };

const MapCard: React.FC<MapCardProps> = ({
  height,
  points,
  focusPoint,
  focusKey,
  onSelectPoint,
  activeIndex,
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<NaverMap | null>(null);
  const markersRef = useRef<NaverMarker[]>([]);
  const [loaded, setLoaded] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

  useEffect(() => {
    if ((globalThis as NaverWindow).naver?.maps) setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded || !mapRef.current || points.length === 0) return;

    const naver = (globalThis as NaverWindow).naver;
    if (!naver) return;

    const targetPoint = focusPoint ?? points[0];
    const center = new naver.maps.LatLng(targetPoint.lat, targetPoint.lng);
    const zoom = focusPoint ? 18 : 14;

    const updateMapView = (map: NaverMap) => {
      map.setCenter(center);
      map.setZoom(zoom);
    };

    const initMap = () => {
      const el = mapRef.current;
      if (!el) return;
      mapInstanceRef.current = new naver.maps.Map(el, {
        center,
        zoom,
      });
    };

    if (mapInstanceRef.current) {
      updateMapView(mapInstanceRef.current);
    } else {
      initMap();
    }

    const map = mapInstanceRef.current;
    if (!map) return;

    for (const marker of markersRef.current) marker.setMap(null);
    markersRef.current = [];

    for (const [idx, item] of points.entries()) {
      const position = new naver.maps.LatLng(item.lat, item.lng);

      const marker = new naver.maps.Marker({
        position,
        map: map,
        icon: {
          content: makeMarkerHTML(idx + 1),
          anchor: new naver.maps.Point(18, 36),
        },
      });
      markersRef.current.push(marker);
    }
  }, [loaded, points, focusPoint, focusKey]);


  if (clientId) {
    return (
    <Box sx={{ height, mb: 2, borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
      <Script
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`}
        strategy="afterInteractive"
        onLoad={() => setLoaded(true)}
      />

      {/* 우측 상단 순위 리스트 */}
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 8,
          px: 1,
          py: 1,
          borderRadius: 2,
          bgcolor: 'rgba(255,255,255,0.9)',
          boxShadow: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          maxHeight: 220,
          overflowY: 'auto',
        }}
      >
        {points.map((p, idx) => {
          const isActive = typeof activeIndex === 'number' && idx === activeIndex;
          return (
          <Box
            key={`${p.gee_address_full ?? 'point'}-${idx}`}
            onClick={() => onSelectPoint?.(p, idx)}
            sx={{
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: 12,
              fontWeight: 700,
              cursor: onSelectPoint ? 'pointer' : 'default',
              bgcolor: isActive ? 'rgba(74,96,221,0.22)' : 'rgba(74,96,221,0.08)',
              color: isActive ? '#1a2fbf' : '#2e49e1',
              border: isActive ? '1px solid rgba(74,96,221,0.6)' : '1px solid transparent',
              whiteSpace: 'nowrap',
            }}
          >
            {idx + 1}위
          </Box>
        )})}
      </Box>

      {/* ✅ 좌측 상단 오버레이 */}
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 8, // 지도/마커 위로
          px: 1.5,
          py: 0.75,
          borderRadius: 999,
          bgcolor: '#fff',
          boxShadow: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          fontWeight: 700,
          fontSize: 14,
          lineHeight: 1,
        }}
      >
        {/* 아이콘이 필요하면 이미지/아이콘 추가 */}
        <Box component="img" src="/assets/marker.svg" alt="AI 쿨링포그 위치 추천" sx={{ width: 16, height: 16 }} />
        쿨링포그 추천 위치
      </Box>

      <Box ref={mapRef} sx={{ width: '100%', height: '100%' }} />
    </Box>
    );
  }

  return <Box>지도 키를 확인해주세요.</Box>;

};

export default MapCard;

/**
 * 순위 숫자 뱃지 마커 HTML
 */
function makeMarkerHTML(rank: number) {
  return `
    <div style="position:relative;width:36px;height:36px;transform:translate(-50%,-100%);">
      <img src="${MARKER_IMG}" style="width:36px;height:36px;display:block;" alt="No image"/>
      <div style="
        position:absolute;
        top:2px;               /* 숫자 높이 조절 포인트 */
        left:0; right:0;
        margin:0 auto;
        width:18px; height:18px;
        border-radius:999px;
        background:#fff;
        border:2px solid #4A60DD;
        display:flex;
        align-items:center;
        justify-content:center;
        font-weight:900;
        font-size:11px;
        color:#4A60DD;
        box-sizing:border-box;
      ">
        ${rank}
      </div>
    </div>
  `;
}




