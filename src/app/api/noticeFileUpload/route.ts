import { NextRequest, NextResponse } from "next/server";
import axios, { isAxiosError } from "axios";
import { fail, ok } from "@/app/api/api-response";

export type NoticeFileUploadResult = {
	notice_file_cd: number;
};

export async function POST(req: NextRequest) {
	try {
		const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
		const authHeader = req.headers.get("authorization");

		const formData = await req.formData();
		const file = formData.get("file");

		if (!(file instanceof File)) {
			return NextResponse.json(fail<NoticeFileUploadResult>("파일이 없습니다."), { status: 400 });
		}

		const upstreamForm = new FormData();
		upstreamForm.append("file", file);

		const response = await axios.post(`${apiUrl}/api/notice/file/upload`, upstreamForm, {
			headers: {
				...(authHeader ? { Authorization: authHeader } : {}),
				// axios가 boundary 자동 설정
			},
		});

		return response.data.success
			? NextResponse.json(ok<NoticeFileUploadResult>(response.data.data))
			: NextResponse.json(
				fail<NoticeFileUploadResult>(response.data.error ?? "파일 업로드 실패"),
				{ status: 400 }
			);
	} catch (error) {
		if (isAxiosError(error)) {
			const message = error.response?.data?.error ?? "서버 통신 오류";
			const status = error.response?.status ?? 500;
			return NextResponse.json(fail<NoticeFileUploadResult>(message), { status });
		}
		return NextResponse.json(fail<NoticeFileUploadResult>("알 수 없는 오류"), { status: 500 });
	}
}
