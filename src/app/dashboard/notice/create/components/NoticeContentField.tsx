import { TextField } from '@mui/material';

export function NoticeContentField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
	return (
		<TextField
			label="내용"
			placeholder="공지사항 내용을 입력하세요"
      value={value}
      onChange={(e) => onChange(e.target.value)}
			multiline
			rows={10}
			fullWidth
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
		/>
	);
}
