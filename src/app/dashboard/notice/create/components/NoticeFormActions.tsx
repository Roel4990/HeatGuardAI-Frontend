import { Box, Button } from '@mui/material';

export function NoticeFormActions({ onCancel, onSubmit, submitting, }: {
	onCancel: () => void;
	onSubmit: () => void;
	submitting?: boolean;	}) {
	return (
		<Box display="flex" justifyContent="space-between">
			<Button variant="outlined" color="secondary" onClick={onCancel}>취소</Button>
			<Button
				variant="contained"
				onClick={onSubmit}
				disabled={submitting}
				sx={{
					background: 'linear-gradient(90deg, #27C1C3 0%, #4ED6B8 100%)',
					px: 4,
					borderRadius: '999px',
				}}
			>
				등록하기
			</Button>
		</Box>
	);
}
