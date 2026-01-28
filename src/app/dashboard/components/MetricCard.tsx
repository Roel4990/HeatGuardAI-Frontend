import * as React from "react";

import { Paper, Typography, Box } from '@mui/material';

interface MetricCardProps {
	title: string;
	value: string;
	subText?: string;
	icon?: React.ReactNode;
}

export function MetricCard({ title, value, subText, icon }: MetricCardProps) {
	return (
		<Paper
			sx={{
				p: 3,
				borderRadius: 3,
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				boxShadow: '0 8px 24px rgba(0, 0, 0, 0.10)',
			}}
		>
			<Box>
				<Typography variant="body2" color="text.secondary">
					{title}
				</Typography>
				<Typography variant="h4" fontWeight={700}>
					{value}
				</Typography>
				{subText && (
					<Typography variant="caption" color="text.secondary">
						{subText}
					</Typography>
				)}
			</Box>

			{icon && <Box>{icon}</Box>}
		</Paper>
	);
}
