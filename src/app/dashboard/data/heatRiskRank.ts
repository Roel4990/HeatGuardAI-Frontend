import { HeatRiskRank } from "@/types/dashboard/dashboard";

export const HEAT_RISK_ROWS: HeatRiskRank[] = [
	{ rank: 1, district: '강남구', score: 92, level: '위험', seniorRate: '18.5%', lowIncomeRate: '12.3%' },
	{ rank: 2, district: '종로구', score: 88, level: '위험', seniorRate: '22.1%', lowIncomeRate: '15.8%' },
	{ rank: 3, district: '중구', score: 85, level: '위험', seniorRate: '20.4%', lowIncomeRate: '14.2%' },
	{ rank: 4, district: '성동구', score: 81, level: '높음', seniorRate: '17.8%', lowIncomeRate: '16.5%' },
	{ rank: 5, district: '동대문구', score: 78, level: '높음', seniorRate: '19.2%', lowIncomeRate: '13.7%' },
	{ rank: 6, district: '마포구', score: 75, level: '높음', seniorRate: '16.3%', lowIncomeRate: '11.9%' },
	{ rank: 7, district: '서대문구', score: 72, level: '보통', seniorRate: '18.9%', lowIncomeRate: '12.8%' },
	{ rank: 8, district: '용산구', score: 69, level: '보통', seniorRate: '15.7%', lowIncomeRate: '10.4%' },
];
