"use client";

import * as React from 'react';
import Script from 'next/script';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { cfmarkers } from '@/dummydata/cfmarkers';

declare global {
	interface Window {
		naver?: any;
	}
}

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };

export function RealTimeMap(): React.JSX.Element {
	const mapContainerRef = React.useRef<HTMLDivElement | null>(null);
	const mapRef = React.useRef<any | null>(null);
	const [isScriptReady, setIsScriptReady] = React.useState(false);

	const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

	React.useEffect(() => {
		if (!isScriptReady) return;
		if (!mapContainerRef.current) return;
		if (!window.naver?.maps) return;
		if (mapRef.current) return;

		const map = new window.naver.maps.Map(mapContainerRef.current, {
			center: new window.naver.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng),
			zoom: 13,
		});

		cfmarkers.forEach((marker) => {
			new window.naver.maps.Marker({
				position: new window.naver.maps.LatLng(marker.lat, marker.lng),
				map,
			});
		});

		mapRef.current = map;
	}, [isScriptReady]);

	return (
		<div style={{ position: 'relative', height: '100%', width: '100%' }}>
			{clientId ? (
				<Script
					src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`}
					strategy="afterInteractive"
					onReady={() => setIsScriptReady(true)}
				/>
			) : null}
			<div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
			<Box
				sx={{
					position: 'absolute',
					top: 16,
					left: 16,
					zIndex: 10,
					bgcolor: 'rgba(255,255,255,0.9)',
					borderRadius: 2,
					px: 1.5,
					py: 1,
					boxShadow: 1,
					pointerEvents: 'none',
					display: 'flex',
					alignItems: 'center',
					gap: 1,
				}}
			>
				<Box
					component="img"
					src="/assets/marker.svg"
					alt="쿨링포그 설치 위치"
					sx={{ width: 16, height: 16 }}
				/>
				<Typography sx={{ fontSize: 16, fontWeight: 700 }}>
					쿨링포그 설치 위치
				</Typography>
			</Box>
		</div>
	);
}
