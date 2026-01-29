import { Chip, Table, TableBody, TableCell, TableHead, TableRow, type SxProps } from '@mui/material';
import { RiskLevel } from "@/types/dashboard/dashboard";
import { DashboardSectionCard } from "./DashboardSectionCard";
import { HEAT_RISK_ROWS } from "@/app/dashboard/data/heat-risk-rank";

const RISK_CHIP_STYLES: Record<RiskLevel, { label: string; color: 'error' | 'warning' | 'default'; sx?: SxProps }> = {
	위험: {
		label: '위험',
		color: 'error',
	},
	높음: {
		label: '높음',
		color: 'warning',
	},
	보통: {
		label: '보통',
		color: 'default',
		sx: {
			backgroundColor: '#FACC15',
			color: '#1F2937',
			fontWeight: 600,
		},
	},
};

export function HeatRiskTable() {
	return (
		<DashboardSectionCard title="폭염 취약 종합 지수 순위">
			<Table size="small">
				<TableHead
					sx={{
						'& .MuiTableCell-root': {
							backgroundColor: 'transparent',
							color: 'inherit',
						},
					}}
				>
					<TableRow>
						<TableCell align="center" sx={{ fontWeight: 600 }}>
							순위
						</TableCell>
						<TableCell align="center" sx={{ fontWeight: 600 }}>
							행정동
						</TableCell>
						<TableCell align="center" sx={{ fontWeight: 600 }}>
							열 취약지수
						</TableCell>
						<TableCell align="center" sx={{ fontWeight: 600 }}>
							고령자 %
						</TableCell>
						<TableCell align="center" sx={{ fontWeight: 600 }}>
							저소득층 %
						</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{HEAT_RISK_ROWS.map((row) => {
						const chip = RISK_CHIP_STYLES[row.level];

						return (
							<TableRow
								key={row.rank}
								sx={{
									'& td': {
										textAlign: 'center',
									},
									'&:hover': {
										backgroundColor: 'action.hover',
									},
								}}
							>
								<TableCell>{row.rank}</TableCell>
								<TableCell>{row.district}</TableCell>
								<TableCell>
									<strong>{row.score}</strong>
									<Chip
										label={chip.label}
										color={chip.color}
										size="small"
										sx={{ ml: 1, ...chip.sx }}
									/>
								</TableCell>
								<TableCell>{row.seniorRate}</TableCell>
								<TableCell>{row.lowIncomeRate}</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</DashboardSectionCard>
	);
}
