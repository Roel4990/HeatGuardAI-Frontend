// types/coolingfog.ts

export type FogItem = {
  code: string;          // 품목 코드
  name: string;          // 품목 명
  unitPrice: number;     // 단가
  elecMonthly: number;   // 월 전기세
  waterMonthly: number;  // 월 수도세
  imgUrl: string;        // 이미지 경로
  loc: string;           // 추천 설치
  link: string | null;   // 구매 링크
};
