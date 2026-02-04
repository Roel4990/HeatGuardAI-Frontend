import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { ApiResult } from "@/app/api/api-response";
import { LoginResult } from "@/types/login/login";

export const useSignUpMutation = () => {
	return useMutation<
		ApiResult<LoginResult>,
		Error,
		{ user_nm: string; user_id: string; user_pw: string }
	>({
		mutationFn: async ({ user_nm, user_id, user_pw }) => {
			const { data } = await axios.post<ApiResult<LoginResult>>("/api/signup", {
				user_nm,
				user_id,
				user_pw,
			});
			return data;
		},
	});
};
