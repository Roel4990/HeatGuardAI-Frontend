// app/dashboard/AIBestLocation/data/ai-best-location.ts
import type { RecoApiResponse } from "@/types/AIBestLocation/reco";

/**
 * ✅ AI 최적 위치 추천 더미데이터
 */
export const MOCK_RECO_RESPONSE: RecoApiResponse = {
  "success": true,
  "data": {
    "result_address": "서울특별시 강남구",
    "result_count": 5,
    "result": [
      {
        "lat": 37.485_878,
        "lng": 127.103_977,
        "reco_loc_rank": 1,
        "gee_address_full": "서울특별시 강남구 밤고개로",
        "reco_loc_popu_level": "많음",
        "reco_loc_vulnerable_level": "높음",
        "reco_loc_feel_temp": 31.4,
        "reco_loc_lst_level": "높음",
        "reco_loc_ndvi_level": "낮음",
        "reco_loc_total_score": 100,
        "reco_loc_desc": [
          "체감온도가 서울 평균보다 매우 높아 야외 활동 시 더위로 인한 불편이 크게 나타납니다.",
          "유동인구가 많은 특성상 더위에 노출되는 사람들이 지속적으로 이동하는 환경입니다.",
          "폭염 시 이동이 잦은 보행자들에게 쿨링포그 설치가 실질적인 더위 완화 효과를 제공합니다."
        ]
      },
      {
        "lat": 37.467_342,
        "lng": 127.101_282,
        "reco_loc_rank": 8,
        "gee_address_full": "서울특별시 강남구",
        "reco_loc_popu_level": "적음",
        "reco_loc_vulnerable_level": "높음",
        "reco_loc_feel_temp": 31.2,
        "reco_loc_lst_level": "보통",
        "reco_loc_ndvi_level": "낮음",
        "reco_loc_total_score": 97,
        "reco_loc_desc": [
          "체감온도가 서울 평균에 비해 매우 높게 나타납니다.",
          "취약계층의 밀도가 상위 10%에 해당할 정도로 높아 건강 관리가 더욱 중요합니다.",
          "폭염 시 취약계층이 외부 활동 중 쿨링포그의 도움을 직접적으로 받을 수 있다는 점에서 설치가 필요합니다."
        ]
      },
      {
        "lat": 37.465_203,
        "lng": 127.102_181,
        "reco_loc_rank": 10,
        "gee_address_full": "서울특별시 강남구",
        "reco_loc_popu_level": "많음",
        "reco_loc_vulnerable_level": "높음",
        "reco_loc_feel_temp": 31.2,
        "reco_loc_lst_level": "보통",
        "reco_loc_ndvi_level": "보통",
        "reco_loc_total_score": 97,
        "reco_loc_desc": [
          "체감온도가 매우 높고 유동인구가 많은 특성이 나타납니다.",
          "폭염 시 취약계층의 밀도가 높아 건강 위험이 상대적으로 크게 우려됩니다.",
          "보행자와 취약계층이 야외에서 머무를 때 더위로 인한 부담을 줄이는 데 효과적입니다."
        ]
      },
      {
        "lat": 37.487_303,
        "lng": 127.100_384,
        "reco_loc_rank": 11,
        "gee_address_full": "서울특별시 강남구",
        "reco_loc_popu_level": "많음",
        "reco_loc_vulnerable_level": "높음",
        "reco_loc_feel_temp": 31.4,
        "reco_loc_lst_level": "보통",
        "reco_loc_ndvi_level": "보통",
        "reco_loc_total_score": 96,
        "reco_loc_desc": [
          "체감온도가 서울 평균보다 매우 높아 무더위에 취약한 환경을 보입니다.",
          "유동인구가 많은 곳으로",
          "다수의 보행자와 주민이 야외 활동 중 더위로 인한 불편을 경험할 수 있습니다.",
          "폭염 시 무더위에 장시간 노출되는 보행자의 건강 보호에 쿨링포그가 실질적인 도움을 줄 수 있습니다."
        ]
      },
      {
        "lat": 37.484_452,
        "lng": 127.103_977,
        "reco_loc_rank": 14,
        "gee_address_full": "서울특별시 강남구",
        "reco_loc_popu_level": "많음",
        "reco_loc_vulnerable_level": "높음",
        "reco_loc_feel_temp": 31.4,
        "reco_loc_lst_level": "보통",
        "reco_loc_ndvi_level": "보통",
        "reco_loc_total_score": 96,
        "reco_loc_desc": [
          "체감온도가 매우 높은 편으로",
          "더위에 민감한 환경이 형성되어 있습니다.",
          "취약계층의 밀도가 높아 더위로 인한 건강 위험이 클 수 있습니다.",
          "폭염 시 취약계층의 안전을 보호하는 데 쿨링포그 설치가 실질적인 도움이 됩니다."
        ]
      }
    ]
  },
  "error": null
};


