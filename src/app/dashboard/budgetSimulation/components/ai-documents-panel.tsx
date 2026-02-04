"use client";

import * as React from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";

export type LocationType =
  | "전체"
  | "공원"
  | "광장"
  | "버스정류장"
  | "보행로"
  | "공공시설"
  | "특수구역"
  | "운동구간";

export type BudgetItemLike = {
  code: string;
  name: string;
  unitPrice: number;
  elecMonthly: number;
  waterMonthly: number;
  loc: string;
  qty: number;
};

export type AIDocumentsPanelProps = {
  years: number;
  budget: number;
  pickedItems: BudgetItemLike[]; // 선택된 품목(요약/보고서)
  allItems: BudgetItemLike[]; // 전체 품목(추천서 산정)
};

type DocStatus = "idle" | "ready";
const MAX_QTY = 99;

function formatKRW(n: number) {
  const safe = Number.isFinite(n) ? Math.round(n) : 0;
  return `₩ ${safe.toLocaleString("ko-KR")}`;
}

function calcAnnualPerUnit(it: { elecMonthly: number; waterMonthly: number }) {
  return (it.elecMonthly + it.waterMonthly) * 12;
}

function normalizeLocTags(loc: string): Set<LocationType> {
  const s = (loc ?? "").trim();
  const tags = new Set<LocationType>();
  const has = (kw: string) => s.includes(kw);

  // POC 매핑(필요시 고도화)
  if (has("공원")) tags.add("공원");
  if (has("광장") || has("중앙광장") || has("트인광장")) tags.add("광장");
  if (has("버스") || has("정류장")) tags.add("버스정류장");
  if (has("보행로") || has("산책로") || has("경로") || has("입구")) tags.add("보행로");
  if (has("공공시설") || has("시설") || has("청사") || has("센터")) tags.add("공공시설");
  if (has("특수") || has("야간") || has("경관") || has("황톳길")) tags.add("특수구역");

  // 펜스/구조물 → 공공시설로 임시
  if (has("펜스") || has("구조물")) tags.add("공공시설");

  return tags;
}

function A4Shell(props: { title: string; children: React.ReactNode }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 2.5,
        bgcolor: "background.paper",
        borderColor: "divider",
        maxWidth: 920,
        mx: "auto",
      }}
    >
      <Typography variant="h6" fontWeight={900} sx={{ letterSpacing: "-0.02em" }}>
        {props.title}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 0.5, lineHeight: 1.6 }}
      >
        (POC) API 없이 더미 문장/계산으로 즉시 생성되는 화면 예시입니다.
      </Typography>
      <Divider sx={{ my: 2 }} />
      {props.children}
    </Paper>
  );
}

function DenseTable(props: {
  head: string[];
  rows: Array<Array<string | number>>;
  footer?: Array<string | number>;
}) {
  const { head, rows, footer } = props;
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {head.map((h, idx) => (
              <TableCell key={idx} sx={{ fontWeight: 900, bgcolor: "rgba(0,0,0,0.02)" }}>
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r, i) => (
            <TableRow key={i} hover>
              {r.map((c, j) => (
                <TableCell key={j} align={typeof c === "number" ? "right" : "left"}>
                  {typeof c === "number" ? formatKRW(c) : c}
                </TableCell>
              ))}
            </TableRow>
          ))}

          {footer && (
            <TableRow sx={{ bgcolor: "rgba(76,175,80,0.10)" }}>
              {footer.map((c, j) => (
                <TableCell
                  key={j}
                  sx={{ fontWeight: 900 }}
                  align={typeof c === "number" ? "right" : "left"}
                >
                  {typeof c === "number" ? formatKRW(c) : c}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function buildReportDummyText(args: {
  years: number;
  budget: number;
  sumInit: number;
  sumAnnual: number;
  sumTotal: number;
  usagePct: number;
  remain: number;
  topOpex?: { name: string; ratioPct: number };
}) {
  const { years, budget, sumTotal, usagePct, remain, topOpex } = args;

  const budgetLine =
    budget > 0
      ? `운영기간 ${years}년 기준 총 소요 예산(C)은 ${formatKRW(
        sumTotal
      )}이며, 가용 예산 대비 약 ${usagePct.toFixed(1)}% 수준입니다.`
      : `가용 예산이 입력되지 않아 예산 대비 비율은 산정하지 않았습니다.`;

  const remainLine =
    budget > 0
      ? remain >= 0
        ? `예산 잔여 금액은 ${formatKRW(remain)}입니다.`
        : `예산이 ${formatKRW(Math.abs(remain))} 부족한 것으로 산정됩니다.`
      : "";

  const opexLine = topOpex
    ? `운영비 관리 포인트: ${topOpex.name}의 연간 운영비 비중이 약 ${topOpex.ratioPct.toFixed(
      1
    )}%로 확인되어, 장기 운영 시 운영비 관리 대상으로 고려될 수 있습니다.`
    : `운영비 관리 포인트: 연간 운영비(B)는 운영기간 증가에 따라 누적 비용에 영향을 미칩니다.`;

  return {
    overview: `본 보고서는 선택된 품목 및 설치 수량을 기준으로 초기 설치비(A)와 연간 운영비(B)를 산정하고, 운영기간 ${years}년 기준 총 소요 예산(C)을 검토하기 위해 작성되었습니다.`,
    conclusion: `${budgetLine} ${remainLine}`.trim(),
    opexPoint: opexLine,
    notice: `본 문서는 입력 정보 기반의 참고 자료이며, 실제 집행 시에는 현장 여건 및 내부 검토 절차를 우선합니다.`,
  };
}

function buildRecommendationDummyText(args: {
  years: number;
  budget: number;
  locationTypes: LocationType[];
  sumTotal: number;
  usagePct: number;
  remain: number;
  totalQty: number;
}) {
  const { years, budget, locationTypes, sumTotal, usagePct, remain, totalQty } = args;
  const lt = locationTypes.includes("전체") ? "전체" : locationTypes.join(", ");

  return {
    intro: `본 추천서는 설치 위치 유형(${lt})과 운영기간 ${years}년, 가용 예산을 기준으로 예산 범위 내에서 구성 가능한 품목 및 수량(안)을 산정하기 위해 작성되었습니다.`,
    basis: `산정 기준은 (1) 권장 설치 위치(loc) 적합성, (2) 단위 설치비 및 운영비 구조, (3) 운영기간 반영 총 소요 예산(C)입니다.`,
    result:
      budget > 0
        ? `추천 구성(안)의 운영기간 ${years}년 기준 총 소요 예산(C)은 ${formatKRW(
          sumTotal
        )}이며, 예산 사용률은 약 ${usagePct.toFixed(1)}%입니다. (총 설치 ${totalQty}대)`
        : `가용 예산이 입력되지 않아 추천 구성 산정이 제한됩니다.`,
    insights: [
      `비용 구조 측면에서, 대부분 품목은 운영비보다 초기 설치비(A)의 영향이 상대적으로 큰 것으로 나타납니다.`,
      `권장 설치 위치(loc) 특성상, 동선형(보행로/입구)과 거점형(공원/광장) 품목을 혼합하는 구성이 현장 적용 시 검토에 유리할 수 있습니다.`,
      `운영기간이 증가할수록 연간 운영비(B)의 누적 효과가 확대되므로, 운영비 비중이 높은 품목은 비용 추이 관리 관점에서 확인이 필요할 수 있습니다.`,
    ],
    betterPlan: `향후 검토 단계에서는 (1) 핵심 거점(공원/광장) 중심의 체류형 구성과 (2) 이동 동선(보행로/입구) 중심의 분산형 구성을 각각 산정하여 비교 검토하는 방안을 고려할 수 있습니다. 또한 야간·특수구역(경관 동선 등)의 경우 운영 조건(운영시간, 급수/전기 인입 등)을 반영한 별도 검토가 필요할 수 있습니다.`,
    note:
      remain >= 0
        ? `예산 잔여 금액은 ${formatKRW(
          remain
        )}이며, 실제 적용 시에는 설치 간격·급수/전기 인입·운영시간 등 현장 조건을 추가로 고려할 필요가 있습니다.`
        : `예산이 ${formatKRW(
          Math.abs(remain)
        )} 부족한 것으로 산정되어, 설치 수량 또는 구성(안) 조정에 대한 검토가 필요할 수 있습니다.`,
  };
}

// ---- 복사/인쇄 유틸 (Deprecated 제거) ----

// 1) Clipboard: execCommand 제거 → 실패 시 "수동 복사용 다이얼로그"로 유도
async function copyToClipboardSafe(text: string) {
  // Secure Context(https/localhost) + 권한이 있으면 clipboard API 사용
  if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return { ok: true as const, reason: "" };
    } catch (e: any) {
      return { ok: false as const, reason: e?.message ?? "clipboard.writeText 실패" };
    }
  }
  return { ok: false as const, reason: "클립보드 API 사용 불가(비보안 컨텍스트 또는 미지원)" };
}

// 2) Print: document.write/doc.open/doc.close 제거 → iframe.srcdoc 사용 + lang 추가
function buildPrintDoc(title: string, bodyHtml: string) {
  // ✅ lang 속성 추가(경고 해결)
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${escapeHtml(title)}</title>
  <style>
    @page { size: A4; margin: 14mm; }
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, "Noto Sans KR", Arial, sans-serif; color: #111; }
    .page { max-width: 900px; margin: 0 auto; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { border: 1px solid #ddd; padding: 8px; vertical-align: top; }
    th { background: #f6f7f9; text-align: left; }
    h2 { margin: 0 0 8px 0; font-size: 18px; }
    h3 { margin: 18px 0 8px 0; font-size: 14px; }
    p { margin: 6px 0; line-height: 1.65; font-size: 13px; }
    ul { margin: 6px 0 0 18px; }
    li { margin: 4px 0; line-height: 1.6; font-size: 13px; }
  </style>
</head>
<body>
  <div class="page">${bodyHtml}</div>
</body>
</html>`;
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function printHtml(title: string, html: string) {
  // 팝업 없이 인쇄: hidden iframe 사용 (팝업 차단 영향 없음)
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.setAttribute("title", title);

  // ✅ doc.write deprecated 회피: srcdoc 사용
  iframe.srcdoc = buildPrintDoc(title, html);

  const cleanup = () => {
    try {
      iframe.onload = null;
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
    } catch {
      /* noop */
    }
  };

  iframe.onload = () => {
    const win = iframe.contentWindow;
    if (!win) {
      cleanup();
      return;
    }

    // Safari/일부 환경 대응: 약간의 딜레이가 안정적
    setTimeout(() => {
      try {
        win.focus();
        win.print();
      } finally {
        // 인쇄 다이얼로그 띄운 뒤 iframe 제거
        setTimeout(cleanup, 300);
      }
    }, 50);
  };

  document.body.appendChild(iframe);
}

function tsvTable(head: string[], rows: Array<Array<string | number>>) {
  const h = head.join("\t");
  const r = rows.map((row) => row.map(String).join("\t")).join("\n");
  return `${h}\n${r}`;
}

export default function AIDocumentsPanel(props: AIDocumentsPanelProps) {
  const { years, budget, pickedItems, allItems } = props;

  const ALL: LocationType = "전체";
  const TYPES: LocationType[] = ["전체", "공원", "광장", "버스정류장", "보행로", "공공시설"];

  const [types, setTypes] = React.useState<Set<LocationType>>(() => new Set([ALL]));
  const selectedTypesArr = React.useMemo(() => Array.from(types), [types]);

  const toggleType = (t: LocationType) => {
    setTypes((prev) => {
      const next = new Set(prev);

      // "전체"는 끌 수 없고, 누르면 "전체만"으로 정리(POC)
      if (t === ALL) {
        next.clear();
        next.add(ALL);
        return next;
      }

      if (next.has(t)) next.delete(t);
      else next.add(t);

      // 개별 유형 선택 시 전체 해제
      if (next.size > 0 && next.has(ALL)) next.delete(ALL);

      // 전부 꺼지면 전체 자동
      if (next.size === 0) next.add(ALL);

      return next;
    });
  };

  // ----- 보고서(선택 품목 기반) -----
  const sumInit = React.useMemo(
    () => pickedItems.reduce((acc, it) => acc + it.unitPrice * it.qty, 0),
    [pickedItems]
  );

  const sumAnnual = React.useMemo(
    () => pickedItems.reduce((acc, it) => acc + calcAnnualPerUnit(it) * it.qty, 0),
    [pickedItems]
  );

  const sumTotal = React.useMemo(() => sumInit + sumAnnual * years, [sumInit, sumAnnual, years]);
  const usagePct = React.useMemo(() => (budget > 0 ? (sumTotal / budget) * 100 : 0), [sumTotal, budget]);
  const remain = React.useMemo(() => budget - sumTotal, [budget, sumTotal]);

  const topOpex = React.useMemo(() => {
    if (sumAnnual <= 0) return null;
    const byItem = pickedItems
      .map((it) => ({ name: it.name, annual: calcAnnualPerUnit(it) * it.qty }))
      .sort((a, b) => b.annual - a.annual);
    if (byItem.length === 0) return null;
    return { name: byItem[0].name, ratioPct: (byItem[0].annual / sumAnnual) * 100 };
  }, [pickedItems, sumAnnual]);

  const reportText = React.useMemo(
    () =>
      buildReportDummyText({
        years,
        budget,
        sumInit,
        sumAnnual,
        sumTotal,
        usagePct,
        remain,
        topOpex: topOpex ?? undefined,
      }),
    [years, budget, sumInit, sumAnnual, sumTotal, usagePct, remain, topOpex]
  );

  // ----- 추천서(POC): 유형 + 예산 기반 간단 그리디 추천 -----
  const recPlan = React.useMemo(() => {
    const chosenTypes = new Set(selectedTypesArr);

    const candidates = allItems
      .map((it) => {
        const tags = normalizeLocTags(it.loc);
        const matches = chosenTypes.has(ALL) || Array.from(chosenTypes).some((t) => t !== ALL && tags.has(t));
        if (!matches) return null;

        const annualPerUnit = calcAnnualPerUnit(it);
        const cPerUnit = it.unitPrice + annualPerUnit * years;

        return { ...it, tags, annualPerUnit, cPerUnit };
      })
      .filter(Boolean) as Array<BudgetItemLike & { tags: Set<LocationType>; annualPerUnit: number; cPerUnit: number }>;

    candidates.sort((a, b) => a.cPerUnit - b.cPerUnit);

    if (budget <= 0 || candidates.length === 0) {
      return { items: [], totalQty: 0, sumInit: 0, sumAnnual: 0, sumTotal: 0, usagePct: 0, remain: budget };
    }

    let remainBudget = budget;
    const recMap = new Map<string, number>();

    let progressed = true;
    let safety = 0;

    while (progressed && safety < 5000) {
      progressed = false;
      safety += 1;

      for (const c of candidates) {
        if (remainBudget < c.cPerUnit) continue;

        const curr = recMap.get(c.code) ?? 0;
        if (curr >= MAX_QTY) continue;

        recMap.set(c.code, curr + 1);
        remainBudget -= c.cPerUnit;
        progressed = true;

        // POC: 과도한 반복 방지(적당히만)
        if (recMap.size >= 6 && remainBudget < candidates[0].cPerUnit) break;
      }
    }

    const items = candidates
      .filter((c) => (recMap.get(c.code) ?? 0) > 0)
      .map((c) => {
        const qty = recMap.get(c.code) ?? 0;
        const initCostTotal = c.unitPrice * qty;
        const annualCostTotal = c.annualPerUnit * qty;

        const matchedTypesText = chosenTypes.has(ALL)
          ? c.loc
          : Array.from(chosenTypes)
          .filter((t) => t !== ALL)
          .filter((t) => c.tags.has(t))
          .join(" / ") || c.loc;

        return { ...c, qty, initCostTotal, annualCostTotal, matchedTypesText };
      });

    const sumInitR = items.reduce((a, x) => a + x.initCostTotal, 0);
    const sumAnnualR = items.reduce((a, x) => a + x.annualCostTotal, 0);
    const sumTotalR = sumInitR + sumAnnualR * years;

    return {
      items,
      totalQty: items.reduce((a, x) => a + x.qty, 0),
      sumInit: sumInitR,
      sumAnnual: sumAnnualR,
      sumTotal: sumTotalR,
      usagePct: budget > 0 ? (sumTotalR / budget) * 100 : 0,
      remain: budget - sumTotalR,
    };
  }, [allItems, selectedTypesArr, budget, years]);

  const recText = React.useMemo(
    () =>
      buildRecommendationDummyText({
        years,
        budget,
        locationTypes: selectedTypesArr,
        sumTotal: recPlan.sumTotal,
        usagePct: recPlan.usagePct,
        remain: recPlan.remain,
        totalQty: recPlan.totalQty,
      }),
    [years, budget, selectedTypesArr, recPlan.sumTotal, recPlan.usagePct, recPlan.remain, recPlan.totalQty]
  );

  // ----- UI state -----
  const canGenerate = budget > 0;
  const [reportStatus, setReportStatus] = React.useState<DocStatus>("idle");
  const [reportOpen, setReportOpen] = React.useState(false);

  const [recStatus, setRecStatus] = React.useState<DocStatus>("idle");
  const [recOpen, setRecOpen] = React.useState(false);

  const reportA4Ref = React.useRef<HTMLDivElement | null>(null);
  const recA4Ref = React.useRef<HTMLDivElement | null>(null);

  // ✅ 복사 실패 대비: 수동 복사 다이얼로그
  const [copyOpen, setCopyOpen] = React.useState(false);
  const [copyTitle, setCopyTitle] = React.useState("");
  const [copyPayload, setCopyPayload] = React.useState("");

  const openManualCopy = (title: string, text: string) => {
    setCopyTitle(title);
    setCopyPayload(text);
    setCopyOpen(true);
  };

  const genReport = () => {
    setReportStatus("ready");
    setReportOpen(true);
  };
  const genRec = () => {
    setRecStatus("ready");
    setRecOpen(true);
  };

  // ----- 복사용 텍스트 생성 -----
  const reportCopyText = React.useMemo(() => {
    const aHead = ["구분", "품목명", "품목 단가", "수량", "단품 합계"];
    const aRows = pickedItems.map((it, idx) => [
      String(idx + 1),
      it.name,
      String(it.unitPrice),
      `${it.qty}대`,
      String(it.unitPrice * it.qty),
    ]);

    const bHead = ["구분", "품목명", "월 전기세", "월 수도세", "수량", "연간 합계"];
    const bRows = pickedItems.map((it, idx) => {
      const annual = calcAnnualPerUnit(it) * it.qty;
      return [String(idx + 1), it.name, String(it.elecMonthly), String(it.waterMonthly), `${it.qty}대`, String(annual)];
    });

    return [
      "설치 예산 검토 보고서 (POC)",
      "",
      "1. 예산 검토 개요",
      reportText.overview,
      reportText.conclusion,
      "",
      "2. 초기 설치비 산정 내역 (A)",
      tsvTable(aHead, aRows),
      `합계\t\t\t${pickedItems.reduce((a, x) => a + x.qty, 0)}대\t${sumInit}`,
      "",
      "3. 예상 연간 운영비 산정 내역 (B, 1년 기준)",
      tsvTable(bHead, bRows),
      `합계\t\t\t\t${pickedItems.reduce((a, x) => a + x.qty, 0)}대\t${sumAnnual}`,
      "",
      "4. 운영비 관리 포인트",
      reportText.opexPoint,
      "",
      reportText.notice,
    ].join("\n");
  }, [pickedItems, reportText, sumInit, sumAnnual]);

  const recCopyText = React.useMemo(() => {
    const head = ["구분", "품목명", "권장/매칭 설치", "수량", "초기 설치비(A)", "연간 운영비(B)"];
    const rows = recPlan.items.map((it: any, idx: number) => [
      String(idx + 1),
      it.name,
      it.matchedTypesText,
      `${it.qty}대`,
      String(it.initCostTotal),
      String(it.annualCostTotal),
    ]);

    const lt = selectedTypesArr.includes("전체") ? "전체" : selectedTypesArr.join(", ");

    return [
      "예산 범위 내 구성 방안 추천서 (POC)",
      "",
      "설치 위치 유형",
      lt,
      "",
      "1. 추천 산정 개요",
      recText.intro,
      "",
      "2. 추천 산정 기준",
      recText.basis,
      "",
      "3. 추천 구성 내역",
      tsvTable(head, rows),
      `합계\t\t\t${recPlan.totalQty}대\t${recPlan.sumInit}\t${recPlan.sumAnnual}`,
      "",
      "4. 예산 반영 결과",
      recText.result,
      "",
      "5. 전문가 인사이트(3개)",
      `- ${recText.insights[0]}`,
      `- ${recText.insights[1]}`,
      `- ${recText.insights[2]}`,
      "",
      "6. 더 나은 방안(검토 방향)",
      recText.betterPlan,
      "",
      "7. 구성 특징 및 유의사항",
      recText.note,
      "",
      "고지",
      "본 문서는 예산 운용 검토를 위한 참고 자료이며, 실제 설치 및 예산 집행 시에는 내부 검토 절차를 우선합니다.",
    ].join("\n");
  }, [recPlan, recText, selectedTypesArr]);

  // ----- 인쇄(현재 A4 영역 html만) -----
  const handlePrintReport = () => {
    const html = reportA4Ref.current?.innerHTML ?? "";
    if (!html) return;
    printHtml("설치 예산 검토 보고서", html);
  };
  const handlePrintRec = () => {
    const html = recA4Ref.current?.innerHTML ?? "";
    if (!html) return;
    printHtml("구성 방안 추천서", html);
  };

  // ----- 복사 핸들러 (execCommand 제거) -----
  const handleCopy = async (title: string, text: string) => {
    const res = await copyToClipboardSafe(text);
    if (!res.ok) {
      // 클립보드 실패 시: 수동 복사 다이얼로그 제공(Deprecated API 사용 안 함)
      openManualCopy(`${title} (수동 복사)`, text);
    }
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "rgba(255,216,216,0.4)",
          p: 2,
        }}
      >
        <Stack spacing={1.25}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, letterSpacing: "-0.01em" }}>
              AI 문서 작성 (POC)
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.25, lineHeight: 1.6 }}>
              설치 유형 선택 후 문서를 생성해 확인합니다. (API 연결 없음)
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 900 }}>
              설치 위치 유형
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
              {TYPES.map((t) => {
                const isSel = types.has(t);
                const isAll = t === ALL;

                return (
                  <Chip
                    key={t}
                    label={t}
                    size="small"
                    color={isSel ? "success" : "default"}
                    variant={isSel ? "filled" : "outlined"}
                    onClick={() => toggleType(t)}
                    sx={{
                      height: 28,
                      fontWeight: 800,
                      ...(isAll && isSel ? { bgcolor: "rgba(46,125,50,0.18)" } : null),
                    }}
                  />
                );
              })}
            </Stack>
          </Box>

          <Divider />

          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
            {/* 보고서 */}
            {reportStatus === "ready" ? (
              <>
                <Button
                  startIcon={<DescriptionOutlinedIcon />}
                  variant="contained"
                  color="success"
                  onClick={() => setReportOpen(true)}
                >
                  보고서 보기
                </Button>

                <Tooltip title="보고서 재생성">
                  <span>
                    <IconButton
                      size="small"
                      onClick={genReport}
                      disabled={!canGenerate}
                      sx={{ border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}
                    >
                      <RefreshIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </>
            ) : (
              <Tooltip title={canGenerate ? "" : "예산 입력 후 생성 가능합니다."}>
                <span>
                  <Button
                    startIcon={<DescriptionOutlinedIcon />}
                    variant="outlined"
                    onClick={genReport}
                    disabled={!canGenerate}
                  >
                    보고서 생성
                  </Button>
                </span>
              </Tooltip>
            )}

            {/* 추천서 */}
            {recStatus === "ready" ? (
              <>
                <Button
                  startIcon={<TipsAndUpdatesOutlinedIcon />}
                  variant="contained"
                  color="success"
                  onClick={() => setRecOpen(true)}
                >
                  추천서 보기
                </Button>

                <Tooltip title="추천서 재생성">
                  <span>
                    <IconButton
                      size="small"
                      onClick={genRec}
                      disabled={!canGenerate}
                      sx={{ border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}
                    >
                      <RefreshIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </>
            ) : (
              <Tooltip title={canGenerate ? "" : "예산 입력 후 생성 가능합니다."}>
                <span>
                  <Button
                    startIcon={<TipsAndUpdatesOutlinedIcon />}
                    variant="outlined"
                    onClick={genRec}
                    disabled={!canGenerate}
                  >
                    추천서 생성
                  </Button>
                </span>
              </Tooltip>
            )}
          </Stack>

          <Typography variant="caption" color="text.secondary">
            * 문서는 예산 입력 후 생성됩니다.
          </Typography>
        </Stack>
      </Paper>

      {/* ---------------- 수동 복사 Dialog (fallback) ---------------- */}
      <Dialog open={copyOpen} onClose={() => setCopyOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 900 }}>{copyTitle}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
            클립보드 자동 복사가 불가하여 수동 복사로 제공됩니다. 아래 내용을 드래그/선택 후 복사하세요.
          </Typography>
          <Box
            component="textarea"
            value={copyPayload}
            readOnly
            style={{
              width: "100%",
              minHeight: 360,
              padding: 12,
              borderRadius: 10,
              border: "1px solid #ddd",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
              fontSize: 12,
              lineHeight: 1.5,
              resize: "vertical",
            }}
            onFocus={(e: any) => e.currentTarget.select?.()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCopyOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>

      {/* ---------------- 보고서 Dialog ---------------- */}
      <Dialog open={reportOpen} onClose={() => setReportOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ fontWeight: 900 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Box sx={{ minWidth: 0 }}>
              <Typography fontWeight={900}>설치 예산 검토 보고서 (POC)</Typography>
            </Box>

            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ flexShrink: 0 }}>
              <Tooltip title="복사">
                <IconButton size="small" onClick={() => handleCopy("설치 예산 검토 보고서", reportCopyText)}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="인쇄">
                <IconButton size="small" onClick={handlePrintReport}>
                  <PrintIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="닫기">
                <IconButton size="small" onClick={() => setReportOpen(false)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          <div ref={reportA4Ref}>
            <A4Shell title="설치 예산 검토 보고서">
              <Stack spacing={2}>
                <Box>
                  <Typography fontWeight={900} sx={{ mb: 0.75 }}>
                    1. 예산 검토 개요
                  </Typography>
                  <Typography variant="body2" sx={{ lineHeight: 1.75 }}>
                    {reportText.overview}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, lineHeight: 1.75 }}>
                    {reportText.conclusion}
                  </Typography>
                </Box>

                <Box>
                  <Typography fontWeight={900} sx={{ mb: 1 }}>
                    2. 초기 설치비 산정 내역 (A)
                  </Typography>

                  {pickedItems.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      선택된 품목이 없습니다. (품목 선택 후 수량을 입력하세요)
                    </Typography>
                  ) : (
                    <DenseTable
                      head={["구분", "품목명", "품목 단가", "수량", "단품 합계"]}
                      rows={pickedItems.map((it, idx) => [
                        String(idx + 1),
                        it.name,
                        it.unitPrice,
                        `${it.qty}대`,
                        it.unitPrice * it.qty,
                      ])}
                      footer={["", "합계", "", `${pickedItems.reduce((a, x) => a + x.qty, 0)}대`, sumInit]}
                    />
                  )}
                </Box>

                <Box>
                  <Typography fontWeight={900} sx={{ mb: 1 }}>
                    3. 예상 연간 운영비 산정 내역 (B, 1년 기준)
                  </Typography>

                  {pickedItems.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      선택된 품목이 없습니다.
                    </Typography>
                  ) : (
                    <DenseTable
                      head={["구분", "품목명", "월 전기세", "월 수도세", "수량", "연간 합계"]}
                      rows={pickedItems.map((it, idx) => {
                        const annual = calcAnnualPerUnit(it) * it.qty;
                        return [String(idx + 1), it.name, it.elecMonthly, it.waterMonthly, `${it.qty}대`, annual];
                      })}
                      footer={["", "합계", "", "", `${pickedItems.reduce((a, x) => a + x.qty, 0)}대`, sumAnnual]}
                    />
                  )}
                </Box>

                <Box>
                  <Typography fontWeight={900} sx={{ mb: 0.75 }}>
                    4. 운영비 관리 포인트
                  </Typography>
                  <Typography variant="body2" sx={{ lineHeight: 1.75 }}>
                    {reportText.opexPoint}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6, display: "block" }}>
                    {reportText.notice}
                  </Typography>
                </Box>
              </Stack>
            </A4Shell>
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setReportOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>

      {/* ---------------- 추천서 Dialog ---------------- */}
      <Dialog open={recOpen} onClose={() => setRecOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ fontWeight: 900 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Box sx={{ minWidth: 0 }}>
              <Typography fontWeight={900}>예산 범위 내 구성 방안 추천서 (POC)</Typography>
            </Box>

            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ flexShrink: 0 }}>
              <Tooltip title="복사">
                <IconButton size="small" onClick={() => handleCopy("예산 범위 내 구성 방안 추천서", recCopyText)}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="인쇄">
                <IconButton size="small" onClick={handlePrintRec}>
                  <PrintIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="닫기">
                <IconButton size="small" onClick={() => setRecOpen(false)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          <div ref={recA4Ref}>
            <A4Shell title="예산 범위 내 구성 방안 추천서">
              <Stack spacing={2}>
                <Box>
                  <Typography fontWeight={900} sx={{ mb: 0.75 }}>
                    1. 추천 산정 개요
                  </Typography>
                  <Typography variant="body2" sx={{ lineHeight: 1.75 }}>
                    {recText.intro}
                  </Typography>
                </Box>

                <Box>
                  <Typography fontWeight={900} sx={{ mb: 0.75 }}>
                    2. 추천 산정 기준
                  </Typography>
                  <Typography variant="body2" sx={{ lineHeight: 1.75 }}>
                    {recText.basis}
                  </Typography>
                </Box>

                <Box>
                  <Typography fontWeight={900} sx={{ mb: 1 }}>
                    3. 추천 구성 내역
                  </Typography>

                  {recPlan.items.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      추천 구성을 산정할 수 없습니다. (예산 또는 설치 유형 조건을 확인하세요)
                    </Typography>
                  ) : (
                    <DenseTable
                      head={["구분", "품목명", "권장/매칭 설치", "수량", "초기 설치비(A)", "연간 운영비(B)"]}
                      rows={recPlan.items.map((it: any, idx: number) => [
                        String(idx + 1),
                        it.name,
                        it.matchedTypesText,
                        `${it.qty}대`,
                        it.initCostTotal,
                        it.annualCostTotal,
                      ])}
                      footer={["", "합계", "", `${recPlan.totalQty}대`, recPlan.sumInit, recPlan.sumAnnual]}
                    />
                  )}
                </Box>

                <Box>
                  <Typography fontWeight={900} sx={{ mb: 0.75 }}>
                    4. 예산 반영 결과
                  </Typography>
                  <Typography variant="body2" sx={{ lineHeight: 1.75 }}>
                    {recText.result}
                  </Typography>
                </Box>

                <Box>
                  <Typography fontWeight={900} sx={{ mb: 0.75 }}>
                    5. 전문가 인사이트(3개)
                  </Typography>
                  <Box component="ul" sx={{ m: 0, pl: 2.25 }}>
                    {recText.insights.map((t, i) => (
                      <Typography key={i} component="li" variant="body2" sx={{ lineHeight: 1.75, mb: 0.25 }}>
                        {t}
                      </Typography>
                    ))}
                  </Box>
                </Box>

                <Box>
                  <Typography fontWeight={900} sx={{ mb: 0.75 }}>
                    6. 더 나은 방안(검토 방향)
                  </Typography>
                  <Typography variant="body2" sx={{ lineHeight: 1.75 }}>
                    {recText.betterPlan}
                  </Typography>
                </Box>

                <Box>
                  <Typography fontWeight={900} sx={{ mb: 0.75 }}>
                    7. 구성 특징 및 유의사항
                  </Typography>
                  <Typography variant="body2" sx={{ lineHeight: 1.75 }}>
                    {recText.note}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 0.75, lineHeight: 1.6 }}
                  >
                    본 문서는 예산 운용 검토를 위한 참고 자료이며, 실제 설치 및 예산 집행 시에는 내부 검토 절차를 우선합니다.
                  </Typography>
                </Box>
              </Stack>
            </A4Shell>
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setRecOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
