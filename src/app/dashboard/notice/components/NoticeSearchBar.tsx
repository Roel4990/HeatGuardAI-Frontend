'use client';

import { InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export function NoticeSearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
	return (
		<TextField
			fullWidth
			placeholder="공지사항 검색"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			size="small"
			InputProps={{
				startAdornment: (
					<InputAdornment position="start">
						<SearchIcon fontSize="small" />
					</InputAdornment>
				),
				sx: {
					padding: '5px 18px',
				},
			}}
			sx={{
				'& .MuiOutlinedInput-root': {
					borderRadius: '999px',
					backgroundColor: '#F9FAFB',
					transition: 'box-shadow 120ms ease, background-color 120ms ease',

					'& fieldset': {
						borderColor: '#e5e7eb',
					},

					'&:hover fieldset': {
						borderColor: '#4ED6B8',
					},

					'&.Mui-focused': {
						backgroundColor: '#fff',

						'& fieldset': {
							borderColor: 'transparent',
						},

						boxShadow:
							'0 0 0 2px rgba(39,193,195,0.35), ' +
							'inset 0 0 0 2px rgba(39,193,195,0)',

						'&:hover': {
							boxShadow:
								'0 0 0 2px rgba(39,193,195,0.45)',
						},
					},
				},
			}}
		/>
	);
}
