import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

export function RealTimeInfoPanel(): React.JSX.Element {
	return (
		<Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'grey.200', boxShadow: 1 }}>
			<Box
				sx={{
					minHeight: 620,
					width: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					px: 3,
					py: 5,
					textAlign: 'center',
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
			</Box>
		</Card>
	);
}
