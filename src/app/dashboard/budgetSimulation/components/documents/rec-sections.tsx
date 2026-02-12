import * as React from "react";
import { Box, Stack, Typography } from "@mui/material";

import DenseTable from "@/app/dashboard/budgetSimulation/components/documents/dense-table";
import type { RecommendationText } from "@/types/budgetSimulation/documents";

type RecItem = {
  name: string;
  matchedTypesText: string;
  qty: number;
  initCostTotal: number;
  annualCostTotal: number;
};

type RecPlan = {
  items: RecItem[];
  totalQty: number;
  sumInit: number;
  sumAnnual: number;
};

type RecSectionsProps = {
  recText: RecommendationText;
  recPlan: RecPlan;
};

const cardSx = {
  p: 3,
  borderRadius: 2,
  background: "rgba(255,255,255,0.7)",
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 12px 24px rgba(15,23,42,0.08)",
  backdropFilter: "blur(6px)",
};

const accentCardSx = {
  ...cardSx,
  bgcolor: "rgba(34,197,94,0.08)",
  border: "1px solid rgba(34,197,94,0.25)",
};

export default function RecSections({ recText, recPlan }: RecSectionsProps) {
  return (
    <Stack spacing={2}>
      <Box sx={accentCardSx}>
        <Typography fontWeight={900} sx={{ mb: 1, fontSize: 18 }}>
          1. 추천 산정 개요
        </Typography>
        <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
          {recText.intro}
        </Typography>
      </Box>

      <Box sx={cardSx}>
        <Typography fontWeight={900} sx={{ mb: 1, fontSize: 18 }}>
          2. 추천 산정 기준
        </Typography>
        <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
          {recText.basis}
        </Typography>
      </Box>

      <Box sx={cardSx}>
        <Typography fontWeight={900} sx={{ mb: 1, fontSize: 18 }}>
          3. 추천 구성 내역
        </Typography>

        {recPlan.items.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            추천 구성을 산정할 수 없습니다. (예산 또는 설치 유형 조건을 확인하세요)
          </Typography>
        ) : (
          <DenseTable
            head={["구분", "품목명", "권장/매칭 설치", "수량", "초기 설치비(A)", "연간 운영비(B)"]}
            rows={recPlan.items.map((it, idx) => [
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

      <Box sx={cardSx}>
        <Typography fontWeight={900} sx={{ mb: 1, fontSize: 18 }}>
          4. 예산 반영 결과
        </Typography>
        <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
          {recText.result}
        </Typography>
      </Box>

      <Box sx={cardSx}>
        <Typography fontWeight={900} sx={{ mb: 1, fontSize: 18 }}>
          5. 전문가 인사이트(4개)
        </Typography>
        <Stack spacing={1}>
          {recText.insights.map((t, i) => {
            const entries = Object.entries(t ?? {});
            const expert = entries[0]?.[0] ?? `전문가 ${i + 1}`;
            const text = entries[0]?.[1] ?? "";
            return (
            <Box
              key={i}
              sx={{
                borderRadius: 2,
                border: "1px solid rgba(15,23,42,0.08)",
                background: "rgba(255,255,255,0.95)",
                boxShadow: "0 8px 18px rgba(15,23,42,0.06)",
                px: 2,
                py: 1.5,
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  border: "1px solid rgba(16,185,129,0.35)",
                  color: "#0f766e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: 12,
                  flexShrink: 0,
                  mt: "2px",
                  background: "rgba(16,185,129,0.08)",
                }}
              >
                {i + 1}
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 800 }}>
                  {expert} 전문가
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.75, fontWeight: 600, mt: 0.25 }}>
                  {text}
                </Typography>
              </Box>
            </Box>
          );
          })}
        </Stack>
      </Box>

      <Box sx={cardSx}>
        <Typography fontWeight={900} sx={{ mb: 1, fontSize: 18 }}>
          6. 더 나은 방안(검토 방향)
        </Typography>
        <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
          {recText.betterPlan}
        </Typography>
      </Box>

      <Box sx={cardSx}>
        <Typography fontWeight={900} sx={{ mb: 1, fontSize: 18 }}>
          7. 구성 특징 및 유의사항
        </Typography>
        <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
          {recText.caution}
        </Typography>
      </Box>

      <Box
        sx={{
          borderRadius: 2,
          border: "1px dashed rgba(15,23,42,0.2)",
          background: "rgba(15,23,42,0.03)",
          px: 1.5,
          py: 1,
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6, display: "block" }}>
          {recText.note}
        </Typography>
      </Box>
    </Stack>
  );
}
