'use client';

import * as React from 'react';
import { Box, Container } from '@mui/material';
import { NoticeCategoryToggle, type NoticeCategory } from "@/app/dashboard/notice/components/NoticeCategoryTabs";
import { NoticeSearchBar } from "@/app/dashboard/notice/components/NoticeSearchBar";
import { NoticeHeader } from "@/app/dashboard/notice/components/NoticeHeader";
import { NoticeList } from "@/app/dashboard/notice/components/NoticeList";

export default function NoticePage() {
	const [category, setCategory] = React.useState<NoticeCategory>('전체');
	const [keyword, setKeyword] = React.useState('');

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<NoticeHeader />
			<Box mt={3}>
				<NoticeSearchBar value={keyword} onChange={setKeyword} />
			</Box>
			<Box mt={2}>
				<NoticeCategoryToggle  value={category} onChange={setCategory} />
			</Box>
			<Box mt={3}>
				<NoticeList category={category} keyword={keyword} />
			</Box>
		</Container>
	);
}
