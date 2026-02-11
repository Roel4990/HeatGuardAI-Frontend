import { NextRequest, NextResponse } from "next/server";
import axios, { isAxiosError } from "axios";
import { fail, ok } from "@/app/api/api-response";

export type NoticeCreateRequest = {
	user_cd: string;
	notice_title: string;
	cf_cd: string;
	notice_type: string;
	notice_content: string;
	notice_file_cd?: number | null;
	notice_fix_yn: boolean;
};

export type NoticeCreateResult = {
	notice_cd: number;
};

export async function POST(req: NextRequest) {
	try {
		const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
		const authHeader = req.headers.get("authorization");
		const body = (await req.json()) as NoticeCreateRequest;

		const response = await axios.post(`${apiUrl}/api/notice/create`, body, {
			headers: authHeader ? { Authorization: authHeader } : undefined,
		});

		return response.data.success
			? NextResponse.json(ok<NoticeCreateResult>(response.data.data))
			: NextResponse.json(
				fail<NoticeCreateResult>(response.data.error ?? "공지 작성에 실패했습니다."),
				{ status: 400 }
			);
	} catch (error) {
		console.error("Notice create API route error:", error);

		if (isAxiosError(error)) {
			const message = error.response?.data?.error ?? "서버와 통신 중 오류가 발생했습니다.";
			const status = error.response?.status ?? 500;
			return NextResponse.json(fail<NoticeCreateResult>(message), { status });
		}

		return NextResponse.json(fail<NoticeCreateResult>("알 수 없는 오류가 발생했습니다."), {
			status: 500,
		});
	}
}
