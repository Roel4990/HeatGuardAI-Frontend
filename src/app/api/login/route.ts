import { NextRequest, NextResponse } from "next/server";
import { fail, ok } from "@/app/api/api-response";
import axios, { isAxiosError } from "axios";
import { LoginResult } from "@/types/login/login";

/**
 * 로그인 처리를 위한 API 라우트
 * @param req
 * @constructor
 */
export async function POST(req: NextRequest) {
	const { email, password } = await req.json();

	if (!email || !password) {
		return NextResponse.json(fail("이메일과 비밀번호를 모두 입력해주세요."), { status: 400 });
	}

	try {
		const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
		const response = await axios.post(`${apiUrl}/api/users/signin`, { id: email, password: password });

		return response.data.success
			? NextResponse.json(ok<LoginResult>(response.data.data))
			: NextResponse.json(fail<LoginResult>(response.data.error ?? "로그인에 실패했습니다."), { status: 401 });
	} catch (error) {
		console.error("Login API route error:", error);

		if (isAxiosError(error)) {
			const message = error.response?.data?.error ?? "서버와 통신 중 오류가 발생했습니다.";
			const status = error.response?.status ?? 500;

			return NextResponse.json(fail<LoginResult>(message), { status });
		}
	}
}
