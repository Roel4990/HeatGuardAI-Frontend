'use client';

import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import Button from "@mui/material/Button";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Stack from "@mui/material/Stack";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export function NoticeDetailHeader() {
	const router = useRouter();

	return (
		<Box display="flex" justifyContent="space-between" alignItems="center">
			<Button
				startIcon={<ChevronLeftIcon />}
				sx={{ color: 'text.secondary' }}
				onClick={() => {
					router.back();
				}}
			>
				목록으로 돌아가기
			</Button>

			<Stack direction="row" spacing={1}>
				<Button
					variant="outlined"
					startIcon={<DeleteOutlineIcon />}
					sx={{
						color: '#EF4444',
						borderColor: '#FCA5A5',
						'&:hover': {
							backgroundColor: '#FEE2E2',
							borderColor: '#EF4444',
						},
					}}
				>
					삭제
				</Button>
			</Stack>
		</Box>
	);
}
