"use client";

import * as React from 'react';
import Stack from '@mui/material/Stack';
import { Paper, Container } from "@mui/material";

import { RealTimeInfoPanel } from './RealTimeInfoPanel';
import { RealTimeMap } from './RealTimeMap';
import { RealTimeControlHeader } from "./RealTimeControlHeader";

import { useCoolingFogListMutation } from '@/hooks/mutations/realTimeControl/use-cooling-fog-list-query';
import { useCoolingFogDetailMutation } from '@/hooks/mutations/realTimeControl/use-cooling-fog-detail-query';

export function RealTimeControlLayout(): React.JSX.Element {
	const { mutate: fetchCoolingFogList, data: listData } = useCoolingFogListMutation();
	const detailMutation = useCoolingFogDetailMutation();

	const coolingFogList = listData?.data?.cf_list ?? [];
	console.log("coolingFogList length", coolingFogList.length);
	const selectedCoolingFog = detailMutation.data?.data ?? null;

	React.useEffect(() => {
		fetchCoolingFogList();
	}, [fetchCoolingFogList]);

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<RealTimeControlHeader />
			<Stack spacing={3} sx={{ mt: 5 }}>
				<Paper
					variant="outlined"
					sx={{
						height: 600,
						width: '100%',
						overflow: 'hidden',
						borderRadius: 2,
					}}
				>
					<RealTimeMap
						coolingFogList={coolingFogList}
						onSelectCoolingFog={(cfCd) => detailMutation.mutate(cfCd)}
					/>
				</Paper>
				<RealTimeInfoPanel selectedCoolingFog={selectedCoolingFog} />
			</Stack>
		</Container>
	);
}
