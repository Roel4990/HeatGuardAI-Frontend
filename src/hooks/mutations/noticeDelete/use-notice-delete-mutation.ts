import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { ApiResult } from "@/app/api/api-response";

export const useNoticeDeleteMutation = () => {
	return useMutation<ApiResult<null>, Error, { notice_cd: string }>({
		mutationFn: async ({ notice_cd }) => {
			const token = localStorage.getItem("access_token");
			const { data } = await axios.delete<ApiResult<null>>("/api/noticeDelete", {
				params: { notice_cd },
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
			});
			return data;
		},
	});
};
