import axios, { isAxiosError } from "axios";
import { NextResponse } from "next/server";

import type { RecommendationText } from "@/types/budgetSimulation/documents";

const MODEL = "gpt-4.1-mini";
const OPENAI_URL = "https://api.openai.com/v1/responses";

type OpenAIResponse = {
  output?: Array<{
    content?: Array<{ type?: string; text?: string }>;
  }>;
};

type RecoRequestBody = {
  years: number;
  budget: number;
  sumTotal: number;
  usagePct: number;
  remain: number;
  totalQty: number;
  locationTypes: string[];
  items?: Array<{
    name: string;
    qty: number;
    unitPrice: number;
    annualCostTotal: number;
    initCostTotal: number;
    matchedTypesText?: string;
  }>;
  sumInit?: number;
  sumAnnual?: number;
};

const extractOutputText = (data: OpenAIResponse): string => {
  if (!Array.isArray(data.output)) return "";
  const parts = data.output.flatMap((item) => item.content ?? []);
  return parts
    .filter((part) => part.type === "output_text")
    .map((part) => part.text ?? "")
    .join("")
    .trim();
};

const toNumber = (value: unknown, fallback = 0) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const buildPrompt = (payload: RecoRequestBody): string => {
  const { years, budget, sumTotal, usagePct, remain, totalQty, locationTypes, items, sumInit, sumAnnual } = payload;
  const initTotal = toNumber(sumInit);
  const annualTotal = toNumber(sumAnnual);
  const budgetRemain = budget - (initTotal + annualTotal);
  const locationTypesText = locationTypes.length > 0 ? locationTypes.join(", ") : "설치 유형 정보 없음";
  const itemsText =
    items && items.length > 0
      ? items
          .map(
            (item, idx) =>
              `${idx + 1}. ${item.name} | 수량 ${item.qty} | 단가 ${item.unitPrice} | 초기합계 ${item.initCostTotal} | 연간합계 ${item.annualCostTotal}`
          )
          .join("\n")
      : "추천 구성 품목 없음";

  return [
    "당신은 예산 범위 내 구성 방안 추천서를 작성하는 담당자입니다.",
    "아래 입력을 바탕으로 보고서 톤으로 작성하세요.",
    "반드시 JSON 형식으로만 출력하세요. JSON 외 텍스트는 금지합니다.",
    "insights는 4개의 항목 배열로 작성하세요.",
    "insights는 각 항목이 {'전문가유형':'문장'} 형태의 객체가 되도록 작성하세요.",
    "전문가유형은 다음 4가지로 각각 1회씩 사용하세요: 기상, 도시계획, 재정/예산, 운영/유지관리.",
    "insights 각 항목의 문장은 2~3문장으로 작성하세요.",
    "basis(추천 산정 기준)는 3. 추천 구성 내역(추천 구성 품목, 수량, 비용 구조)에 근거해 도출된 내용으로 작성하세요.",
    "intro(추천 산정 개요)는 3문단으로 작성하고, 문단마다 줄바꿈을 포함하세요.",
    "intro(추천 산정 개요)에는 다음 키워드를 자연스럽게 포함하세요: " +
    "폭염 취약도, 유동 인구 특성, 공간 구조, 예산 한도, 체감온도 저감 효과 대비 예산 효율성, " +
    "초기 설치비, 연간 운영비, 지속가능한 운영 구조, AI 기반 공간 분석, 기상 데이터 시뮬레이션, 정량적 근거.",
    "result(예산 반영 결과)는 가용 예산과 3. 추천 구성 내역의 초기 설치비/연간 운영비 합계를 반영해 잔여 금액을 기준으로 작성하세요.",
    "result(예산 반영 결과)는 1~2문장으로 작성하세요.",
    "caution(유의사항)은 2~3문장으로 작성하세요.",
    "",
    "[입력]",
    `설치 유형: ${locationTypesText}`,
    `운영기간(년): ${years}`,
    `가용예산: ${budget}`,
    `추천 구성 초기 설치비 합계(A): ${initTotal}`,
    `추천 구성 연간 운영비 합계(B): ${annualTotal}`,
    `예산 잔여 금액(가용 예산 - A - B): ${budgetRemain}`,
    `총소요예산(C): ${sumTotal}`,
    `예산사용률(%): ${usagePct}`,
    `예산잔여/부족금액: ${remain}`,
    `총설치수량: ${totalQty}`,
    "추천 구성 품목:",
    itemsText,
    "",
    "[출력 형식(JSON)]",
    "{",
    "  'intro': '3문단',",
    "  'basis': '1~2문장',",
    "  'result': '1~2문장',",
    "  'insights': [{'기상':'문장1'}, {'도시계획':'문장2'}, {'재정/예산':'문장3'}, {'운영/유지관리':'문장4'}],",
    "  'betterPlan': '1~2문장',",
    "  'caution': '2~3문장',",
    "  'note': '1문장'",
    "}",
  ].join("\n");
};

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: "OPENAI_API_KEY is not set." },
      { status: 500 }
    );
  }

  const body = (await req.json().catch(() => ({}))) as Partial<RecoRequestBody>;

  const prompt = buildPrompt({
    years: toNumber(body.years),
    budget: toNumber(body.budget),
    sumTotal: toNumber(body.sumTotal),
    usagePct: toNumber(body.usagePct),
    remain: toNumber(body.remain),
    totalQty: toNumber(body.totalQty),
    locationTypes: Array.isArray(body.locationTypes) ? body.locationTypes.map(String) : [],
    items: Array.isArray(body.items)
      ? body.items.map((item) => ({
          name: String(item?.name ?? ""),
          qty: toNumber(item?.qty),
          unitPrice: toNumber(item?.unitPrice),
          annualCostTotal: toNumber(item?.annualCostTotal),
          initCostTotal: toNumber(item?.initCostTotal),
          matchedTypesText: item?.matchedTypesText ? String(item.matchedTypesText) : undefined,
        }))
      : [],
  });

  try {
    const response = await axios.post<OpenAIResponse>(
      OPENAI_URL,
      {
        model: MODEL,
        input: prompt,
        text: { format: { type: "json_object" } },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    const outputText = extractOutputText(data);
    let rec: RecommendationText | null;

    try {
      rec = JSON.parse(outputText) as RecommendationText;
    } catch {
      rec = null;
    }
    console.log('[budgetSimulation/rec] parsed report', rec);
    return NextResponse.json({
      success: true,
      model: MODEL,
      recommendation: rec,
      outputText,
    });
  } catch (error: unknown) {
    const axiosError = isAxiosError(error) ? error : null;
    const status = axiosError?.response?.status ?? 500;
    const data = axiosError?.response?.data ?? error;
    return NextResponse.json({ success: false, error: data }, { status });
  }
}

