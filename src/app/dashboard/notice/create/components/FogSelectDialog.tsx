'use client';

import {
	Dialog,
	DialogTitle,
	DialogContent,
	Box,
	List,
	ListItemButton,
	Typography,
} from '@mui/material';
import { useState } from 'react';
import { FOG_AREAS } from "@/app/dashboard/notice/create/data/fog-data";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';

interface Props {
	open: boolean;
	onClose: () => void;
	onSelect: (value: string) => void;
}

export function FogSelectDialog({ open, onClose, onSelect }: Props) {
	const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
	const [selectedDong, setSelectedDong] = useState<string | null>(null);

	const districtData = FOG_AREAS.find(
		(d) => d.district === selectedDistrict
	);

	const dongData = districtData?.dongs.find(
		(d) => d.dong === selectedDong
	);

	return (
		<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
			<DialogTitle sx={{ p: 2 }}>
				<Box
					display="flex"
					alignItems="center"
					justifyContent="space-between"
				>
					<Typography variant="h6" fontWeight={700}>
						쿨링포그 위치 선택
					</Typography>

					<IconButton
						onClick={onClose}
						size="small"
						sx={{
							color: 'text.secondary',
						}}
					>
						<CloseIcon fontSize="small" />
					</IconButton>
				</Box>
			</DialogTitle>

			<DialogContent dividers>
				<Box display="flex" gap={2}>
					{/* 1️⃣ 구 */}
					<Box flex={1}>
						<Typography
							variant="subtitle1"
							sx={{
								textAlign: 'center',
								fontWeight: 700,
								color: '#27C1C3',
								mb: 1,
							}}
						>
							구
						</Typography>
						<Divider />
						<List
							dense
							sx={{
								maxHeight: 300,
								overflowY: 'auto',
							}}
						>
							{FOG_AREAS.map((area) => (
								<ListItemButton
									key={area.district}
									selected={area.district === selectedDistrict}
									onClick={() => {
										setSelectedDistrict(area.district);
										setSelectedDong(null);
									}}
								>
									{area.district}
								</ListItemButton>
							))}
						</List>
					</Box>

					{/* 2️⃣ 동 */}
					<Box flex={1}>
						<Typography
							variant="subtitle1"
							sx={{
								textAlign: 'center',
								fontWeight: 700,
								color: '#27C1C3',
								mb: 1,
							}}
						>
							동
						</Typography>
						<Divider />
						<List dense>
							{districtData?.dongs.map((dong) => (
								<ListItemButton
									key={dong.dong}
									selected={dong.dong === selectedDong}
									onClick={() => setSelectedDong(dong.dong)}
								>
									{dong.dong}
								</ListItemButton>
							)) ?? (
								<Typography variant="caption" color="text.secondary">
									구를 선택하세요
								</Typography>
							)}
						</List>
					</Box>

					{/* 3️⃣ 쿨링포그 */}
					<Box flex={1}>
						<Typography
							variant="subtitle1"
							sx={{
								textAlign: 'center',
								fontWeight: 700,
								color: '#27C1C3',
								mb: 1,
							}}
						>
							쿨링포그
						</Typography>
						<Divider />
						<List
							dense
							sx={{
								maxHeight: 300,
								overflowY: 'auto',
							}}
						>
							{dongData?.fogs.map((fog) => (
								<ListItemButton
									key={fog}
									onClick={() =>
										onSelect(
											`${selectedDistrict} ${selectedDong} · ${fog}`
										)
									}
									sx={{
										borderRadius: 1,
										'&:hover': {
											backgroundColor: 'rgba(39,193,195,0.08)',
										},
									}}
								>
									{fog}
								</ListItemButton>
							)) ?? (
								<Typography variant="caption" color="text.secondary">
									동을 선택하세요
								</Typography>
							)}
						</List>
					</Box>
				</Box>
			</DialogContent>
		</Dialog>
	);
}
