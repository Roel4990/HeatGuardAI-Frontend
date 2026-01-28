import * as React from "react";
import { Stack, Box } from '@mui/material';
import { MetricCard } from './MetricCard';

export function MetricsRow(): React.JSX.Element {
	return (
		<Stack
			direction={{ xs: 'column', md: 'row' }}
			spacing={3}
		>
			<Box flex={1}>
				<MetricCard title="고위험 지역 비율" value="23.5%" subText="+2.3%" />
			</Box>
			<Box flex={1}>
				<MetricCard title="오늘의 최고 체감온도" value="+4.2°C" subText="평균 대비" />
			</Box>
			<Box flex={1}>
				<MetricCard title="현재 동작중인 쿨링포그" value="42" subText="개" />
			</Box>
			<Box flex={1}>
				<MetricCard title="예상 온도 저감 효과" value="2.8°C" subText="쿨링포그 적용 시" />
			</Box>
		</Stack>
	);
}
