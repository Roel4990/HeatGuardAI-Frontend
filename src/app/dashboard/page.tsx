'use client';

import * as React from "react";
import { Container, Stack } from '@mui/material';
import { MetricsRow } from "@/app/dashboard/components/MetricsRow";
import { HeatRiskTable } from "@/app/dashboard/components/HeatRiskTable";
import { HeatRiskMapCard } from "@/app/dashboard/components/HeatRiskMapCard";
import { HeatRiskHotline } from "@/app/dashboard/components/HeatRiskHotline";
import { DashboardHeader } from "@/app/dashboard/components/DashboardHeader";

export default function DashboardOverviewPage(): React.JSX.Element {
	return (
		<Container maxWidth="xl" sx={{ py: 4 }}>
			<Stack spacing={3}>
				<DashboardHeader />
				<MetricsRow />
				<Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
					<HeatRiskTable />
					<HeatRiskMapCard />
				</Stack>
				<HeatRiskHotline/>
			</Stack>
		</Container>
	);
}
