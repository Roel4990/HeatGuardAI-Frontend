import { TextField, MenuItem } from '@mui/material';

export const NOTICE_CATEGORIES = [
	{ value: '', label: '카테고리 선택' },
	{ value: '공지', label: '공지' },
	{ value: '업데이트', label: '업데이트' },
	{ value: '이벤트', label: '이벤트' },
	{ value: '점검', label: '점검' },
] as const;

export function NoticeCategorySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
	return (
		<TextField
			label="카테고리"
			select
			value={value}
			onChange={(e) => onChange(e.target.value)}
			fullWidth
			size="small"
			defaultValue=""
			sx={{
				'& .MuiOutlinedInput-root': {
					backgroundColor: '#fff',
					borderRadius: 1,
					'& fieldset': {
						borderColor: '#e5e7eb',
					},
					'&:hover fieldset': {
						borderColor: '#e5e8e8',
					},
					'&.Mui-focused fieldset': {
						borderColor: '#e5e8e8',
					},
				},
			}}
		>
			{NOTICE_CATEGORIES.map((category) => (
				<MenuItem key={category.value} value={category.value}>
					{category.label}
				</MenuItem>
			))}
		</TextField>
	);
}
