import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { ApiResult } from "@/app/api/api-response";
import type { NoticeCreateRequest, NoticeCreateResult } from "@/app/api/noticeCreate/route";

export const useNoticeCreateMutation = () => {
	return useMutation<ApiResult<NoticeCreateResult>, Error, Omit<NoticeCreateRequest, "user_cd">>({
		mutationFn: async (payload) => {
			const token = localStorage.getItem("access_token");
			const user_cd = localStorage.getItem("user_cd");

			if (user_cd === null) {
				throw new Error("user_cd가 없습니다.");
			}

			const { data } = await axios.post<ApiResult<NoticeCreateResult>>(
				"/api/noticeCreate",
				{ ...payload, user_cd ,cf_cd: payload.cf_cd || null, notice_file_cd: payload.notice_file_cd ?? null,},
				{
					headers: token ? { Authorization: `Bearer ${token}` } : undefined,
				}
			);

			return data;
		},
	});
};
