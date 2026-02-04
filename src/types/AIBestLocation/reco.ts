// app/dashboard/AIBestLocation/types/reco.ts

// -----------------------------
// Request (서버로 보내는 값)
// -----------------------------
export type RecoLocTypeCd = 1 | 2 | 3;

export type RecoRequestBody = {
  target_count: number;          // 1~5 (전송 전 clamp는 프론트에서)
  target_region_gu: string;      // 예: "성북구" (미선택이면 "")
  target_region_dong: string;    // 예: "돈암동" (미선택이면 "")
  reco_loc_type_cd: RecoLocTypeCd; // 1: 취약계층 / 2: 유동인구 / 3: 체감온도
};

// -----------------------------
// Response Item (result[] 원소)
// -----------------------------
export type RecoLocItem = {
  lat: number;                 // 위도
  lng: number;                 // 경도
  reco_loc_rank: number;       // 1,2,3...
  gee_loc_adress: string;      // 주소(서버 키 그대로 사용)
  float_popu: number;          // 유동인구
  reco_loc_risk: number;       // 취약성 지수
  reco_loc_tag?: string;       // "보행밀집" 등 (없을 수도 있음)
  reco_loc_desc?: string[];    // 추천 사유 리스트 (없을 수도 있음)
};

// -----------------------------
// Response (서버 응답 전체)
// -----------------------------
export type RecoApiResponse = {
  success: boolean;
  data?: {
    result_address: string;   // 예: "서울시 성북구 돈암동" or "전체 지역"
    result_count: number;     // result.length와 다를 수 있음(서버 정책)
    result: RecoLocItem[];    // 추천 리스트(순위 오름차순)
  };
  error?: string;
};
