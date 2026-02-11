'use client';

import { useState } from 'react';
import {
	TextField,
	InputAdornment,
	IconButton,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { FogSelectDialog } from '@/app/dashboard/notice/create/components/FogSelectDialog';

export function NoticeFogSelect({ value, onChange }: { value:  { cf_cd: string; label: string } | null; onChange: (v: { cf_cd: string; label: string } | null) => void;}) {
	const [open, setOpen] = useState(false);


	return (
		<>
			<TextField
				label="쿨링포그 위치 (선택)"
				fullWidth
				size="small"
				value={value?.label ?? ''}
				placeholder="클릭하여 쿨링포그 선택"
				InputProps={{
					readOnly: true,
					endAdornment:  value ? (
						<InputAdornment position="end">
							<IconButton
								size="small"
								onClick={(e) => {
									e.stopPropagation();
									onChange(null);
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
