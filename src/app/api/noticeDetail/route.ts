import { NextRequest, NextResponse } from "next/server";
import axios, { isAxiosError } from "axios";
import { fail, ok } from "@/app/api/api-response";
import type { NoticeDetail } from "@/types/notice/notice";

export async function GET(req: NextRequest) {
	try {
		const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
		const authHeader = req.headers.get("authorization");
		const noticeCd = req.nextUrl.searchParams.get("notice_cd");

		if (!noticeCd) {
			return NextResponse.json(fail<NoticeDetail>("notice_cd가 필요합니다."), { status: 400 });
		}

		const response = await axios.get(`${apiUrl}/api/notice/${noticeCd}`, {
			headers: authHeader ? { Authorization: authHeader } : undefined,
		});

		return response.data.success
			? NextResponse.json(ok<NoticeDetail>(response.data.data))
			: NextResponse.json(
				fail<NoticeDetail>(response.data.error ?? "공지 상세 조회 실패"),
				{ status: 400 }
			);
	} catch (error) {
		console.error("Notice detail API route error:", error);

		if (isAxiosError(error)) {
			const message = error.response?.data?.error ?? "서버와 통신 중 오류가 발생했습니다.";
			const status = error.response?.status ?? 500;
			return NextResponse.json(fail<NoticeDetail>(message), { status });
		}

		return NextResponse.json(fail<NoticeDetail>("알 수 없는 오류가 발생했습니다."), { status: 500 });
	}
}
