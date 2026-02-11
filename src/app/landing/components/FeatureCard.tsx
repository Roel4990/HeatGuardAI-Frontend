'use client';

import * as React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


interface FeatureCardProps {
	icon: React.ElementType<{ size?: number; color?: string; weight?: 'regular' | 'fill' | 'bold' | 'thin' }>;
	title: string;
	description: string;
	index: number;
}


export function FeatureCard({ icon: Icon, title, description, index }: FeatureCardProps): React.JSX.Element {
	return (
		<Paper
			elevation={0}
			sx={{
				p: 5,
				borderRadius: 2,
				border: '1px solid',
				borderColor: 'divider',
				bgcolor: 'background.paper',
				transition: 'all 0.3s ease',
				'&:hover': {
					boxShadow: '0 12px 28px rgba(15, 23, 42, 0.12)',
					borderColor: 'primary.light',
				},
				...(index % 2 === 1 ? { ml: { md: 4 } } : { mr: { md: 4 } }),
			}}
		>
			<Box
				sx={{
					width: 55,
					height: 55,
					borderRadius: 2,
					background: 'linear-gradient(135deg, #4A60DD)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					mb: 2,
				}}
			>
				<Icon size={32} color="#fff" weight="fill" />
			</Box>
			<Typography variant="h5" fontWeight={700} color="text.primary">
				{title}
			</Typography>
			<Typography variant="body1" color="text.secondary" sx={{ mt: 1, lineHeight: 1.7 }}>
				{description}
			</Typography>
		</Paper>
	);
}
