import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { ApiResult } from "@/app/api/api-response";
import { LoginResult } from "@/types/login/login";
import axios from "axios";

export const useLoginMutation = () => {
    const router = useRouter();
    return useMutation<
        ApiResult<LoginResult>,
        Error,
        { email: string; password: string }
    >({
        mutationFn: async ({email, password}) => {
						const {data} = await axios.post<ApiResult<LoginResult>>("/api/login", {
								email,
								password
						});
						return data
				},

        onMutate: () => {
            console.log("로그인 요청 시작");
        },

        onSuccess: (data) => {
            if (data.success && data.data) {
                router.push("/");
								// todo: 성공 시 데이터 처리
            } else {
                alert(data.error ?? "로그인 실패");
            }
        },

        onError: (error) => {
            console.error("로그인 중 오류:", error);
        },
    });
};
