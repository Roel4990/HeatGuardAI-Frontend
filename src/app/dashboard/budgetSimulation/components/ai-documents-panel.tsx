"use client";

import * as React from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";

import RefreshIcon from "@mui/icons-material/Refresh";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import ReportDialog from "@/app/dashboard/budgetSimulation/components/documents/report-dialog";
import RecDialog from "@/app/dashboard/budgetSimulation/components/documents/rec-dialog";
import A4Shell from "@/app/dashboard/budgetSimulation/components/documents/a4-shell";
import ReportSections from "@/app/dashboard/budgetSimulation/components/documents/report-sections";
import RecSections from "@/app/dashboard/budgetSimulation/components/documents/rec-sections";
import type { BudgetItemLike, RecommendationText, ReportContent, ReportSnapshot } from "@/types/budgetSimulation/documents";

export type LocationType =
  | "전체"
  | "공원"
  | "광장"
  | "버스 정류장"
  | "보행로"
  | "시장"
  | "주거 밀집"
  | "취약시설 주변"
  | "공공시설";

export type AIDocumentsPanelProps = {
  years: number;
  budget: number;
  pickedItems: BudgetItemLike[]; // 선택된 품목(요약/보고서)
  allItems: BudgetItemLike[]; // 전체 품목(추천서 산정)
};

type DocStatus = "idle" | "ready";
type ReportText = ReturnType<typeof buildReportDummyText>;
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
  if (has("버스") || has("정류장") || has("버스정류장") || has("버스 정류장")) tags.add("버스 정류장");
  if (has("보행로") || has("산책로") || has("경로") || has("입구")) tags.add("보행로");
  if (has("시장") || has("전통시장") || has("상가")) tags.add("시장");
  if (has("주거") || has("주택") || has("아파트") || has("주거지") || has("밀집")) tags.add("주거 밀집");
  if (has("취약시설") || has("복지") || has("노인") || has("요양") || has("장애")) tags.add("취약시설 주변");
  if (has("공공시설") || has("시설") || has("청사") || has("센터")) tags.add("공공시설");

  // 펜스/구조물 → 공공시설로 임시
  if (has("펜스") || has("구조물")) tags.add("공공시설");

  return tags;
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
  const { years, budget, sumInit, sumTotal, usagePct, remain, topOpex } = args;

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
    businessOverview: `본 사업은 폭염 대응을 위해 쿨링포그를 설치하여 시민 체감온도 저감과 건강 보호를 도모하는 것을 목적으로 합니다. 쿨링포그 설치를 통해 보행·체류 구간의 열환경 개선 효과를 기대할 수 있습니다.`,
    overview: `본 보고서는 선택된 품목 및 설치 수량을 기준으로 초기 설치비(A)와 연간 운영비(B)를 산정하고, 운영기간 ${years}년 기준 총 소요 예산(C)을 검토하기 위해 작성되었습니다.`,
    conclusion: `${budgetLine} ${remainLine}`.trim(),
    initCostAssessment: `초기 설치비 합계(A)는 ${formatKRW(sumInit)}이며, 가용 예산 ${formatKRW(
      budget
    )} 대비 사용률 ${usagePct.toFixed(1)}% 수준으로 산정됩니다. 예산 잔여/부족 금액 ${formatKRW(
      remain
    )}을 고려할 때 초기 설치비는 예산 범위 내 합리적인 수준으로 판단됩니다.`,
    totalCostAnalysis: `운영기간 ${years}년 기준 총 소요 예산(C)은 초기 설치비(A)와 연간 운영비(B)의 누적 합으로 산정되며, 운영기간이 증가할수록 운영비 누적 영향이 확대됩니다.`,
    expectedEffect: `예산 집행을 통해 고온 취약 구간의 체감온도 저감 및 시민 체감 개선 효과를 기대할 수 있습니다. 특히 보행 동선 및 체류 공간 중심의 설치는 정책 효과를 높일 것으로 판단됩니다.`,
    riskManagement: `리스크 요인으로는 운영비 증가, 현장 여건 변화, 유지관리 부담이 있으며, 운영비 추이 모니터링 및 설치 우선순위 재조정 등 관리 방안을 병행할 필요가 있습니다.`,
    finalOpinion: `종합적으로 본 구성(안)은 예산 범위 내에서 추진 가능성이 있으며, 단계적 집행과 성과 모니터링을 병행하는 것이 적절합니다.`,
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

export default function AIDocumentsPanel(props: AIDocumentsPanelProps) {
  const { years, budget, pickedItems, allItems } = props;

  const ALL: LocationType = "전체";
  const TYPES: LocationType[] = [
    "전체",
    "공원",
    "광장",
    "버스 정류장",
    "보행로",
    "시장",
    "주거 밀집",
    "취약시설 주변",
    "공공시설",
  ];

  const [types, setTypes] = React.useState<Set<LocationType>>(() => new Set([ALL]));
  const selectedTypesArr = React.useMemo(() => Array.from(types), [types]);
  const selectedTypesLabel = React.useMemo(
    () => (selectedTypesArr.includes(ALL) ? TYPES.filter((t) => t !== ALL).join(", ") : selectedTypesArr.join(", ")),
    [selectedTypesArr]
  );
  const selectedTypesForReport = React.useMemo(
    () => (selectedTypesArr.includes(ALL) ? TYPES.filter((t) => t !== ALL) : selectedTypesArr),
    [selectedTypesArr]
  );

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
  const canGenerate = budget > 0 && pickedItems.length > 0;
  const [reportStatus, setReportStatus] = React.useState<DocStatus>("idle");
  const [reportOpen, setReportOpen] = React.useState(false);
  const [reportLoading, setReportLoading] = React.useState(false);
  const [reportAi, setReportAi] = React.useState<ReportContent | null>(null);
  const [reportSnapshot, setReportSnapshot] = React.useState<ReportText | null>(null);
  const [reportSnapshotMeta, setReportSnapshotMeta] = React.useState<ReportSnapshot | null>(null);

  const [recStatus, setRecStatus] = React.useState<DocStatus>("idle");
  const [recOpen, setRecOpen] = React.useState(false);
  const [recSnapshot, setRecSnapshot] = React.useState<RecommendationText | null>(null);

  const reportA4Ref = React.useRef<HTMLDivElement | null>(null);
  const recA4Ref = React.useRef<HTMLDivElement | null>(null);

  const resetDocs = () => {
    setReportStatus("idle");
    setReportOpen(false);
    setReportAi(null);
    setReportSnapshot(null);
    setReportSnapshotMeta(null);
    setRecStatus("idle");
    setRecOpen(false);
    setRecSnapshot(null);
  };

  const genReport = async () => {
    if (!canGenerate || reportLoading) return;
    setReportStatus("idle");
    setReportSnapshot(reportText);
    setReportAi(null);
    setReportSnapshotMeta({
      years,
      budget,
      selectedTypesLabel,
      pickedItems: pickedItems.map((it) => ({ ...it })),
      sumInit,
      sumAnnual,
      sumTotal,
      usagePct,
      remain,
      topOpex: topOpex ?? undefined,
    });
    setReportLoading(true);
    try {
      const res = await axios.post("/api/budgetSimulation/report", {
        years,
        budget,
        sumInit,
        sumAnnual,
        sumTotal,
        usagePct,
        remain,
        topOpex: topOpex ?? undefined,
        locationTypes: selectedTypesForReport,
        items: pickedItems.map((it) => ({
          name: it.name,
          unitPrice: it.unitPrice,
          elecMonthly: it.elecMonthly,
          waterMonthly: it.waterMonthly,
          qty: it.qty,
        })),
      });
      console.log("[budgetSimulation/report] response", res?.data);
      const report = res?.data?.report;
      if (report && report.businessOverview && report.overview && report.conclusion) {
        setReportAi(report);
      }
      setReportStatus("ready");
      setReportOpen(true);
    } catch {
      console.log("[budgetSimulation/report] request failed");
      setReportStatus("ready");
      setReportOpen(true);
    } finally {
      setReportLoading(false);
    }
  };
  const genRec = () => {
    setRecSnapshot(recText);
    setRecStatus("ready");
    setRecOpen(true);
  };

  // ----- 복사용 텍스트 생성 -----
  const reportTextEffective: ReportContent | ReportText = reportAi ?? reportSnapshot ?? reportText;
  const recTextEffective = recSnapshot ?? recText;
  const reportView = reportSnapshotMeta ?? {
    years,
    budget,
    selectedTypesLabel,
    pickedItems,
    sumInit,
    sumAnnual,
    sumTotal,
    usagePct,
    remain,
    topOpex: topOpex ?? undefined,
  };
  const reportUsageColor = reportView.remain < 0 ? "rgba(229,57,53,0.75)" : "rgba(25,118,210,0.7)";
  const reportUsageBgColor = reportView.remain < 0 ? "rgba(229,57,53,0.18)" : "rgba(25,118,210,0.15)";
  const expectedEffectLines = React.useMemo(
    () =>
      Array.isArray(reportTextEffective.expectedEffect)
        ? reportTextEffective.expectedEffect.map((line) => String(line).trim()).filter(Boolean)
        : [],
    [reportTextEffective.expectedEffect]
  );
  const riskItems = React.useMemo(
    () =>
      Array.isArray(reportTextEffective.riskManagement)
        ? reportTextEffective.riskManagement
            .map((item) => ({
              risk: String(item?.risk ?? "").trim(),
              mitigation: String(item?.mitigation ?? "").trim(),
            }))
            .filter((item) => item.risk || item.mitigation)
        : [],
    [reportTextEffective.riskManagement]
  );

  // 복사용 텍스트 제거

  // 복사/인쇄 기능 제거

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
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, letterSpacing: "-0.01em" }}>
                  AI 문서 작성
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 0.25, lineHeight: 1.6 }}
                >
                  설치 유형 선택 후 문서를 생성해 확인합니다.
                </Typography>
              </Box>
              <Tooltip title={canGenerate ? "보고서 새로고침" : "예산 입력 및 품목 선택 후 사용 가능합니다."}>
                <span>
                    <IconButton
                      size="small"
                      onClick={() => {
                        resetDocs();
                        void genReport();
                      }}
                      disabled={!canGenerate}
                      sx={{ border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}
                    >
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 900 }}>
              설치 위치 유형
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
              {TYPES.map((t) => {
                const isSel = types.has(t);
                return (
                  <Chip
                    key={t}
                    label={t}
                    size="small"
                    color={isSel ? "primary" : "default"}
                    variant={isSel ? "filled" : "outlined"}
                    onClick={() => toggleType(t)}
                    sx={{
                      height: 28,
                      fontWeight: 800,
                      "&:hover": {
                        bgcolor: isSel ? "rgba(59,130,246,0.24)" : "rgba(59,130,246,0.08)",
                        borderColor: "rgba(59,130,246,0.45)",
                      },
                      ...(isSel
                        ? {
                            bgcolor: "rgba(59,130,246,0.18)",
                            borderColor: "rgba(59,130,246,0.45)",
                            color: "#1D4ED8",
                          }
                        : null),
                    }}
                  />
                );
              })}
            </Stack>
          </Box>

          <Divider />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1,
              width: "100%",
            }}
          >
            {/* 보고서 */}
            {reportStatus === "ready" ? (
              <>
                <Button
                  startIcon={<DescriptionOutlinedIcon />}
                  variant="contained"
                  color="primary"
                  onClick={() => setReportOpen(true)}
                  fullWidth
                  sx={{ minWidth: 0 }}
                >
                  보고서 보기
                </Button>

              </>
            ) : (
              <Tooltip title={canGenerate ? "보고서 생성하기" : "예산 입력 및 품목 선택 후 생성 가능합니다."}>
                <span style={{ display: "block", width: "100%" }}>
                    <Button
                      startIcon={reportLoading ? <CircularProgress size={16} /> : <DescriptionOutlinedIcon />}
                      variant="outlined"
                      onClick={() => void genReport()}
                      disabled={!canGenerate || reportLoading}
                      fullWidth
                      sx={{ minWidth: 0 }}
                    >
                      {reportLoading ? "보고서 생성 중" : "보고서 생성"}
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
                  color="primary"
                  onClick={() => setRecOpen(true)}
                  fullWidth
                  sx={{ minWidth: 0 }}
                >
                  추천서 보기
                </Button>

              </>
            ) : (
              <Tooltip title={canGenerate ? "추천서 생성하기" : "예산 입력 및 품목 선택 후 생성 가능합니다."}>
                <span style={{ display: "block", width: "100%" }}>
                  <Button
                    startIcon={<TipsAndUpdatesOutlinedIcon />}
                    variant="outlined"
                    onClick={genRec}
                    disabled={!canGenerate}
                    fullWidth
                    sx={{ minWidth: 0 }}
                  >
                    추천서 생성
                  </Button>
                </span>
              </Tooltip>
            )}
          </Box>

          <Typography variant="caption" color="text.secondary">
            * 문서는 예산 입력 후 생성됩니다.
          </Typography>
        </Stack>
      </Paper>

      {/* ---------------- 보고서 Dialog ---------------- */}
      <ReportDialog
        open={reportOpen}
        title="쿨링포그 설치 예산 검토 보고서"
        onClose={() => setReportOpen(false)}
        onRegenerate={() => void genReport()}
      >
        <div ref={reportA4Ref}>
          <A4Shell title="쿨링포그 설치 예산 검토 보고서">
            <ReportSections
              reportText={reportTextEffective}
              reportView={reportView}
              expectedEffectLines={expectedEffectLines}
              riskItems={riskItems}
              formatKRW={formatKRW}
              calcAnnualPerUnit={calcAnnualPerUnit}
              reportUsageColor={reportUsageColor}
              reportUsageBgColor={reportUsageBgColor}
            />
          </A4Shell>
        </div>
      </ReportDialog>

      {/* ---------------- 추천서 Dialog ---------------- */}
      <RecDialog
        open={recOpen}
        title="예산 범위 내 구성 방안 추천서"
        onClose={() => setRecOpen(false)}
        onRegenerate={genRec}
      >
        <div ref={recA4Ref}>
          <A4Shell title="예산 범위 내 구성 방안 추천서">
            <RecSections recText={recTextEffective} recPlan={recPlan} />
          </A4Shell>
        </div>
      </RecDialog>
    </>
  );
}




