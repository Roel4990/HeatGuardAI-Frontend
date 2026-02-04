import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { ApiResult } from "@/app/api/api-response";
import { EmailCheckResult } from "@/types/email-check/email-check";

export const useEmailCheckMutation = () => {
	return useMutation<ApiResult<EmailCheckResult>, Error, { user_id: string }>({
		mutationFn: async ({ user_id }) => {
			const { data } = await axios.get<ApiResult<EmailCheckResult>>("/api/emailCheck", {
				params: { user_id },
			});
			return data;
		},
	});
};
