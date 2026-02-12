import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import type { SelectChangeEvent } from "@mui/material/Select";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import type { BudgetItem } from "@/types/budgetSimulation/budget";
import AIDocumentsPanel from "@/app/dashboard/budgetSimulation/components/ai-documents-panel";
import BudgetSummary from "@/app/dashboard/budgetSimulation/components/summary/budget-summary";
import { UI_BG_SETTINGS_CARD, UI_BORDER_RADIUS } from "@/app/dashboard/budgetSimulation/components/ui-constants";

type Props = {
  years: number;
  budget: number;
  budgetText: string;
  onYearsChange: (event: SelectChangeEvent) => void;
  onBudgetChange: (value: string) => void;
  selectedItemCount: number;
  totalQty: number;
  sumInit: number;
  sumAnnual: number;
  sumTotal: number;
  usagePct: number;
  progressPct: number;
  remain: number;
  status: "none" | "ok" | "over";
  pickedItems: BudgetItem[];
  allItems: BudgetItem[];
};

export default function BudgetSidebar({
  years,
  budget,
  budgetText,
  onYearsChange,
  onBudgetChange,
  selectedItemCount,
  totalQty,
  sumInit,
  sumAnnual,
  sumTotal,
  usagePct,
  progressPct,
  remain,
  status,
  pickedItems,
  allItems,
}: Props) {
  return (
    <Box
      sx={{
        width: { xs: "100%", md: 355 },
        position: { md: "sticky" },
        top: { md: "calc(var(--app-header-h, 72px) + 16px)" },
        flexShrink: 0,
      }}
    >
      <Stack spacing={1.25}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: UI_BORDER_RADIUS,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: UI_BG_SETTINGS_CARD,
            p: 2,
          }}
        >
          <Stack spacing={1.5}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 900, letterSpacing: "0.08em" }}>
              설정
            </Typography>

            <FormControl fullWidth size="small" sx={{ background: "white" }}>
              <InputLabel id="years-label">운영기간</InputLabel>
              <Select labelId="years-label" label="운영기간" value={String(years)} onChange={onYearsChange}>
                {[1, 2, 3, 4, 5].map((y) => (
                  <MenuItem key={y} value={String(y)}>
                    {y}년
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              size="small"
              fullWidth
              label="가용예산(원)"
              value={budgetText}
              onChange={(e) => onBudgetChange(e.target.value)}
              placeholder="예: 2,000,000,000"
              sx={{ background: "white" }}
              slotProps={{
                htmlInput: { inputMode: "numeric" },
                input: {
                  startAdornment: <InputAdornment position="start">₩</InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="최대 9999억원까지 입력 가능합니다.">
                        <IconButton size="small" edge="end">
                          <InfoOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Typography variant="caption" color="text.secondary">
              가용예산을 입력하면 사용률과 잔여 금액을 표시합니다.
            </Typography>
          </Stack>
        </Paper>

        <BudgetSummary
          years={years}
          selectedItemCount={selectedItemCount}
          totalQty={totalQty}
          sumInit={sumInit}
          sumAnnual={sumAnnual}
          sumTotal={sumTotal}
          budget={budget}
          usagePct={usagePct}
          progressPct={progressPct}
          remain={remain}
          status={status}
        />

        <AIDocumentsPanel years={years} budget={budget} pickedItems={pickedItems} allItems={allItems} />
      </Stack>
    </Box>
  );
}

