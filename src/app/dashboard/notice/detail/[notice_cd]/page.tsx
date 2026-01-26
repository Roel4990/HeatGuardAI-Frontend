'use client';

import * as React from 'react';
import { NoticeDetailLayout } from "@/app/dashboard/notice/detail/[notice_cd]/components/NoticeDetailLayout";
import type { NoticeDetail } from '@/types/notice/notice';
import { useState } from "react";

const mockNoticeDetail: NoticeDetail = {
	notice_cd: 'NC1234',
	notice_title: '열섬지수 데이터 실시간 모니터링 기능 추가',
	notice_type: '이벤트',
	create_dt: '2026-01-12',
	notice_fix_yn: true,

	user_cd: 'USER_001',
	user_nm: '관리자',

	notice_content: `실시간으로 도시 열섬 현상을 모니터링하고 분석할 수 있는 새로운 기능이 추가되었습니다.

## 새로운 기능

- 실시간 온도 분포 지도
- 열섬 강도 시각화
- 시간대별 변화 추이 그래프
- 알림 설정 기능

자세한 사용법은 첨부된 가이드를 참고해주세요.`,

	notice_file: {
		notice_file_cd: 1,
		notice_file_nm: 'guide123.pdf',
		notice_file_type: 'application/pdf',
		notice_file_size: 1024,
		notice_file_link: "~"
	},
};


export default function Page() {
	const [noticeDetail] = useState<NoticeDetail>(mockNoticeDetail);
	return <NoticeDetailLayout notice = {noticeDetail}/>;
}
