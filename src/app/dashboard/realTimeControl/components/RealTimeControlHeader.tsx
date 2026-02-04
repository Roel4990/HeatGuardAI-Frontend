'use client';

import { Box, Typography } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import SensorsIcon from '@mui/icons-material/Sensors';

export function RealTimeControlHeader() {
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
					<MapIcon fontSize="small" />
					<SensorsIcon fontSize="small" />
				</Box>
				<Box sx={{ ml: 2 }}>
					<Typography variant="h4" fontWeight={700}>
						실시간 관제
					</Typography>
					<Typography variant="body2" color="text.secondary">
						설치된 쿨링포그를 실시간으로 확인하고 제어합니다.
					</Typography>
				</Box>
			</Box>
		</Box>
	);
}
