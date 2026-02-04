import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { ApiResult } from "@/app/api/api-response";
import { LoginResult } from "@/types/login/login";
import axios from "axios";
import { useUser } from "@/hooks/use-user";

export const useLoginMutation = () => {
    const router = useRouter();
    const { checkSession } = useUser();
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
                try {
                    localStorage.setItem("access_token", data.data.access_token);
                    localStorage.setItem("user_auth", data.data.user_auth);
                    localStorage.setItem("user_nm", data.data.user_nm);
                    localStorage.setItem("user_email", data.data.user_email);
										localStorage.setItem("user_cd", data.data.user_cd);
                } catch (storageError) {
                    console.warn("Failed to write login data to localStorage:", storageError);
                }
                checkSession?.().catch(() => {
                    // noop
                });
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
