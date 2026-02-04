// app/dashboard/AIBestLocation/data/ai-best-location.ts
import type { RecoApiResponse } from "../../../../types/AIBestLocation/reco";

/**
 * ✅ AI 최적 위치 추천 더미데이터
 */
export const MOCK_RECO_RESPONSE: RecoApiResponse = {
  success: true,
  data: {
    result_address: "", // ✅ api.ts에서 요청값으로 만들어서 덮어씀
    result_count: 3,    // ✅ 필요하면 여기 숫자만 바꿔도 됨(또는 api.ts에서 length로 덮어써도 됨)
    result: [
      {
        lat: 37.596_123,
        lng: 127.013_456,
        reco_loc_rank: 1,
        gee_loc_adress: "서울특별시 성북구 돈암동 샘플주소 1",
        float_popu: 18_304,
        reco_loc_risk: 87,
        reco_loc_tag: "보행밀집",
        reco_loc_desc: [
          "노인 밀집도 상위 10%",
          "기존 쿨링시설 공백 지역",
          "유동인구 일평균 15000명 이상",
          "열섬현상 고위험 지역 UHI 지수 3.8도",
        ],
      },
      {
        lat: 37.594_888,
        lng: 127.011_111,
        reco_loc_rank: 2,
        gee_loc_adress: "서울특별시 성북구 돈암동 샘플주소 2",
        float_popu: 15_320,
        reco_loc_risk: 81,
        reco_loc_tag: "주거밀집",
        reco_loc_desc: ["취약계층 밀집 구역", "그늘/쉼터 부족", "기존 시설과 접근성 낮음"],
      },
      {
        lat: 37.593_333,
        lng: 127.017_777,
        reco_loc_rank: 3,
        gee_loc_adress: "서울특별시 성북구 돈암동 샘플주소 3",
        float_popu: 12_890,
        reco_loc_risk: 76,
        reco_loc_tag: "상업밀집",
        reco_loc_desc: ["유동 인구 집중 구간", "체감 온도 상승 구역"],
      },
      {
        lat: 37.5967,
        lng: 127.0236,
        reco_loc_rank: 4,
        gee_loc_adress: "서울특별시 성북구 돈암동 샘플주소 4",
        float_popu: 24_568,
        reco_loc_risk: 57,
        reco_loc_tag: "상업밀집",
        reco_loc_desc: [],
      },
    ],
  },
};
