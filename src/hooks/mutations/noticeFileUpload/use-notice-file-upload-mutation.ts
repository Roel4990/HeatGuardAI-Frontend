import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { ApiResult } from "@/app/api/api-response";
import type { NoticeFileUploadResult } from "@/app/api/noticeFileUpload/route";

export const useNoticeFileUploadMutation = () => {
	return useMutation<ApiResult<NoticeFileUploadResult>, Error, File>({
		mutationFn: async (file) => {
			const token = localStorage.getItem("access_token");
			const formData = new FormData();
			formData.append("file", file);

			const { data } = await axios.post<ApiResult<NoticeFileUploadResult>>(
				"/api/noticeFileUpload",
				formData,
				{ headers: token ? { Authorization: `Bearer ${token}` } : undefined }
			);
			return data;
		},
	});
};
