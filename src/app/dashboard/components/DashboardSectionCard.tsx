import * as React from "react";
import { Paper, Typography, Box } from '@mui/material';

interface Props {
	title: string;
	children: React.ReactNode;
}

export function DashboardSectionCard({ title, children }: Props) {
	return (
		<Paper sx={{ p: 3, borderRadius: 3, flex: 1, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.10)',}}>
			<Typography fontWeight={700} mb={2}>
				{title}
			</Typography>
			<Box>{children}</Box>
		</Paper>
	);
}
