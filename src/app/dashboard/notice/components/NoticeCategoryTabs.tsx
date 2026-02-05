'use client';

import { JSX} from "react";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";

const categories = ['전체', '공지', '업데이트', '이벤트', '점검'] as const;
export type NoticeCategory = (typeof categories)[number];

interface Props {
	value: NoticeCategory;
	onChange: (value: NoticeCategory) => void;
}

export function NoticeCategoryToggle({value, onChange}: Props): JSX.Element {

	return (
		<Box>
			<ToggleButtonGroup
				value={value}
				exclusive
				onChange={(_, newValue) => {
					if (newValue !== null) {
						onChange(newValue);
					}
				}}
				sx={{
					gap: 1,
					'& .MuiToggleButtonGroup-grouped': {
						margin: 0,
						borderRadius: '999px',
						border: '1px solid #e0e0e0',

						'&.Mui-selected': {
							borderColor: 'transparent',
						},
					},
				}}
			>
				{categories.map((label) => (
					<ToggleButton
						key={label}
						value={label}
						sx={{
							px: 2,
							py: 0.6,
							borderRadius: '999px !important',
							border: '1px solid #e0e0e0',
							textTransform: 'none',
							fontWeight: 600,
							color: 'text.secondary',

							'&.Mui-selected': {
								background: 'linear-gradient(90deg, #27C1C3 0%, #4ED6B8 100%)',
								color: '#fff',
								borderColor: 'transparent',
							},

							'&.Mui-selected:hover': {
								background: 'linear-gradient(90deg, #22b0b2 0%, #43c5a8 100%)',
							},
						}}
					>
						{label}
					</ToggleButton>
				))}
			</ToggleButtonGroup>
		</Box>
	);
}
