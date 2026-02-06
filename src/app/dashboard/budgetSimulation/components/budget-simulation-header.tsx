'use client';

import { Box, Typography } from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import PaidIcon from '@mui/icons-material/Paid';

export function BudgetSimulationHeader() {
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
					<CalculateIcon fontSize="small" />
					<PaidIcon fontSize="small" />
				</Box>
				<Box sx={{ ml: 2 }}>
					<Typography variant="h4" fontWeight={700}>
						예산 시뮬레이션
					</Typography>
					<Typography variant="body2" color="text.secondary">
            품목 선택 후 운영기간·예산을 입력하면 사용률과 잔액을 확인할 수 있습니다.
					</Typography>
				</Box>
			</Box>
		</Box>
	);
}
