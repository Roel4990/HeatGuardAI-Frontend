'use client';

import { Stack} from '@mui/material';
import { Notice } from "@/types/notice/notice";
import { NoticeItem } from './NoticeItem';
import * as React from "react";
import { useNoticeListMutation } from "@/hooks/mutations/noticeList/use-notice-list-mutation";
import type { NoticeCategory } from "@/app/dashboard/notice/components/NoticeCategoryTabs";


// 초기 공지사항 데이터입니다.
/*const initialNotices: Notice[] = [
	{
		notice_cd: "N1235",
		notice_title: '열섬지수 데이터 실시간 모니터링 기능 추가',
		notice_type: "공지",
		create_dt: "2025-01-12",
		notice_fix_yn: true,
	},
	{
		notice_cd: "N1236",
		notice_title: '역삼동386-2 쿨링포그 점검안내',
		notice_type: "점검",
		create_dt: "2025-01-11",
		notice_fix_yn: true,
	},
	{
		notice_cd: "N1237",
		notice_title: '클리핑 AI 추천 알고리즘 개선',
		notice_type: "업데이트",
		create_dt: "2025-01-08",
		notice_fix_yn: false,
	},
	{
		notice_cd: "N1238",
		notice_title: '스마트 쿨링 이벤트 참여 안내',
		notice_type: "이벤트",
		create_dt: "2025-01-05",
		notice_fix_yn: false,
	},
];*/

export function NoticeList({ category, keyword }: { category: NoticeCategory; keyword: string }) {
	const [notices, setNotices] = React.useState<Notice[]>([]);
	const { mutateAsync} = useNoticeListMutation();

	const filteredNotices = notices.filter((notice) =>
		notice.notice_title.toLowerCase().includes(keyword.trim().toLowerCase())
	);


	React.useEffect(() => {
		const fetchList = async () => {
			const notice_type = category === '전체' ? undefined : category;
			const result = await mutateAsync({ notice_type, limit_count: undefined });
			if (result.success && result.data) {
				setNotices(result.data.notice_list);
			}
		};
		fetchList().catch(() => {
			// noop
		});
	}, [category, mutateAsync]);

	const sortednotices = [...filteredNotices].sort((a, b) => {
		if (a.notice_fix_yn === b.notice_fix_yn) return 0;
		return a.notice_fix_yn ? -1 : 1; // true가 위로
	});

	return (
		<Stack spacing={1.5}>
			{sortednotices.map((notice) => (
				<NoticeItem
					key={notice.notice_cd}
					noticeCd={notice.notice_cd}
					type={notice.notice_type}
					date={notice.create_date}
					title={notice.notice_title}
					pinned={notice.notice_fix_yn}
				/>
			))}
		</Stack>
	);
}
