'use client';

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function IdleState() {
  return (
    <Box
      sx={{
        py: 8,
        px: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 3,
      }}
    >
      <Box
        component="img"
        src="/assets/locationIdle.svg"
        alt="idle"
        sx={{ width: 240, maxWidth: "100%", mb: 7}}
      />

      <Typography variant="h6" sx={{ fontWeight: 900 }}>
        쿨링 포그의 최적 설치 위치를 찾아드립니다
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 560, lineHeight: 1.75 }}>
        취약 계층 보호 우선, 유동 인구 우선, 체감 온도 저감 우선 등 설치 목적을 선택하시면 기온,
        유동인구, 취약지표 데이터를 분석해 쿨링포그 설치에 가장 적합한 위치를 추천합니다.
      </Typography>

      <Typography variant="body2" sx={{ fontWeight: 800, mt: 1 }}>
        왼쪽에서 조건을 설정하고 ‘AI 최적위치 추천’을 눌러주세요.
      </Typography>
    </Box>
  );
}
