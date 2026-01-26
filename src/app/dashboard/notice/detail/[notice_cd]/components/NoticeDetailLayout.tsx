'use client';

import { Stack } from '@mui/material';
import { NoticeDetailHeader } from "@/app/dashboard/notice/detail/[notice_cd]/components/NoticeDetailHeader";
import { NoticeDetailMeta } from "@/app/dashboard/notice/detail/[notice_cd]/components/NoticeDetailMeta";
import { NoticeDetailContent } from "@/app/dashboard/notice/detail/[notice_cd]/components/NoticeDetailContent";
import { NoticeDetailAttachments } from "@/app/dashboard/notice/detail/[notice_cd]/components/NoticeDetailAttachments";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import type { NoticeDetail } from '@/types/notice/notice';

interface NoticeDetailLayoutProps {
	notice: NoticeDetail;
}

export function NoticeDetailLayout({ notice } : NoticeDetailLayoutProps) {
	return (
		<Box sx={{ minHeight: '100vh'}}>
			<Container maxWidth="lg">
				<NoticeDetailHeader />
				<Stack
					spacing={3}
					sx={{
						backgroundColor: '#f7f8fa',
						p: '30px',
						borderRadius: 1, // 16px
						mt: 3,
						border: 'none',
						boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
						transition: 'box-shadow 150ms ease, transform 150ms ease',
						'&:hover': {
							boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
						},
					}}
				>
					<NoticeDetailMeta create_at={notice.create_dt} notice_title={notice.notice_title} notice_type={notice.notice_type}/>
					<NoticeDetailContent content={notice.notice_content}/>
					{notice.notice_file && (
						<NoticeDetailAttachments file={notice.notice_file}/>
					)}
				</Stack>
			</Container>
		</Box>
	);
}
