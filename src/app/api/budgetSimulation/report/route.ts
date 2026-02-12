import axios, { isAxiosError } from 'axios';
import { NextResponse } from 'next/server';

const MODEL = 'gpt-4.1-mini';
const OPENAI_URL = 'https://api.openai.com/v1/responses';

type OpenAIResponse = {
  output?: Array<{
    content?: Array<{ type?: string; text?: string }>;
  }>;
};

type ReportRequestBody = {
  years: number;
  budget: number;
  sumInit: number;
  sumAnnual: number;
  sumTotal: number;
  usagePct: number;
  remain: number;
  locationTypes: string[];
  topOpex?: { name: string; ratioPct: number };
  items: Array<{
    name: string;
    unitPrice: number;
    elecMonthly: number;
    waterMonthly: number;
    qty: number;
  }>;
};

type ReportContent = {
  businessOverview: string;
  overview: string;
  conclusion: string;
  initCostAssessment: string;
  opexPoint: string;
  notice: string;
  totalCostAnalysis: string;
  expectedEffect: string[];
  riskManagement: Array<{ risk: string; mitigation: string }>;
  finalOpinion: string;
};

const extractOutputText = (data: OpenAIResponse): string => {
  if (!Array.isArray(data.output)) return '';
  const parts = data.output.flatMap((item) => item.content ?? []);
  return parts
    .filter((part) => part.type === 'output_text')
    .map((part) => part.text ?? '')
    .join('')
    .trim();
};

const toNumber = (value: unknown, fallback = 0) =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const buildPrompt = (payload: ReportRequestBody): string => {
  const { years, budget, sumInit, sumAnnual, sumTotal, usagePct, remain, locationTypes, topOpex, items } = payload;
  const locationTypesText = locationTypes.length > 0 ? locationTypes.join(", ") : "선택된 설치 위치 유형 없음";
  const itemsText =
    items.length > 0
      ? items
          .map(
            (item, idx) =>
              `${idx + 1}. ${item.name} | 단가 ${item.unitPrice} | 월 전기 ${item.elecMonthly} | 월 수도 ${item.waterMonthly} | 수량 ${item.qty}`
          )
          .join('\n')
      : '선택된 품목 없음';

  return [
    '너는 공공기관 예산 검토 보고서를 작성하는 한국어 전문 행정 문서 작성자다.',
    '아래 입력을 바탕으로 "설치 예산 검토 보고서" 본문을 정중한 공문체로 작성하라.',
    '수치는 입력 값만 사용하며, 계산이나 추정은 수행하지 않는다.',
    '문장은 과도하게 장황하지 않되, 행정 문서에 맞는 정중한 표현을 사용한다.',
    'initCostAssessment는 아래 규칙을 반드시 따른다.',
    '1) 아래 값을 모두 포함한다: 초기 설치비 합계(A), 가용 예산, 예산 사용률(%), 예산 잔여 금액.',
    '2) 회피 표현(산출되지 않음/판단 어려움/추가 확보 필요 등)은 금지한다.',
    '3) 문장 종결은 "~로 판단됩니다"로 끝낸다.',
    '4) 다음 템플릿을 사용하되 {{}} 부분만 입력 값으로 치환한다.',
    '템플릿: "초기 설치비 합계(A)는 {{sumInit}}원이며, 가용 예산 {{budget}}원 대비 사용률 {{usagePct}}% 수준입니다. 예산 잔여/부족 금액 {{remain}}원을 고려할 때 초기 설치비는 {{판단}} 수준으로 판단됩니다."',
    '판단은 "합리적", "다소 과다", "보완 필요" 중 하나만 사용한다.',
    'expectedEffect는 아래 규칙을 반드시 따른다.',
    '1) 입력된 설치 위치 유형별로 1줄씩 작성하며 형식은 "유형: 내용"으로 고정한다.',
    '2) 각 줄의 내용은 1~2문장으로 작성한다.',
    '3) 새로운 데이터/수치/근거는 추가하지 않는다.',
    '4) 설치 유형이 없으면 "설치 위치 유형 정보가 없어 기대 효과를 구체화하기 어렵습니다." 한 줄만 작성한다.',
    '5) expectedEffect는 문자열 배열(string[])로 출력한다.',
    'riskManagement는 아래 형식을 반드시 따른다.',
    '1) 리스크 4가지와 각 리스크의 관리 방안을 1:1로 작성한다.',
    '2) 아래 후보 범주 중에서 4개를 선택해 작성한다(중복 금지).',
    '후보 범주: 예산 집행 리스크, 운영비 변동 리스크, 유지보수/고장 리스크, 민원/운영시간 리스크, 시설 효율 저하 리스크, 안전/위생 리스크, 설치 지연 리스크, 이용률 저조 리스크.',
    '3) 출력 형식은 객체 배열로 고정한다.',
    'opexPoint는 아래 형식을 반드시 따른다.',
    '1) 입력된 운영비 관리 포인트(topOpex)만 근거로 작성한다.',
    '2) 새로운 항목/수치 추가 금지.',
    '3) 1~2문장, 공공기관 보고서 문체로 작성한다.',
    '4) 형식 예시: "운영비 관리의 핵심 포인트는 {항목명}이며, 전체 운영비의 {비중}%를 차지하므로 중점 관리가 필요합니다."',
    '5) opexPoint는 반드시 출력한다. topOpex가 없으면 "운영비 관리 포인트는 현재 제공된 정보가 없어 일반적 관리 강화가 필요합니다."로 출력한다.',
    'notice는 아래 형식을 반드시 따른다.',
    '1) 1문장으로 작성한다.',
    '2) 보고서 유의사항 성격의 문장으로 작성한다.',
    '3) notice는 반드시 출력한다. 정보가 부족하면 "본 보고서는 입력 정보 기반의 참고자료이며, 실제 집행 시 내부 검토 절차를 우선합니다."로 출력한다.',
    'finalOpinion은 2개 단락(총 9~10문장)으로 작성한다.',
    '각 단락은 4~5문장으로 구성하고, 문단 구분은 줄바꿈으로 한다.',
    '1~7번 섹션 내용을 참조해 종합 의견을 구체적으로 작성한다.',
    '1단락은 예산 집행 가능성/총 소요 예산 적정성 중심으로 작성한다.',
    '2단락은 운영기간 관점과 기대효과 요약 중심으로 작성한다.',
    '마지막 문장은 "~로 판단됩니다"로 끝낸다.',
    '반드시 JSON만 출력하고, 추가 설명이나 코드블록은 금지한다.',
    '',
    '[입력]',
    `설치 위치 유형: ${locationTypesText}`,
    `운영기간(년): ${years}`,
    `가용 예산: ${budget}`,
    `초기 설치비 합계(A): ${sumInit}`,
    `연간 운영비 합계(B, 1년 기준): ${sumAnnual}`,
    `운영기간 ${years}년 총 소요 예산(C): ${sumTotal}`,
    `예산 사용률(%): ${usagePct}`,
    `예산 잔여/부족 금액: ${remain}`,
    `운영비 관리 포인트: ${topOpex ? `${topOpex.name} (${topOpex.ratioPct.toFixed(1)}%)` : '해당 없음'}`,
    '선택 품목 목록:',
    itemsText,
    '',
    '[출력 형식(JSON)]',
    '{',
    '  "businessOverview": "3문장(쿨링포그 설치 목적 중심)",',
    '  "overview": "2문장",',
    '  "conclusion": "2문장",',
    '  "initCostAssessment": "3문장(초기 설치비 합리성 판단)",',
    '  "totalCostAnalysis": "2문장",',
    '  "expectedEffect": ["유형: 내용", "유형: 내용"],',
    '  "riskManagement": [{"risk":"...","mitigation":"..."}, {"risk":"...","mitigation":"..."}],',
    '  "finalOpinion": "2개 단락(총 9~10문장)",',
    '  "opexPoint": "2문장",',
    '  "notice": "1문장"',
    '}',
  ].join('\n');
};

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: 'OPENAI_API_KEY is not set.' },
      { status: 500 }
    );
  }

  const body = (await req.json().catch(() => ({}))) as Partial<ReportRequestBody>;
  const years = toNumber(body.years);
  const budget = toNumber(body.budget);
  const items = Array.isArray(body.items) ? body.items : [];

  const prompt = buildPrompt({
    years,
    budget,
    sumInit: toNumber(body.sumInit),
    sumAnnual: toNumber(body.sumAnnual),
    sumTotal: toNumber(body.sumTotal),
    usagePct: toNumber(body.usagePct),
    remain: toNumber(body.remain),
    locationTypes: Array.isArray(body.locationTypes) ? body.locationTypes.map(String) : [],
    topOpex: body.topOpex,
    items: items.map((item) => ({
      name: String(item?.name ?? ''),
      unitPrice: toNumber(item?.unitPrice),
      elecMonthly: toNumber(item?.elecMonthly),
      waterMonthly: toNumber(item?.waterMonthly),
      qty: toNumber(item?.qty),
    })),
  });

  try {
    const response = await axios.post<OpenAIResponse>(
      OPENAI_URL,
      {
        model: MODEL,
        input: prompt,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = response.data;
    const outputText = extractOutputText(data);
    let report: ReportContent | null = null;

    try {
      report = JSON.parse(outputText) as ReportContent;
    } catch {
      report = null;
    }
    console.log('[budgetSimulation/report] parsed report', report);

    return NextResponse.json({
      success: true,
      model: MODEL,
      report,
      outputText,
    });
  } catch (error: unknown) {
    const axiosError = isAxiosError(error) ? error : null;
    const status = axiosError?.response?.status ?? 500;
    const data = axiosError?.response?.data ?? error;
    return NextResponse.json({ success: false, error: data }, { status });
  }
}
