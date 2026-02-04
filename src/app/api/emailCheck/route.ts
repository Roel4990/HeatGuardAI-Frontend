import { NextRequest, NextResponse } from "next/server";
import axios, { isAxiosError } from "axios";

import { fail, ok } from "@/app/api/api-response";
import { EmailCheckResult } from "@/types/email-check/email-check";

export async function GET(req: NextRequest) {
	const userId = req.nextUrl.searchParams.get("user_id");

	if (!userId) {
		return NextResponse.json(fail("이메일을 입력해 주세요."), { status: 400 });
	}

	try {
		const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
		const response = await axios.get(`${apiUrl}/api/users/signup/emailCheck`, {
			params: { user_id: userId },
		});

		return response.data?.success
			? NextResponse.json(ok<EmailCheckResult>(response.data.data))
			: NextResponse.json(fail<EmailCheckResult>(response.data?.error ?? "이메일 중복 확인에 실패했습니다."), {
					status: 400,
				});
	} catch (error) {
		if (isAxiosError(error)) {
			const message = error.response?.data?.error ?? "서버와 통신 중 오류가 발생했습니다.";
			const status = error.response?.status ?? 500;

			return NextResponse.json(fail<EmailCheckResult>(message), { status });
		}

		return NextResponse.json(fail<EmailCheckResult>("서버와 통신 중 오류가 발생했습니다."), { status: 500 });
	}
}
