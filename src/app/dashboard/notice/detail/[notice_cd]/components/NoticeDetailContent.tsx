'use client';

import { Paper, Typography } from '@mui/material';

interface NoticeDetailContentProps {
	content: string;
}

export function NoticeDetailContent({ content }: NoticeDetailContentProps) {
	return (
		<Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
			<Typography
				component="div"
				sx={{
					whiteSpace: 'pre-line',
					lineHeight: 1.8,
					color: '#374151',
				}}
			>
				{content}
			</Typography>
		</Paper>
	);
}
