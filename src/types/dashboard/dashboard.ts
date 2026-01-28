/**
 * 위험도 레벨
 */
export type RiskLevel = '위험' | '높음' | '보통';

/**
 * 폭염 취약 지역 리스트
 */
export interface HeatRiskRank {
	rank: number;
	district: string;
	score: number;
	level: RiskLevel;
	seniorRate: string;
	lowIncomeRate: string;
}

/**
 * 핫라인 담당자
 */
export interface HotLineContact {
	district: string;
	dong?: string;
	department: string;
	officer: string;
	phone: string;
}
