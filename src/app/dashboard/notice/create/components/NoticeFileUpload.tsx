'use client';

import { useRef, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CloseIcon from '@mui/icons-material/Close';
import { useNoticeFileUploadMutation } from "@/hooks/mutations/noticeFileUpload/use-notice-file-upload-mutation";

const ACCEPTED_TYPES = new Set(['image/png', 'image/jpeg', 'application/pdf']);

export function NoticeFileUpload({ onUploaded }: { onUploaded: (fileCd: number | null) => void }) {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [isDragOver, setIsDragOver] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const { mutateAsync } = useNoticeFileUploadMutation();

	const handleFile = async(newFile: File | null) => {
		if (!newFile) return;

		if (!ACCEPTED_TYPES.has(newFile.type)) {
			alert('PNG, JPG, PDF 파일만 업로드할 수 있습니다.');
			return;
		}

		setFile(newFile);

		const result = await mutateAsync(newFile);
		if (result.success && result.data) {
			onUploaded(result.data.notice_file_cd);
		} else {
			alert(result.error ?? "파일 업로드 실패");
			onUploaded(null);
		}
	};

	const clearFile = () => {
		setFile(null);
		onUploaded(null);
		if (inputRef.current) inputRef.current.value = '';
	};

	return (
		<>
			{/* hidden input */}
			<input
				ref={inputRef}
				type="file"
				hidden
				accept=".png,.jpg,.jpeg,.pdf"
				onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
			/>

			{/* upload box */}
			<Box
				onClick={() => inputRef.current?.click()}
				onDragOver={(e) => {
					e.preventDefault();
					setIsDragOver(true);
				}}
				onDragLeave={() => setIsDragOver(false)}
				onDrop={(e) => {
					e.preventDefault();
					setIsDragOver(false);
					handleFile(e.dataTransfer.files?.[0] ?? null);
				}}
				sx={{
					border: '1px dashed',
					borderColor: isDragOver ? '#27C1C3' : '#d0d7de',
					borderRadius: 2,
					p: 3,
					textAlign: 'center',
					cursor: 'pointer',
					backgroundColor: isDragOver ? 'rgba(39,193,195,0.06)' : '#fff',
					transition: 'border-color 120ms ease, background-color 120ms ease',
				}}
			>
				<CloudUploadIcon
					sx={{
						fontSize: 32,
						mb: 1,
						color: isDragOver ? '#27C1C3' : 'text.secondary',
					}}
				/>

				<Typography variant="body2" fontWeight={600}>
					파일을 드래그하거나 클릭하여 업로드
				</Typography>

				<Typography variant="caption" color="text.secondary">
					PNG, JPG, PDF 파일 1개만 업로드 가능
				</Typography>
			</Box>

			{/* preview */}
			{file && (
				<Box
					sx={{
						mt: 2,
						p: 1.5,
						border: '1px solid #e5e7eb',
						borderRadius: 2,
						display: 'flex',
						alignItems: 'center',
						gap: 1.5,
						backgroundColor: '#fff',
					}}
				>
					{/* 이미지 미리보기 */}
					{file.type.startsWith('image/') ? (
						<Box
							component="img"
							src={URL.createObjectURL(file)}
							alt="preview"
							sx={{
								width: 48,
								height: 48,
								objectFit: 'cover',
								borderRadius: 1,
								border: '1px solid #e5e7eb',
							}}
						/>
					) : (
						<PictureAsPdfIcon sx={{ fontSize: 40, color: '#d32f2f' }} />
					)}

					<Box flex={1} minWidth={0}>
						<Typography variant="body2" noWrap>
							{file.name}
						</Typography>
						<Typography variant="caption" color="text.secondary">
							{(file.size / 1024 / 1024).toFixed(2)} MB
						</Typography>
					</Box>

					<IconButton size="small" onClick={clearFile}>
						<CloseIcon fontSize="small" />
					</IconButton>
				</Box>
			)}
		</>
	);
}
