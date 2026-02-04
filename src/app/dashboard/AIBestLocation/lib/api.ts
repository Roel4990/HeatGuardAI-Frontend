// app/dashboard/AIBestLocation/lib/api.ts
import type { RecoApiResponse, RecoRequestBody } from "../../../../types/AIBestLocation/reco";
import { MOCK_RECO_RESPONSE } from "@/app/dashboard/data/AIBestLocation/ai-best-location";

export async function postReco(body: RecoRequestBody): Promise<RecoApiResponse> {
  const gu = body.target_region_gu?.trim();
  const dong = body.target_region_dong?.trim();
  // ------------------------------------------
  // ✅ 실서버 연결 시 (여기만 교체하면 끝)
  // const res = await fetch("env파일에 저장하기 서버 주소", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(body),
  // });
  // return (await res.json()) as RecoApiResponse;
  // ------------------------------------------

  // ✅ 더미처럼 보이게 약간 지연
  await new Promise((r) => setTimeout(r, 2000));

  // ✅ 더미 응답 그대로 + result_address만 덮어쓰기
  // (자르기/변형 없음)
  const base = MOCK_RECO_RESPONSE;

  if (!base.success || !base.data) return base;

  // base.data는 그대로 두고 result_address만 변경 그런데 응답 데이터에 result_address을 주긴 함
  return {
    ...base,
    data: {
      ...base.data,
      result_address:
        gu && dong ? `서울시 ${gu} ${dong}` : gu ? `서울시 ${gu}` : "전체 지역",
      // result_count를 주는데 "배열 길이"로 더 정확하게 할 수 있다는 것
      result_count: base.data.result.length,
    },
  };
}
