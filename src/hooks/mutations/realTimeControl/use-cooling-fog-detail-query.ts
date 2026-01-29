import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { ApiResult } from "@/app/api/api-response";
import type { CoolingFogDetailData } from "@/types/realTimeControl/real-time-control";

export const useCoolingFogDetailMutation = () => {
  return useMutation<ApiResult<CoolingFogDetailData>, Error, string>({
    mutationFn: async (cfCd: string) => {
      if (!cfCd) {
        throw new Error("쿨링포그 아이디가 필요합니다.");
      }
      const { data } = await axios.get<ApiResult<CoolingFogDetailData>>(
        `/api/realTimeControl/${cfCd}`
      );
      return data;
    },
    onMutate: () => {
      console.log("쿨링포그 상세 요청 시작");
    },
    onError: (error) => {
      console.error("쿨링포그 상세 요청 오류:", error);
    },
  });
};
