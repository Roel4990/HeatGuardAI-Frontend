'use client';

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { region_map } from "../../../data/AIBestLocation/region-map";

import type { RecoRequestBody } from "../../../../../types/AIBestLocation/reco";

const clampCount = (n: number) => Math.min(5, Math.max(1, Math.floor(n)));

type Props = {
  headerHeight: number;
  value: RecoRequestBody;
  onChangeAction: (next: Partial<RecoRequestBody>) => void;
  onSubmitAction: () => void;
  isLoading: boolean;
};

export default function LeftPanel({
                                    headerHeight,
                                    value,
                                    onChangeAction,
                                    onSubmitAction,
                                    isLoading,
                                  }: Props) {
  const districts = Object.keys(region_map);
  const neighborhoods = value.target_region_gu ? (region_map[value.target_region_gu] ?? []) : [];

  const handleDecrease = () => onChangeAction({ target_count: clampCount(value.target_count - 1) });
  const handleIncrease = () => onChangeAction({ target_count: clampCount(value.target_count + 1) });

  return (
    <Box
      sx={{
        flex: 2.7,
        position: { md: "sticky" },
        top: { md: `${headerHeight + 16}px` },
        alignSelf: { md: "flex-start" },
        maxHeight: { md: `calc(100vh - ${headerHeight}px - 32px)` },
      }}
    >
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ height: "100%", overflow: "auto" }}>
          <Stack spacing={3} sx={{ minHeight: 0 }}>
            <Typography variant="h6">설치 목표 기반 쿨링포그 위치 추천</Typography>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">A-1. 설치 목표 위치 개수 (필수)</Typography>
              <TextField
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
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2">개소</Typography>
                          <IconButton onClick={handleIncrease} disabled={value.target_count >= 5 || isLoading}>
                            +
                          </IconButton>
                        </Stack>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">A-2. 지역 선택 (선택)</Typography>
              <Typography variant="body2" color="text.secondary">
                미선택 시 전체 지역을 대상으로 분석합니다.
              </Typography>

              <TextField
                select
                label="행정구 선택"
                value={value.target_region_gu}
                onChange={(event) => {
                  onChangeAction({
                    target_region_gu: event.target.value,
                    target_region_dong: "",
                  });
                }}
                disabled={isLoading}
              >
                <MenuItem value="">미선택</MenuItem>
                {districts.map((gu) => (
                  <MenuItem key={gu} value={gu}>
                    {gu}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="행정동 선택"
                value={value.target_region_dong}
                onChange={(event) => onChangeAction({ target_region_dong: event.target.value })}
                disabled={!value.target_region_gu || isLoading}
              >
                <MenuItem value="">미선택</MenuItem>
                {neighborhoods.map((dong) => (
                  <MenuItem key={dong} value={dong}>
                    {dong}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">A-3. 우선순위 옵션</Typography>
              <RadioGroup
                value={value.reco_loc_type_cd}
                onChange={(event) => onChangeAction({ reco_loc_type_cd: Number(event.target.value) as 1 | 2 | 3 })}
              >
                <FormControlLabel value={1} control={<Radio />} label="취약계층 보호 우선" />
                <FormControlLabel value={2} control={<Radio />} label="유동 인구 우선" />
                <FormControlLabel value={3} control={<Radio />} label="체감 온도 저감 우선" />
              </RadioGroup>
            </Stack>

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: "auto", bgcolor: "#f57c00", "&:hover": { bgcolor: "#ef6c00" } }}
              onClick={onSubmitAction}
              disabled={isLoading}
            >
              AI 최적위치 추천
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
