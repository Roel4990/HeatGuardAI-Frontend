import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { ApiResult } from "@/app/api/api-response";
import type { CoolingFogListData } from "@/types/realTimeControl/real-time-control";

export const useCoolingFogListMutation = () => {
  return useMutation<ApiResult<CoolingFogListData>, Error, void>({
    mutationFn: async () => {
			const token = localStorage.getItem("access_token");
      const { data } = await axios.get<ApiResult<CoolingFogListData>>(
        "/api/realTimeControl/list", {
					headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				}
      );
      return data;
    },
    onMutate: () => {
      console.log("쿨링포그 목록 요청 시작");
    },
    onError: (error) => {
      console.error("쿨링포그 목록 요청 오류:", error);
    },
  });
};
