"use client";

import * as React from 'react';
import Stack from '@mui/material/Stack';
import { Paper, Container } from "@mui/material";

import { RealTimeInfoPanel } from './RealTimeInfoPanel';
import { RealTimeMap } from './RealTimeMap';
import type { CoolingFogData } from '@/dummydata/cooling-fogs';
import { RealTimeControlHeader } from "./RealTimeControlHeader";

export function RealTimeControlLayout(): React.JSX.Element {
	const [selectedCoolingFog, setSelectedCoolingFog] = React.useState<CoolingFogData | null>(null);

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
					<RealTimeMap onSelectCoolingFog={setSelectedCoolingFog} />
				</Paper>
				<RealTimeInfoPanel selectedCoolingFog={selectedCoolingFog} />
			</Stack>
		</Container>
	);
}
