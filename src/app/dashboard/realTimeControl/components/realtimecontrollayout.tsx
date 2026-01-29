"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { RealTimeInfoPanel } from './realtimeinfopanel';
import { RealTimeMap } from './realtimemap';
import { useCoolingFogDetailMutation } from '@/hooks/mutations/realTimeControl/use-cooling-fog-detail-query';
import { useCoolingFogListMutation } from '@/hooks/mutations/realTimeControl/use-cooling-fog-list-query';

export function RealTimeControlLayout(): React.JSX.Element {
	const { mutate: fetchCoolingFogList, data: listData } = useCoolingFogListMutation();
	const detailMutation = useCoolingFogDetailMutation();
	const coolingFogList = listData?.data?.cfList ?? [];
	const selectedCoolingFog = detailMutation.data?.data ?? null;

	const handleSelectCoolingFog = React.useCallback(
		(fogId: string) => {
			detailMutation.mutate(fogId);
		},
		[detailMutation]
	);

	React.useEffect(() => {
		fetchCoolingFogList();
	}, [fetchCoolingFogList]);

	return (
		<Stack
			spacing={2}
			sx={{
				mt: -5,
				width: 'calc(100vw - 80px)',
				mx: 'calc(50% - 50vw + 40px)',
				'@media (min-width:600px)': {
					width: 'calc(100vw - 80px)',
					mx: 'calc(50% - 50vw + 40px)',
				},
				'@media (min-width:1200px)': {
					width: 'calc(100vw - var(--SideNav-width) - 80px)',
					mx: 'calc(50% - (100vw - var(--SideNav-width)) / 2 + 40px)',
				},
			}}
		>
			<Typography sx={{ fontSize: 30, fontWeight: 800 }}>실시간 관제</Typography>
			<Box
				sx={{
					height: 600,
					width: '100%',
					overflow: 'hidden',
					borderRadius: 3,
					border: '1px solid',
					borderColor: 'grey.200',
					bgcolor: 'common.white',
					boxShadow: 1,
				}}
			>
				<RealTimeMap
					coolingFogList={coolingFogList}
					onSelectCoolingFog={handleSelectCoolingFog}
				/>
			</Box>
			<RealTimeInfoPanel selectedCoolingFog={selectedCoolingFog} />
		</Stack>
	);
}



