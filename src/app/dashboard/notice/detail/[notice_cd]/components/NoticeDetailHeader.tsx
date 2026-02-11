'use client';

import { Box } from '@mui/material';
import { useRouter, useParams } from "next/navigation";
import Button from "@mui/material/Button";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Stack from "@mui/material/Stack";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useNoticeDeleteMutation } from "@/hooks/mutations/noticeDelete/use-notice-delete-mutation";

export function NoticeDetailHeader() {
	const router = useRouter();

	const { notice_cd } = useParams<{ notice_cd: string }>();
	const { mutateAsync } = useNoticeDeleteMutation();

	const handleDelete = async () => {
		if (!confirm("삭제하시겠습니까?")) return;
		const result = await mutateAsync({ notice_cd });
		if (result.success) {
			router.push("/dashboard/notice");
		} else {
			alert(result.error ?? "삭제 실패");
		}
	};

	return (
		<Box display="flex" justifyContent="space-between" alignItems="center">
			<Button
				startIcon={<ChevronLeftIcon />}
				sx={{ color: 'text.secondary' }}
				onClick={() => {
					router.back();
				}}
			>
				목록으로 돌아가기
			</Button>

			<Stack direction="row" spacing={1}>
				<Button
					variant="outlined"
					startIcon={<DeleteOutlineIcon />}
					onClick={handleDelete}
					sx={{
						color: '#EF4444',
						borderColor: '#FCA5A5',
						'&:hover': {
							backgroundColor: '#FEE2E2',
							borderColor: '#EF4444',
						},
					}}
				>
					삭제
				</Button>
			</Stack>
		</Box>
	);
}
