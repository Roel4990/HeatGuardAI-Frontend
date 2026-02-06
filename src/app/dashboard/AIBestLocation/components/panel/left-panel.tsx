'use client';

import * as React from "react";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { region_map } from "@/app/dashboard/data/AIBestLocation/region-map";
import type { RecoRequestBody } from "@/types/AIBestLocation/reco";

const clampCount = (n: number) => Math.min(5, Math.max(1, Math.floor(n)));

type Props = {
  headerHeight: number;
  value: RecoRequestBody;
  onChangeAction: (next: Partial<RecoRequestBody>) => void;
  onSubmitAction: () => void;
  isLoading: boolean;
};

function StepBox({
                   title,
                   children,
                   width,
                   flex,
                 }: {
  title: string;
  children: React.ReactNode;
  width?: number | string;
  flex?: number;
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, width, flex, minWidth: 0 }}>
      <Typography variant="subtitle2" sx={{ whiteSpace: "nowrap" }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function StepChevron() {
  return (
    <Box
      sx={{
        alignSelf: "flex-end",
        mb: "4px",
        mx: 0.75,
        width: 32,
        height: 32,
        borderRadius: "999px",
        bgcolor: "action.hover",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 auto",
      }}
    >
      <ChevronRightIcon sx={{ fontSize: 22, color: "text.secondary" }} />
    </Box>
  );
}

export default function LeftPanel({
                                    headerHeight,
                                    value,
                                    onChangeAction,
                                    onSubmitAction,
                                    isLoading,
                                  }: Props) {
  const districts = Object.keys(region_map);
  const neighborhoods = value.target_region_gu ? (region_map[value.target_region_gu] ?? []) : [];

  const handleDecrease = () =>
    onChangeAction({ target_count: clampCount(value.target_count - 1) });
  const handleIncrease = () =>
    onChangeAction({ target_count: clampCount(value.target_count + 1) });

  // 공통: TextField를 더 컴팩트하게
  const compactTfSx = {
    "& .MuiInputBase-root": { height: 44 }, // 기본 56 -> 44로 축소
    "& .MuiInputBase-input": { py: 0.75 },
  };

  return (
    <Paper
      elevation={4}
      sx={{
        border: "1px solid  #E3E8F2",
        borderRadius: 2,
        p: 2.2,
        overflowX: "hidden", // ✅ 가로 스크롤 금지
        // ✅ headerHeight 사용(미사용 경고 제거) + 화면에서 패널이 넘치지 않도록
        maxHeight: `calc(100dvh - ${headerHeight}px - 24px)`,
        overflowY: "auto",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="flex-start"
        sx={{
          width: "100%",
          minWidth: 0,
        }}
      >
        {/* 1 */}
        <StepBox title="1. 설치 목표 위치 개수" width={170}>
          <TextField
            fullWidth
            size="small"
            sx={compactTfSx}
            type="number"
            value={value.target_count}
            onChange={(event) => {
              const n = Number(event.target.value);
              onChangeAction({ target_count: clampCount(Number.isNaN(n) ? 1 : n) });
            }}
            slotProps={{
              htmlInput: { min: 1, max: 5 },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton onClick={handleDecrease} disabled={value.target_count <= 1 || isLoading}>
                      -
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Stack direction="row" spacing={0.75} alignItems="center">
                      <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                        개소
                      </Typography>
                      <IconButton onClick={handleIncrease} disabled={value.target_count >= 5 || isLoading}>
                        +
                      </IconButton>
                    </Stack>
                  </InputAdornment>
                ),
              },
            }}
          />
        </StepBox>

        <StepChevron />

        {/* 2 */}
        <StepBox title="2. 지역 선택" flex={1}>
          <Stack direction="row" spacing={1} sx={{ minWidth: 0 }}>
            <TextField
              select
              size="small"
              sx={{ ...compactTfSx, minWidth: 160, flex: 1 }}
              value={value.target_region_gu}
              onChange={(event) => {
                onChangeAction({
                  target_region_gu: event.target.value,
                  target_region_dong: "",
                });
              }}
              disabled={isLoading}
              // ✅ SelectProps(deprecated) -> slotProps.select 로 교체
              slotProps={{
                select: {
                  displayEmpty: true,
                  renderValue: (selected) => (selected ? String(selected) : "행정구 전체"),
                },
              }}
            >
              <MenuItem value="">행정구 전체</MenuItem>
              {districts.map((gu) => (
                <MenuItem key={gu} value={gu}>
                  {gu}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              size="small"
              sx={{ ...compactTfSx, minWidth: 160, flex: 1 }}
              value={value.target_region_dong}
              onChange={(event) => onChangeAction({ target_region_dong: event.target.value })}
              disabled={!value.target_region_gu || isLoading}
              // ✅ SelectProps(deprecated) -> slotProps.select 로 교체
              slotProps={{
                select: {
                  displayEmpty: true,
                  renderValue: (selected) => {
                    if (!value.target_region_gu) return "행정동 전체";
                    return selected ? String(selected) : "행정동 전체";
                  },
                },
              }}
            >
              <MenuItem value="">행정동 전체</MenuItem>
              {neighborhoods.map((dong) => (
                <MenuItem key={dong} value={dong}>
                  {dong}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </StepBox>

        <StepChevron />

        {/* 3 */}
        <StepBox title="3. 우선순위 옵션" width={240}>
          <TextField
            fullWidth
            select
            size="small"
            sx={compactTfSx}
            value={value.reco_loc_type_cd}
            onChange={(event) =>
              onChangeAction({ reco_loc_type_cd: Number(event.target.value) as 1 | 2 | 3 })
            }
            disabled={isLoading}
          >
            <MenuItem value={1}>취약계층 보호 우선</MenuItem>
            <MenuItem value={2}>유동 인구 우선</MenuItem>
            <MenuItem value={3}>체감 온도 저감 우선</MenuItem>
          </TextField>
        </StepBox>

        <StepChevron />

        {/* 버튼 */}
        <Box sx={{ width: 190, display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography variant="subtitle2" sx={{ visibility: "hidden" }}>
            자리맞춤
          </Typography>
          <Button
            variant="contained"
            fullWidth
            sx={{
              height: 44,
              bgcolor: "#4A60DD",
              borderRadius: 2,
              "&:hover": { bgcolor: "#2e49e1" },
              whiteSpace: "nowrap",
            }}
            onClick={onSubmitAction}
            disabled={isLoading}
          >
            AI 최적위치 추천
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
