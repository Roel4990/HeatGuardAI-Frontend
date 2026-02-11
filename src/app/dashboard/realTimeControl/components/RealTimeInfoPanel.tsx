"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

import type { CoolingFogDetailData } from '@/types/realTimeControl/real-time-control';

type RealTimeInfoPanelProps = {
	selectedCoolingFog: CoolingFogDetailData | null;
};

type DetailRowProps = {
	label: string;
	value: string;
};

function DetailRow({ label, value }: DetailRowProps): React.JSX.Element {
	return (
		<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1 }}>
			<Typography variant="body2" color="text.secondary">
				{label}
			</Typography>
			<Typography variant="body1" sx={{ fontWeight: 600 }}>
				{value}
			</Typography>
		</Box>
	);
}

function PlaceholderState(): React.JSX.Element {
	return (
		<Paper
			variant="outlined"
			sx={{
				minHeight: 500,
				width: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				px: 3,
				py: 5,
				textAlign: 'center',
				borderRadius: 2,
			}}
		>
			<Box>
				<Box
					component="img"
					src="/assets/marker.svg"
					alt="쿨링포그 설치 위치"
					sx={{ width: 80, height: 90, mx: 'auto', mb: 5 }}
				/>
				<Typography variant="h6" sx={{ fontWeight: 700 }}>
					선택된 쿨링포그 위치가 없습니다.
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
					조회하고 싶은 쿨링포그 위치를 지도에서 선택해주세요
				</Typography>
			</Box>
		</Paper>
	);
}

type DetailStateProps = {
	fog: CoolingFogDetailData;
};

function DetailState({ fog }: DetailStateProps): React.JSX.Element {
	const locationName = fog.cf_location.trim() || '-';

	return (
		<Box sx={{ p: 2 }}>
			<Paper
				variant="outlined"
				sx={{
					borderRadius: 2,
					p: 2,
					bgcolor: 'background.default'
				}}
			>
				<Typography variant="h6" color="text.primary">
					현재 선택 위치
				</Typography>
				<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mt: 2 }}>
					<Box>
						<Typography variant="h5" sx={{ fontWeight: 600 }}>
							{locationName}
						</Typography>
					</Box>
				</Box>
			</Paper>

			<Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mt: 3 }}>
				<Paper
					variant="outlined"
					sx={{
						flex: '1 1 320px',
						borderRadius: 2,
						p: 2,
					}}
				>
					<Typography variant="subtitle2" color="text.primary">
						운영 및 담당자 정보
					</Typography>
					<Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
						<Chip label={fog.cf_state ? '운영중' : '중지'} color={fog.cf_state ? 'success' : 'error'} variant="filled" />
						<Typography variant="body2" color="text.secondary">
							설치날짜 {fog.cf_inst_date || '-'}
						</Typography>
					</Box>
					<Box sx={{ mt: 2 }}>
						<DetailRow label="소속" value={fog.cf_manage_dept} />
						<DetailRow label="이름" value={fog.cf_manager_nm} />
						<DetailRow label="전화번호" value={fog.cf_manager_contact} />
					</Box>
				</Paper>
				<Paper
					variant="outlined"
					sx={{
						flex: '1 1 320px',
						borderRadius: 2,
						p: 2,
					}}
				>
					<Typography variant="subtitle2" color="text.primary">
						환경 정보
					</Typography>
					<Box sx={{ mt: 2, display: 'grid', gap: 2 }}>
						<DetailRow label="선택 위치 온도" value={`${(fog.cf_selected_temp )}°C`} />
						<DetailRow label="주변 온도" value={`${fog.cf_nearby_temp}°C`} />
						<DetailRow label="습도" value={`${fog.cf_hum_per}%`} />
					</Box>
				</Paper>
			</Box>
		</Box>
	);
}

const fixedSlots = ['00:00', '06:00', '12:00', '18:00'];
export function RealTimeInfoPanel({ selectedCoolingFog }: RealTimeInfoPanelProps): React.JSX.Element {
	const chartData = React.useMemo(() => {
		if (!selectedCoolingFog) return [];



		return fixedSlots.map((time) => {
			const values = selectedCoolingFog.time?.[time];
			return {
				time,
				selectedTemp: values?.cf_selected_temp ?? null,
				nearbyTemp: values?.cf_nearby_temp ?? null,
				humidity: values?.cf_hum_per ?? null,
			};
		});
	}, [selectedCoolingFog]);

	if (!selectedCoolingFog) {
		return (
			<PlaceholderState />
		);
	}

	return (
		<Stack spacing={3}>
			<Paper variant="outlined" sx={{ borderRadius: 2 }}>
				<DetailState fog={selectedCoolingFog} />
			</Paper>

			<Paper variant="outlined" sx={{ borderRadius: 2 }}>
				<Box sx={{ p: 3 }}>
					<Typography variant="h6" sx={{ fontWeight: 700 }}>
						냉방 성능 분석 (가동 기록, 24시간)
					</Typography>
					<Box sx={{ mt: 3 }}>
						<Paper
							variant="outlined"
							sx={{
								height: 260,
								width: '100%',
								borderRadius: 2,
								p: 2,
							}}
						>
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="time" ticks={['00:00', '06:00', '12:00', '18:00']} />
									<YAxis />
									<Tooltip />
									<Legend verticalAlign="top" height={24} />
									<Line
										type="monotone"
										dataKey="selectedTemp"
										connectNulls={false}
										name="선택 위치 온도"
										stroke="#2563eb"
										strokeWidth={2}
										dot={{ r: 4 }}
										activeDot={{ r: 6 }}
									/>
									<Line
										type="monotone"
										dataKey="nearbyTemp"
										connectNulls={false}
										name="주변 온도"
										stroke="#f97316"
										strokeWidth={2}
										dot={{ r: 4 }}
										activeDot={{ r: 6 }}
									/>
									<Line
										type="monotone"
										dataKey="humidity"
										name="습도"
										stroke="#38bdf8"
										strokeWidth={2}
										dot={{ r: 4 }}
										activeDot={{ r: 6 }}
									/>
								</LineChart>
							</ResponsiveContainer>
						</Paper>
					</Box>
				</Box>
			</Paper>
		</Stack>
	);
}
