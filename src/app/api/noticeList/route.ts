import { NextRequest, NextResponse } from "next/server";
import axios, { isAxiosError } from "axios";
import { fail, ok } from "@/app/api/api-response";
import type { Notice } from "@/types/notice/notice";

export type NoticeListResult = {
	total_count: number;
	notice_list: Notice[];
};

export async function GET(req: NextRequest) {
	try {
		const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
		const noticeType = req.nextUrl.searchParams.get("notice_type") ?? undefined;
		const limitCount = req.nextUrl.searchParams.get("limit_count") ?? undefined;

		const authHeader = req.headers.get("authorization");

		const response = await axios.get(`${apiUrl}/api/notice`, {
			params: {
				notice_type: noticeType || undefined,
				limit_count: limitCount || undefined,
			},
			headers: authHeader ? { Authorization: authHeader } : undefined,
		});

		return response.data.success
			? NextResponse.json(ok<NoticeListResult>(response.data.data))
			: NextResponse.json(
				fail<NoticeListResult>(response.data.error ?? "공지 목록 조회에 실패했습니다."),
				{ status: 400 }
			);
	} catch (error) {
		console.error("Notice list API route error:", error);

		if (isAxiosError(error)) {
			const message = error.response?.data?.error ?? "서버와 통신 중 오류가 발생했습니다.";
			const status = error.response?.status ?? 500;
			return NextResponse.json(fail<NoticeListResult>(message), { status });
		}

		return NextResponse.json(fail<NoticeListResult>("알 수 없는 오류가 발생했습니다."), {
			status: 500,
		});
	}
}
