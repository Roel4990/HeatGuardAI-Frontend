'use client';

import { useState } from 'react';
import {
	TextField,
	InputAdornment,
	IconButton,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { FogSelectDialog } from '@/app/dashboard/notice/create/components/FogSelectDialog';

export function NoticeFogSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
	const [open, setOpen] = useState(false);
	const [selectedFog, setSelectedFog] = useState<string>('');

	return (
		<>
			<TextField
				label="쿨링포그 위치 (선택)"
				fullWidth
				size="small"
				value={value}
				placeholder="클릭하여 쿨링포그 선택"
				InputProps={{
					readOnly: true,
					endAdornment: selectedFog ? (
						<InputAdornment position="end">
							<IconButton
								size="small"
								onClick={(e) => {
									e.stopPropagation();
									onChange('');
								}}
							>
								<ClearIcon fontSize="small" />
							</IconButton>
						</InputAdornment>
					) : null,
				}}
				onClick={() => setOpen(true)}
				sx={{
					cursor: 'pointer',
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

			<FogSelectDialog
				open={open}
				onClose={() => setOpen(false)}
				onSelect={(v) => {
					onChange(v);
					setOpen(false);
				}}
			/>
		</>
	);
}
