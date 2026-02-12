// src/app/dashboard/AIBestLocation/components/states/idle-state.tsx
"use client";

import * as React from "react";
import { Box, Stack, Typography, useTheme } from "@mui/material";

import SatelliteAltRoundedIcon from "@mui/icons-material/SatelliteAltRounded";
import DeviceThermostatRoundedIcon from "@mui/icons-material/DeviceThermostatRounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

type FeatureItem = {
  label: string;
  desc?: string;
  Icon: React.ElementType;
  secondaryIcon?: React.ElementType;
};

const FEATURE_ITEMS: FeatureItem[] = [
  { label: "LST", desc: "지표면 온도", Icon: SatelliteAltRoundedIcon },
  { label: "기상", desc: "실측 데이터", Icon: DeviceThermostatRoundedIcon },
  { label: "NDVI", desc: "식생지수", Icon: SpaRoundedIcon },
  { label: "인구", desc: "노출도", Icon: GroupsRoundedIcon },
  { label: "취약성", desc: "사회적", Icon: PersonRoundedIcon, secondaryIcon: AccessTimeRoundedIcon },
];

function FeatureIcon({
                       Icon,
                       SecondaryIcon,
                       accent,
                     }: {
  Icon: React.ElementType;
  SecondaryIcon?: React.ElementType;
  accent: string;
}) {
  const theme = useTheme();

  const ring = theme.vars
    ? `1px solid rgba(${theme.vars.palette.primary.mainChannel} / 0.18)`
    : `1px solid rgba(0,0,0,0.06)`;

  const softBg = theme.vars
    ? `linear-gradient(180deg,
        rgba(${theme.vars.palette.primary.mainChannel} / 0.12),
        rgba(${theme.vars.palette.primary.mainChannel} / 0.05)
      )`
    : `linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.02))`;

  return (
    <Box
      sx={{
        position: "relative",
        width: 84,
        height: 84,
        borderRadius: "999px",
        display: "grid",
        placeItems: "center",
        background: softBg,
        border: ring,
        boxShadow: "0 18px 40px rgba(0,0,0,0.10)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Icon sx={{ fontSize: 42, color: accent }} />

      {SecondaryIcon && (
        <Box
          sx={{
            position: "absolute",
            right: -2,
            bottom: -2,
            width: 30,
            height: 30,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            bgcolor: "background.paper",
            border: theme.vars
              ? `1px solid rgba(${theme.vars.palette.primary.mainChannel} / 0.22)`
              : "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 12px 26px rgba(0,0,0,0.14)",
          }}
        >
          <SecondaryIcon sx={{ fontSize: 18, color: accent }} />
        </Box>
      )}
    </Box>
  );
}

export default function IdleState() {
  const theme = useTheme();
  const accent = theme.palette.primary.main;

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        mx: "auto",
        px: { xs: 2, sm: 3, md: 5 },
        py: { xs: 4, sm: 5, md: 6 },
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: theme.vars
            ? `linear-gradient(180deg,
                rgba(${theme.vars.palette.primary.mainChannel} / 0.05),
                transparent 55%
              )`
            : "linear-gradient(180deg, rgba(0,0,0,0.03), transparent 55%)",
          pointerEvents: "none",
          zIndex: 0,
        },
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1, maxWidth: 1100, mx: "auto" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(3, minmax(0, 1fr))",
              md: "repeat(5, minmax(0, 1fr))",
            },
            gap: { xs: 2.5, sm: 3.5, md: 4 },
            justifyItems: "center",
            alignItems: "start",
            mb: { xs: 4, sm: 5, md: 6 },
          }}
        >
          {FEATURE_ITEMS.map(({ label, desc, Icon, secondaryIcon }, idx) => (
            <Stack key={`${label}-${idx}`} alignItems="center" spacing={1} sx={{ textAlign: "center" }}>
              <FeatureIcon Icon={Icon} SecondaryIcon={secondaryIcon} accent={accent} />

              <Stack spacing={0.1} alignItems="center">
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: 14, md: 15 },
                    letterSpacing: "-0.35px",
                    color: "text.primary",
                  }}
                >
                  {label}
                </Typography>
                {desc ? (
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: 12, md: 12.5 },
                      color: "text.secondary",
                      letterSpacing: "-0.15px",
                    }}
                  >
                    {desc}
                  </Typography>
                ) : null}
              </Stack>
            </Stack>
          ))}
        </Box>

        <Stack alignItems="center" spacing={{ xs: 1.4, md: 1.8 }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: { xs: 20, sm: 22, md: 26 },
              letterSpacing: "-0.7px",
              textAlign: "center",
            }}
          >
            쿨링 포그의 최적 설치 위치를 찾아드립니다
          </Typography>

          <Typography
            sx={{
              maxWidth: 830,
              fontSize: { xs: 13.5, md: 15 },
              lineHeight: { xs: 1.85, md: 1.9 },
              letterSpacing: "-0.2px",
              color: "text.secondary",
              textAlign: "center",
            }}
          >
            지표면온도(LST), 기상 실측 데이터, 식생지수(NDVI), 인구 노출도 및 사회적 취약성 등을
            정책적 중요도로 종합 분석하여 폭염에 취약한 지역을 도출하고, 쿨링포그 설치 시 체감온도
            저감과 시민 보호 효과가 높은 최적의 설치 위치와 정량적 설치 우선순위를 제시합니다.
          </Typography>

          <Box
            sx={{
              mt: { xs: 0.5, md: 1 },
              px: { xs: 2, md: 2.5 },
              py: { xs: 1.1, md: 1.25 },
              borderRadius: 999,
              border: theme.vars
                ? `1px solid rgba(${theme.vars.palette.primary.mainChannel} / 0.18)`
                : "1px solid rgba(0,0,0,0.08)",
              bgcolor: theme.vars
                ? `rgba(${theme.vars.palette.primary.mainChannel} / 0.06)`
                : "rgba(0,0,0,0.03)",
            }}
          >
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: { xs: 13.5, md: 14.5 },
                letterSpacing: "-0.25px",
                textAlign: "center",
                color: "text.primary",
              }}
            >
              옵션을 설정하고{" "}
              <Box component="span" sx={{ color: accent, fontWeight: 950 }}>
                ‘쿨링포그 최적 위치 추천’
              </Box>
              을 눌러주세요.
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
