'use client';

import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import CloudIcon from '@mui/icons-material/Cloud';
import { paths } from "@/paths";

export function NoticeHeader() {
	const router = useRouter();
	return (
		<Box display="flex" justifyContent="space-between" alignItems="center">
			<Box
				display="flex"
				alignItems="center"
				justifyContent="space-between"
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
					<DeviceThermostatIcon fontSize="small" />
					<CloudIcon fontSize="small" />
				</Box>
				<Box sx={{ ml: 2 }}>
					<Typography variant="h4" fontWeight={700}>
						공지사항
					</Typography>
					<Typography variant="body2" color="text.secondary">
						열심지수 쿨링포그 AI 시스템 소식입니다.
					</Typography>
				</Box>
			</Box>
			{/* eslint-disable-next-line unicorn/prefer-global-this*/}
			{typeof window === "object" && localStorage.getItem("user_auth") !== "user" && (
			<Button
				startIcon={<AddIcon />}
				onClick={() => router.push(paths.dashboard.noticeCreate)}
				sx={{
					px: 3,
					py: 1.2,
					borderRadius: '999px',
					color: '#fff',
					fontWeight: 600,
					fontSize: '0.95rem',
					background: 'linear-gradient(90deg, #27C1C3 0%, #4ED6B8 100%)',
					boxShadow: '0 6px 16px rgba(39, 193, 195, 0.35)',
					textTransform: 'none',

					'&:hover': {
						background: 'linear-gradient(90deg, #22b0b2 0%, #43c5a8 100%)',
						boxShadow: '0 8px 20px rgba(39, 193, 195, 0.5)',
					},
				}}
			>
				공지사항 작성
			</Button>
				)}
		</Box>
	);
}
