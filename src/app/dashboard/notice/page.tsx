'use client';

import * as React from 'react';
import { Box, Container } from '@mui/material';
import { NoticeCategoryToggle } from "@/app/dashboard/notice/components/NoticeCategoryTabs";
import { NoticeSearchBar } from "@/app/dashboard/notice/components/NoticeSearchBar";
import { NoticeHeader } from "@/app/dashboard/notice/components/NoticeHeader";
import { NoticeList } from "@/app/dashboard/notice/components/NoticeList";

export default function NoticePage() {
	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<NoticeHeader />
			<Box mt={3}>
				<NoticeSearchBar />
			</Box>
			<Box mt={2}>
				<NoticeCategoryToggle />
			</Box>
			<Box mt={3}>
				<NoticeList />
			</Box>
		</Container>
	);
}
