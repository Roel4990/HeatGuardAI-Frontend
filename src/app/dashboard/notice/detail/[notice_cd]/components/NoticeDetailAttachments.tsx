'use client';

import {
	Box,
	IconButton,
	Paper,
	Stack,
	Typography,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { NoticeFile } from "@/types/notice/notice";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';

interface NoticeDetailAttachmentsProps {
	file: NoticeFile;
}

export function NoticeDetailAttachments({ file }: NoticeDetailAttachmentsProps) {
	return (
		<Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
			<Stack spacing={1.5}>
				<Box display="flex" alignItems="center" gap={0.75}>
					<AttachFileIcon
						sx={{
							fontSize: 18,
							color: 'text.secondary',
						}}
					/>
					<Typography fontWeight={600}>
						첨부파일 (1)
					</Typography>
				</Box>

				<Box
					display="flex"
					alignItems="center"
					justifyContent="space-between"
					sx={{
						p: 2,
						borderRadius: 1,
						border: '1px solid #E5E7EB',
						backgroundColor: '#F9FAFB',
					}}
				>
					<Box display="flex" alignItems="center" gap={1}>
						{file.notice_file_type === "application/pdf" ? (
							<PictureAsPdfIcon color="action" />
						) : file.notice_file_type?.startsWith("image/") ? (
							<ImageIcon color="action" />
						) : (
							<DescriptionIcon color="action" />
						)}
						<Box>
							<Typography fontSize={14}>
								{file.notice_file_nm}
							</Typography>
							<Typography fontSize={12} color="text.secondary">
								{(file.notice_file_size / 1024).toFixed(1)} KB
							</Typography>
						</Box>
					</Box>

					<IconButton>
						<DownloadIcon
							onClick={async () => {
								const url = file.notice_file_save_path;
								if (!url) return;

								const res = await fetch(url);
								const blob = await res.blob();

								const a = document.createElement("a");
								a.href = URL.createObjectURL(blob);
								a.download = file.notice_file_nm;
								a.click();

								URL.revokeObjectURL(a.href);
							}}
						/>
					</IconButton>
				</Box>
			</Stack>
		</Paper>
	);
}
