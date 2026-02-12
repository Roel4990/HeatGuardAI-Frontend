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
import Tooltip from "@mui/material/Tooltip";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import axios from "axios";
import { region_map } from "@/app/dashboard/data/AIBestLocation/region-map";
import type { RecoRequestBody, RegionMap } from "@/types/AIBestLocation/reco";

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
                   tooltip,
                 }: {
  title: string;
  children: React.ReactNode;
  width?: number | string;
  flex?: number;
  tooltip?: string;
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, width, flex, minWidth: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Typography variant="subtitle2" sx={{ whiteSpace: "nowrap" }}>
          {title}
        </Typography>
        {tooltip ? (
          <Tooltip
            title={tooltip}
            placement="top"
            arrow
          >
            <Box sx={{ display: "inline-flex", alignItems: "center" }}>
              <InfoOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            </Box>
          </Tooltip>
        ) : null}
      </Box>
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

function LoadingMenuItem() {
  return (
    <MenuItem value="" disabled>
      <Box
        sx={{
          width: 64,
          aspectRatio: "1 / 1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
        }}
      >
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            border: "3px solid",
            borderColor: "divider",
            borderTopColor: "primary.main",
            animation: "spin 0.8s linear infinite",
            "@keyframes spin": {
              to: { transform: "rotate(360deg)" },
            },
          }}
        />
      </Box>
    </MenuItem>
  );
}

type RegionSelectProps = {
  value: string;
  placeholder: string;
  options: string[];
  disabled: boolean;
  loading: boolean;
  onChange: (value: string) => void;
  onOpen?: () => void;
  renderValue?: (selected: unknown) => React.ReactNode;
  sx?: object;
};

function RegionSelect({
  value,
  placeholder,
  options,
  disabled,
  loading,
  onChange,
  onOpen,
  renderValue,
  sx,
}: RegionSelectProps) {
  const disabledSx = disabled
    ? {
        "& .MuiInputBase-root.Mui-disabled": {
          bgcolor: "rgba(148,163,184,0.18)",
          color: "text.secondary",
          WebkitTextFillColor: "rgba(100,116,139,0.9)",
          cursor: "not-allowed",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(148,163,184,0.45)",
        },
        "& .MuiSvgIcon-root": {
          color: "rgba(100,116,139,0.7)",
        },
      }
    : null;

  return (
    <TextField
      select
      size="small"
      sx={{ ...sx, ...disabledSx }}
      value={value}
      onChange={(event) => onChange(String(event.target.value))}
      disabled={disabled}
      // ✅ SelectProps(deprecated) -> slotProps.select 로 교체
      slotProps={{
        select: {
          displayEmpty: true,
          onOpen,
          MenuProps: {
            PaperProps: {
              sx: { maxHeight: 280, overflowY: "auto" },
            },
          },
          renderValue,
        },
      }}
    >
      <MenuItem value="">{placeholder}</MenuItem>
      {loading ? (
        <LoadingMenuItem />
      ) : (
        options.map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))
      )}
    </TextField>
  );
}

export default function LeftPanel({
                                    headerHeight,
                                    value,
                                    onChangeAction,
                                    onSubmitAction,
                                    isLoading,
                                  }: Props) {
  const [regionMap, setRegionMap] = React.useState<RegionMap | null>(null);
  const [isRegionLoading, setIsRegionLoading] = React.useState(false);

  const handleLoadRegions = React.useCallback(async () => {
    if (isRegionLoading) return;
    if (regionMap && Object.keys(regionMap).length > 0) return;
    setIsRegionLoading(true);

    try {
      const accessToken = localStorage.getItem("access_token");
      const res = await axios.get<RegionMap>("/api/AIBestLocation/regions", {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      });
      setRegionMap(res.data);
    } catch {
      console.log("서버 연결 실패");
      setRegionMap(region_map);
    } finally {
      setIsRegionLoading(false);
    }
  }, [isRegionLoading, regionMap]);

  const districts = Object.keys(regionMap ?? {});
  const neighborhoods = value.target_region_gu ? (regionMap?.[value.target_region_gu] ?? []) : [];

  const handleDecrease = () =>
    onChangeAction({ target_count: clampCount(value.target_count - 1) });
  const handleIncrease = () =>
    onChangeAction({ target_count: clampCount(value.target_count + 1) });
  const isPrioritySelected = value.reco_loc_type_cd !== 0;

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
        maxHeight: `calc(100dvh - ${headerHeight}px - 24px)`,
        overflowY: "auto",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1}
        alignItems="flex-start"
        sx={{
          width: "100%",
          minWidth: 0,
        }}
      >
        {/* 3 */}
        <StepBox title="1. 취약성 우선 순위" width={240} tooltip="우선순위 기준을 선택하세요.">
          <TextField
            fullWidth
            select
            size="small"
            sx={compactTfSx}
            value={value.reco_loc_type_cd}
            onChange={(event) =>
              onChangeAction({
                reco_loc_type_cd: Number(event.target.value) as 0 | 1 | 2,
                target_region_dong:
                  Number(event.target.value) === 0 ? value.target_region_dong : "",
              })
            }
            disabled={isLoading}
          >
            <MenuItem value={0}>종합지수</MenuItem>
            <MenuItem value={1}>
              고온위험
            </MenuItem>
            <MenuItem value={2}>
              녹지부족
            </MenuItem>
          </TextField>
        </StepBox>

        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <StepChevron />
        </Box>

        {/* 2 */}
        <StepBox
          title="2. 지역 선택"
          flex={1}
          tooltip="우선순위 중에 고온핵심과 녹지부족을 선택 할 경우 행정구 단위로 분석이 가능합니다"
        >
          <Stack direction="row" spacing={1} sx={{ minWidth: 0 }}>
            <RegionSelect
              value={value.target_region_gu}
              placeholder="행정구 전체"
              options={districts}
              disabled={isLoading}
              loading={isRegionLoading}
              onChange={(next) =>
                onChangeAction({
                  target_region_gu: next,
                  target_region_dong: "",
                })
              }
              onOpen={handleLoadRegions}
              renderValue={(selected) =>
                selected ? String(selected) : "행정구 전체"
              }
              sx={{ ...compactTfSx, minWidth: 160, flex: 1 }}
            />

            <RegionSelect
              value={value.target_region_dong}
              placeholder="행정동 전체"
              options={neighborhoods}
              disabled={!value.target_region_gu || isLoading || isPrioritySelected}
              loading={isRegionLoading}
              onChange={(next) => onChangeAction({ target_region_dong: next })}
              renderValue={(selected) => {
                if (!value.target_region_gu) return "행정동 전체";
                return selected ? String(selected) : "행정동 전체";
              }}
              sx={{ ...compactTfSx, minWidth: 160, flex: 1 }}
            />
          </Stack>
        </StepBox>

        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <StepChevron />
        </Box>

        {/* 1 */}
        <StepBox title="3. 설치 목표 개수" width={170} tooltip="1~5개 범위로 선택합니다.">
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

        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <StepChevron />
        </Box>

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
            쿨링포그 최적 위치 추천
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
