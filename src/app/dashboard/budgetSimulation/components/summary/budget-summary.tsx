import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import MoneyBlock from "@/app/dashboard/budgetSimulation/components/summary/money-block";
import { formatKRW } from "@/app/dashboard/budgetSimulation/lib/budget-utils";
import {
  UI_BG_SUMMARY_CARD,
  UI_BG_SUMMARY_C_HIGHLIGHT,
  UI_BORDER_RADIUS,
  UI_CHIP_NOCLICK_SX,
} from "@/app/dashboard/budgetSimulation/components/ui-constants";

type Props = {
  years: number;
  selectedItemCount: number;
  totalQty: number;
  sumInit: number;
  sumAnnual: number;
  sumTotal: number;
  budget: number;
  usagePct: number;
  progressPct: number;
  remain: number;
  status: "none" | "ok" | "over";
};

export default function BudgetSummary({
  years,
  selectedItemCount,
  totalQty,
  sumInit,
  sumAnnual,
  sumTotal,
  budget,
  usagePct,
  progressPct,
  remain,
  status,
}: Props) {
  const over = remain < 0;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: UI_BORDER_RADIUS,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: UI_BG_SUMMARY_CARD,
        p: 3,
      }}
    >
      <Stack spacing={1.25}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 900, letterSpacing: "-0.01em" }}>
            예산 요약
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.25 }}>
            선택된 품목 기준으로 합계를 계산합니다.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          <Chip size="small" color="warning" label={`운영기간 ${years}년`} sx={{ height: 26, ...UI_CHIP_NOCLICK_SX }} />
          <Chip size="small" color="primary" label={`선택 품목 ${selectedItemCount}개`} sx={{ height: 26, ...UI_CHIP_NOCLICK_SX }} />
          <Chip size="small" color="info" label={`총 설치 ${totalQty}대`} sx={{ height: 26, ...UI_CHIP_NOCLICK_SX }} />
        </Stack>

        <Stack spacing={0.75}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="text.secondary">
              예산 사용률(%)
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 900 }} color={status === "over" ? "error.main" : "text.primary"}>
              {budget > 0 ? `${usagePct.toFixed(1)}%` : "예산 미입력"}
            </Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={budget > 0 ? progressPct : 0}
            color={status === "over" ? "error" : "success"}
            sx={{
              height: 10,
              borderRadius: 999,
            }}
          />

          <Typography variant="caption" sx={{ fontWeight: 900, textAlign: "end" }} color={status === "over" ? "error.main" : "text.primary"}>
            {budget <= 0 ? "가용 예산을 입력하세요" : over ? `부족 ${formatKRW(Math.abs(remain))}` : `잔액 ${formatKRW(remain)}`}
          </Typography>
        </Stack>

        <Divider />

        <Stack spacing={1}>
          <MoneyBlock label="A. 초기 설치비 합계" value={sumInit} />
          <Divider />
          <MoneyBlock label="B. 예상 연간 운영비 합계" value={sumAnnual} />

          <Box
            sx={{
              p: 1.8,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: UI_BG_SUMMARY_C_HIGHLIGHT,
            }}
          >
            <MoneyBlock label={`C. 운영기간 총 소요 예산(${years}년)`} value={sumTotal} emphasize />
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.75 }}>
              C = A + (B × 운영기간)
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
}
