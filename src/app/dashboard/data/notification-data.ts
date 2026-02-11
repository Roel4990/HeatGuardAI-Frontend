import { BaseNotice } from "@/types/notice/notice";


export const DUMMY_NOTICES: BaseNotice[] = [
	{
		notice_cd: 'N20240701',
		notice_title: '폭염 경보 단계 상향 안내',
		notice_type: '공지',
		create_date: '2024-07-01',
	},
	{
		notice_cd: 'N20240628',
		notice_title: '쿨링포그 제어 시스템 업데이트',
		notice_type: '업데이트',
		create_date: '2024-06-28',
	},
	{
		notice_cd: 'N20240625',
		notice_title: '강남구 쿨링포그 정기 점검 일정',
		notice_type: '점검',
		create_date: '2024-06-25',
	},
	{
		notice_cd: 'N20240620',
		notice_title: '여름철 폭염 대응 시민 참여 이벤트',
		notice_type: '이벤트',
		create_date: '2024-06-20',
	},
	{
		notice_cd: 'N20240615',
		notice_title: '시스템 안정화 관련 공지',
		notice_type: '공지',
		create_date: '2024-06-15',
	},
];
