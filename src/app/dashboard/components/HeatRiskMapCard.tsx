import { Box } from '@mui/material';
import { DashboardSectionCard } from './DashboardSectionCard';

export function HeatRiskMapCard() {
	return (
		<DashboardSectionCard title="지역별 폭염 위험도 요약 지도">
			<Box
				sx={{
					width: '100%',
					height: 420,
					borderRadius: 2,
					overflow: 'hidden',
					position: 'relative',
					backgroundColor: '#fff',
				}}
			>
				<Box
					component="img"
					src="/homeMapImage.png"
					alt="지역별 폭염 위험도 지도"
					sx={{
						width: '100%',
						height: '100%',
						objectFit: 'contain',
					}}
				/>
			</Box>
		</DashboardSectionCard>
	);
}
