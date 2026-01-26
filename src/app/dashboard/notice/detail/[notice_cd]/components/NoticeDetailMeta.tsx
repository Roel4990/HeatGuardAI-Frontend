'use client';

import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import type { NoticeType } from "@/types/notice/notice";

const noticeTypeStyles: Record<NoticeType, { bg: string; fg: string }> = {
	공지: { bg: "#17AACF", fg: "#ffffff" },
	업데이트: { bg: "#318CE8", fg: "#ffffff" },
	점검: { bg: "#EDF1F3", fg: "#1f2933" },
	이벤트: { bg: "#F59F0A", fg: "#ffffff" },
};

interface NoticeDetailProps {
	create_at: string;
	notice_title: string;
	notice_type: NoticeType;
}

export function NoticeDetailMeta({create_at, notice_title, notice_type}: NoticeDetailProps) {
	return (
		<Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
			<Stack spacing={1.5}>
				<Box display="flex" alignItems="center" gap={1}>
					<Chip
						label={notice_type}
						size="small"
						sx={{
							bgcolor: noticeTypeStyles[notice_type].bg,
							color: noticeTypeStyles[notice_type].fg,
							fontWeight: 700,
						}}
					/>
					<Box display="flex" alignItems="center" gap={0.5}>
						<CalendarTodayOutlinedIcon
							sx={{
								fontSize: 14,
								color: 'text.secondary',
							}}
						/>
						<Typography variant="caption" color="text.secondary">
							{create_at}
						</Typography>
					</Box>
				</Box>

				<Typography variant="h6" fontWeight={700}>
					{notice_title}
				</Typography>
			</Stack>
		</Paper>
	);
}
