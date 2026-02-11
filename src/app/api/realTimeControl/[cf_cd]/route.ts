import { NextResponse } from "next/server";
import axios, { isAxiosError } from "axios";
import { fail, ok } from "@/app/api/api-response";
import type { CoolingFogDetailData } from "@/types/realTimeControl/real-time-control";

type RouteContext = {
  params: Promise<{
    cf_cd: string;
  }>;
};

export async function GET(request: Request, context: RouteContext) {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
	const auth = request.headers.get("authorization");
  if (!apiUrl) {
    return NextResponse.json(
      fail<CoolingFogDetailData>("API 기본 URL이 설정되어 있지 않습니다."),
      { status: 500 }
    );
  }

  const { cf_cd } = await context.params;
  if (!cf_cd) {
    return NextResponse.json(
      fail<CoolingFogDetailData>("쿨링포그 아이디가 필요합니다."),
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(`${apiUrl}/api/cf/${cf_cd}`, {
			headers: auth ? { Authorization: auth } : undefined,
		});
    const payload = response.data as {
      success?: boolean;
      data?: CoolingFogDetailData | null;
      error?: string | null;
    };

    if (payload?.success && payload.data) {
      return NextResponse.json(ok<CoolingFogDetailData>(payload.data));
    }

    return NextResponse.json(
      fail<CoolingFogDetailData>(payload?.error ?? "쿨링포그 상세 정보를 불러오지 못했습니다."),
      { status: 400 }
    );
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message =
        (error.response?.data as { error?: string | null } | undefined)?.error ??
        "쿨링포그 상세 서비스 호출에 실패했습니다.";

      return NextResponse.json(fail<CoolingFogDetailData>(message), { status });
    }

    return NextResponse.json(fail<CoolingFogDetailData>("예상치 못한 서버 오류가 발생했습니다."), {
      status: 500,
    });
  }
}
