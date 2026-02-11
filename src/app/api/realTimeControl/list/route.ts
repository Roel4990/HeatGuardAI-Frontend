import { NextResponse } from "next/server";
import axios, { isAxiosError } from "axios";
import { fail, ok } from "@/app/api/api-response";
import type { CoolingFogListData } from "@/types/realTimeControl/real-time-control";

export async function GET(request: Request) {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
	const auth = request.headers.get("authorization");

  if (!apiUrl) {
    return NextResponse.json(
      fail<CoolingFogListData>("API 기본 URL이 설정되어 있지 않습니다."),
      { status: 500 }
    );
  }

  try {
    const response = await axios.get(`${apiUrl}/api/cf/list`, {
			headers: auth ? { Authorization: auth } : undefined,
		});
    const payload = response.data as {
      success?: boolean;
      data?: CoolingFogListData | null;
      error?: string | null;
    };

    if (payload?.success && payload.data) {
      return NextResponse.json(ok<CoolingFogListData>(payload.data));
    }

    return NextResponse.json(
      fail<CoolingFogListData>(payload?.error ?? "쿨링포그 목록을 불러오지 못했습니다."),
      { status: 400 }
    );
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message =
        (error.response?.data as { error?: string | null } | undefined)?.error ??
        "쿨링포그 목록 서비스를 호출하지 못했습니다.";

      return NextResponse.json(fail<CoolingFogListData>(message), { status });
    }

    return NextResponse.json(
      fail<CoolingFogListData>("예상치 못한 서버 오류가 발생했습니다."),
      { status: 500 }
    );
  }
}
