import { Checkbox, FormControlLabel } from '@mui/material';

export function NoticePinCheckbox({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
	return (
		<FormControlLabel
			control={
				<Checkbox
					checked={checked}
					onChange={(e) => onChange(e.target.checked)}
					sx={{
						color: '#9CA3AF', // 기본 아이콘 색
						'&.Mui-checked': {
							color: '#4ED6B8',
						},
						'&:hover': {
							backgroundColor: 'rgba(78, 214, 184, 0.08)',
						},
					}}
				/>
			}
			label="상단 고정"
			sx={{
				ml: 0,
				'& .MuiFormControlLabel-label': {
					fontSize: 14,
					fontWeight: 500,
					color: '#374151',
				},
			}}
		/>
	);
}

