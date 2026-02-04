'use client';

import { Box, Typography } from '@mui/material';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

export function AiBestLocationHeader() {
	return (
		<Box>
			<Box
				display="flex"
				alignItems="center"
			>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 0.6,
						px: 1.8,
						py: 0.9,
						borderRadius: '999px',
						background: 'linear-gradient(90deg, #27C1C3 0%, #4ED6B8 100%)',
						boxShadow: '0 4px 12px rgba(39, 193, 195, 0.35)',
						color: '#fff',
					}}
				>
					<GpsFixedIcon fontSize="small" />
					<TravelExploreIcon fontSize="small" />
				</Box>
				<Box sx={{ ml: 2 }}>
					<Typography variant="h4" fontWeight={700}>
						AI 최적 위치
					</Typography>
					<Typography variant="body2" color="text.secondary">
						다양한 공간·환경 데이터를 종합 분석하여 쿨링 효과가 높은 최적 위치를 추천합니다.
					</Typography>
				</Box>
			</Box>
		</Box>
	);
}
