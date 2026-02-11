import { NextRequest, NextResponse } from "next/server";
import axios, { isAxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(request: NextRequest) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { error: "Missing NEXT_PUBLIC_API_BASE_URL" },
      { status: 500 }
    );
  }

  try {
    const authHeader = request.headers.get("authorization") ?? undefined;
    const response = await axios.get(`${API_BASE_URL}/api/regions`, {
      headers: authHeader ? { Authorization: authHeader } : undefined,
    });

    console.log("행정구, 동 조회 성공")
    return NextResponse.json(response.data.data);
  } catch (error) {
    console.error("Regions API route error:", error);

    if (isAxiosError(error)) {
      const message = error.response?.data?.error ?? "서버와 통신 중 오류가 발생했습니다.";
      const status = error.response?.status ?? 500;

      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json({ error: "서버와 통신 중 오류가 발생했습니다." }, { status: 500 });
  }
}
