import { NextRequest, NextResponse } from "next/server";
import axios, { isAxiosError } from "axios";

import { fail, ok } from "@/app/api/api-response";
import { LoginResult } from "@/types/login/login";

export async function POST(req: NextRequest) {
	const { user_nm, user_id, user_pw } = await req.json();

	if (!user_nm || !user_id || !user_pw) {
		return NextResponse.json(fail("모든 필드를 입력해 주세요."), { status: 400 });
	}

	try {
		const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
		const response = await axios.post(`${apiUrl}/api/users/signup`, { user_nm, user_id, user_pw });

		return response.data?.success
			? NextResponse.json(ok<LoginResult>(response.data.data))
			: NextResponse.json(fail<LoginResult>(response.data?.error ?? "회원가입에 실패했습니다."), { status: 400 });
	} catch (error) {
		if (isAxiosError(error)) {
			const message = error.response?.data?.error ?? "서버와 통신 중 오류가 발생했습니다.";
			const status = error.response?.status ?? 500;

			return NextResponse.json(fail<LoginResult>(message), { status });
		}

		return NextResponse.json(fail<LoginResult>("서버와 통신 중 오류가 발생했습니다."), { status: 500 });
	}
}
