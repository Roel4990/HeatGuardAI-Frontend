"use client";

import * as React from 'react';
import Script from 'next/script';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { coolingFogs, type CoolingFogData } from '@/dummydata/cooling-fogs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NaverMap = any;

type RealTimeMapProps = {
	onSelectCoolingFog: (fog: CoolingFogData) => void;
};

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };

export function RealTimeMap({ onSelectCoolingFog }: RealTimeMapProps): React.JSX.Element {
	const mapContainerRef = React.useRef<HTMLDivElement | null>(null);
	const mapRef = React.useRef<NaverMap | null>(null);
	const [isScriptReady, setIsScriptReady] = React.useState(false);

	const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

	React.useEffect(() => {
		if (!isScriptReady) return;
		if (!mapContainerRef.current) return;
    // eslint-disable-next-line unicorn/prefer-global-this
		const naver = window.naver;
		if (!naver?.maps) return;
		if (mapRef.current) return;

		const map = new naver.maps.Map(mapContainerRef.current, {
			center: new naver.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng),
			zoom: 13,
		});

		// Marker click -> notify parent to update the info panel.
		for (const fog of coolingFogs) {
			const marker = new naver.maps.Marker({
				position: new naver.maps.LatLng(fog.lat, fog.lng),
				map,
			});

			naver.maps.Event.addListener(marker, 'click', () => {
				onSelectCoolingFog(fog);
			});
		}

		mapRef.current = map;
	}, [isScriptReady, onSelectCoolingFog]);

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
				<Box component="img" src="/assets/marker.svg" alt="쿨링포그 설치 위치" sx={{ width: 16, height: 16 }} />
				<Typography sx={{ fontSize: 16, fontWeight: 700 }}>쿨링포그 설치 위치</Typography>
			</Box>
		</div>
	);
}