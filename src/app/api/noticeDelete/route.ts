import { NextRequest, NextResponse } from "next/server";
import axios, { isAxiosError } from "axios";
import { fail, ok } from "@/app/api/api-response";

export async function DELETE(req: NextRequest) {
	try {
		const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
		const authHeader = req.headers.get("authorization");
		const noticeCd = req.nextUrl.searchParams.get("notice_cd");

		if (!noticeCd) {
			return NextResponse.json(fail("notice_cd가 필요합니다."), { status: 400 });
		}

		const response = await axios.delete(`${apiUrl}/api/notice/${noticeCd}`, {
			headers: authHeader ? { Authorization: authHeader } : undefined,
		});

		return response.data.success
			? NextResponse.json(ok(null))
			: NextResponse.json(
				fail(response.data.error ?? "공지 삭제 실패"),
				{ status: 400 }
			);
	} catch (error) {
		if (isAxiosError(error)) {
			const message = error.response?.data?.error ?? "서버와 통신 중 오류가 발생했습니다.";
			const status = error.response?.status ?? 500;
			return NextResponse.json(fail(message), { status });
		}
		return NextResponse.json(fail("알 수 없는 오류가 발생했습니다."), { status: 500 });
	}
}
