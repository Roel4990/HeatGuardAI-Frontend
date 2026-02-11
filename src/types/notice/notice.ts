/**
 * 공지 유형 (고정)
 */
export type NoticeType = "공지" | "점검" | "업데이트" | "이벤트";

/**
 * 공통 공지사항 속성
 */
export interface BaseNotice {
	notice_cd: string;
	notice_title: string;
	notice_type: NoticeType;
	create_date: string;
}

/**
 * 목록에 표시될 공지사항 타입 (고정 여부 필수)
 */
export interface Notice extends BaseNotice {
	notice_fix_yn: boolean;
}

/**
 * 공지사항 파일 타입
 */
export interface NoticeFile {
	notice_file_cd: number;
	notice_file_nm: string;
	notice_file_type: string;
	notice_file_size: number;
	notice_file_save_path: string
}

/**
 * 상세 페이지에 표시될 공지사항 타입 (고정 여부 선택)
 */
export interface NoticeDetail extends BaseNotice {
	notice_fix_yn?: boolean;
	user_cd: string;
	user_nm: string;
	notice_content: string;
	notice_file?: NoticeFile;
	cf_location?: string
}

/**
 * 공지사항 타입 별 색상 정리
 */
export const noticeTypeStyles: Record<
	NoticeType,
	{ bg: string; fg: string }
> = {
	공지: { bg: '#17AACF', fg: '#ffffff' },
	업데이트: { bg: '#318CE8', fg: '#ffffff' },
	점검: { bg: '#C52A0A', fg: '#ffffff' },
	이벤트: { bg: '#F59F0A', fg: '#ffffff' },
};
