import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { ApiResult } from "@/app/api/api-response";
import type { Notice } from "@/types/notice/notice";
import type { NoticeListResult } from "@/app/api/noticeList/route";

const token = localStorage.getItem("access_token");

export const useNoticeListMutation = () => {
	return useMutation<
		ApiResult<NoticeListResult>,
		Error,
		{ notice_type?: Notice["notice_type"]; limit_count?: number | null }
	>({
		mutationFn: async ({ notice_type, limit_count }) => {
			const { data } = await axios.get<ApiResult<NoticeListResult>>("/api/noticeList", {
				params: {
					notice_type: notice_type ?? null,
					limit_count: limit_count ?? null,
				},
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
			});
			return data;
		},

		onMutate: () => {
			console.log("공지 목록 요청 시작");
		},

		onError: (error) => {
			console.error("공지 목록 조회 중 오류:", error);
		},
	});
};
