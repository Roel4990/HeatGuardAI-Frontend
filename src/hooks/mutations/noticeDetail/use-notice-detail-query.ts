import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { ApiResult } from "@/app/api/api-response";
import type { NoticeDetail } from "@/types/notice/notice";

export const useNoticeDetailQuery = (notice_cd: string) =>
	useQuery<ApiResult<NoticeDetail>, Error>({
		queryKey: ["notice-detail", notice_cd],
		queryFn: async () => {
			const token = localStorage.getItem("access_token");
			const { data } = await axios.get<ApiResult<NoticeDetail>>("/api/noticeDetail", {
				params: { notice_cd },
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
			});
			return data;
		},
		enabled: !!notice_cd,
	});
