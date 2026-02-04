'use client';

import { Box, Typography } from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';

export function DashboardHeader() {
	return (
		<Box display="flex" justifyContent="space-between" alignItems="center">
			<Box display="flex" alignItems="center">
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						p: 1.2,
						borderRadius: '999px',
						background: 'linear-gradient(90deg, #27C1C3 0%, #4ED6B8 100%)',
						boxShadow: '0 4px 12px rgba(39, 193, 195, 0.35)',
						color: '#fff',
					}}
				>
					<GridViewIcon fontSize="medium" />
				</Box>
				<Box sx={{ ml: 2 }}>
					<Typography variant="h4" fontWeight={700}>
						대시보드
					</Typography>
					<Typography variant="body2" color="text.secondary">
						시스템의 현재 상태와 주요 지표를 확인하세요.
					</Typography>
				</Box>
			</Box>
		</Box>
	);
}
