// app/coolingfog-budget/page.tsx
// Next.js(App Router) + MUI + TSX
"use client";

import * as React from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
	Container
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import type { FogItem } from "@/types/budgetSimulation/coolingfog";
import { FOG_ITEMS } from "@/app/dashboard/data/budgetSimulation/coolingfog-items";
import AIDocumentsPanel from "@/app/dashboard/budgetSimulation/components/ai-documents-panel";
import { BudgetSimulationHeader } from "@/app/dashboard/budgetSimulation/components/budget-simulation-header";
const MAX_BUDGET = 999_900_000_000; // 9999억
const MAX_QTY = 99;
const STICKY_TOP = "calc(var(--app-header-h, 72px) + 16px)";

/** =========================
 * ✅ Theme-like UI variables
 * ========================= */
const UI_BG_ITEM_CARD = "action.hover";
const UI_BG_ITEM_CARD_SELECTED = "action.hover";

const UI_BG_SETTINGS_CARD = "rgba(76,175,80,0.10)";
const UI_BG_SUMMARY_CARD = "rgba(76,175,80,0.10)";
const UI_BG_SUMMARY_C_HIGHLIGHT = "rgba(76,175,80, 0.3)";

const UI_BORDER_RADIUS = 3;
const UI_IMAGE_RADIUS = 2.5;

const UI_CODE_CHIP_SX = {
  height: 24,
  borderColor: "rgba(0,0,0,0.18)",
  color: "text.secondary",
  bgcolor: "rgba(0,0,0,0.02)",
  fontWeight: 700,
} as const;
const UI_CHIP_NOCLICK_SX = { pointerEvents: "none" } as const;

function clampInt(v: unknown, min: number, max: number) {
  const n = typeof v === "number" ? v : parseInt(String(v ?? "0"), 10);
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function formatKRW(n: number) {
  const safe = Number.isFinite(n) ? n : 0;
  return `₩ ${Math.round(safe).toLocaleString("ko-KR")}`;
}

function extractDigits(s: string) {
  // ✅ 경고 6: 그대로 두어도 문제 없지만, null/undefined 방어로 더 안전하게
  return (s ?? "").replace(/\D/g, "");
}

function formatNumberWithComma(n: number) {
  return n.toLocaleString("ko-KR");
}

// ✅ 설치개수 입력 시 "045" -> "45"
function normalizeQtyText(raw: string) {
  const digits = (raw ?? "").replace(/\D/g, "");
  if (!digits) return "0";
  const normalized = digits.replace(/^0+/, "");
  return normalized === "" ? "0" : normalized;
}

// ✅ 카드 클릭 토글 영역 안에서 버튼/입력 클릭 시 카드 토글 방지
const stopClick: React.MouseEventHandler<HTMLElement> = (e) => {
  e.stopPropagation();
};
const stopKeyDown: React.KeyboardEventHandler<HTMLElement> = (e) => {
  e.stopPropagation();
};

function RowBetween(props: { children: React.ReactNode }) {
  const arr = React.Children.toArray(props.children).filter(Boolean);
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ width: "100%" }}>
      {arr}
    </Stack>
  );
}

function MoneyBlock(props: { label: string; value: number; emphasize?: boolean }) {
  const { label, value, emphasize } = props;

  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{
          display: "block",
          fontWeight: 900,
          letterSpacing: "0.08em",
          lineHeight: 1.1,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant={emphasize ? "h5" : "h6"}
        fontWeight={emphasize ? 900 : 850}
        sx={{
          lineHeight: 1.12,
          mt: 1.05,
          letterSpacing: "-0.02em",
        }}
      >
        {formatKRW(value)}
      </Typography>
    </Box>
  );
}

type BudgetItem = FogItem & { qty: number };

export default function CoolingFogBudgetPage() {
  const [items, setItems] = React.useState<BudgetItem[]>(FOG_ITEMS.map((it) => ({ ...it, qty: 0 })));

  const [years, setYears] = React.useState(1); // ✅ 경고 7: <number> 제거
  const [budget, setBudget] = React.useState(0); // ✅ 경고 7: <number> 제거
  const [budgetText, setBudgetText] = React.useState(""); // ✅ 경고 7: <string> 제거

  // ✅ 선택 상태: qty와 분리
  const [selectedCodes, setSelectedCodes] = React.useState<Set<string>>(() => new Set());

  /** ✅ 핵심: 계산/요약은 선택된 품목만(pickedItems) 대상으로 */
  const pickedItems = React.useMemo(() => items.filter((it) => selectedCodes.has(it.code)), [items, selectedCodes]);

  // ✅ 선택 요약
  const selectedItemCount = React.useMemo(() => pickedItems.length, [pickedItems]);
  const totalQty = React.useMemo(() => pickedItems.reduce((acc, it) => acc + it.qty, 0), [pickedItems]);

  // ✅ A/B/C (선택된 품목만)
  const sumInit = React.useMemo(() => pickedItems.reduce((acc, it) => acc + it.unitPrice * it.qty, 0), [pickedItems]);

  const sumAnnual = React.useMemo(
    () =>
      pickedItems.reduce((acc, it) => {
        const annualPerUnit = it.elecMonthly * 12 + it.waterMonthly * 12;
        return acc + annualPerUnit * it.qty;
      }, 0),
    [pickedItems]
  );

  const sumTotal = React.useMemo(() => sumInit + sumAnnual * years, [sumInit, sumAnnual, years]);

  const usagePct = React.useMemo(() => (budget > 0 ? (sumTotal / budget) * 100 : 0), [sumTotal, budget]);
  const progressPct = React.useMemo(() => Math.max(0, Math.min(100, usagePct)), [usagePct]);
  const remain = React.useMemo(() => budget - sumTotal, [budget, sumTotal]);
  const over = remain < 0;
  const status: "none" | "ok" | "over" = budget <= 0 ? "none" : over ? "over" : "ok";

  // ✅ 경고 3: SelectChangeEvent import 제거 + 이벤트 타입 단순화(실사용에 충분)
  const handleYears = (e: React.ChangeEvent<{ value: unknown }> | any) => setYears(clampInt(e.target.value, 1, 5));

  // ✅ qty 입력: qty>=1이면 자동 선택 ON, 0이면 선택 OFF (요약과 동기화)
  const handleQty = (code: string, next: unknown) => {
    const qty = clampInt(next, 0, MAX_QTY);

    setItems((prev) => prev.map((it) => (it.code === code ? { ...it, qty } : it)));

    setSelectedCodes((prev) => {
      const n = new Set(prev);
      if (qty <= 0) n.delete(code);
      else n.add(code);
      return n;
    });
  };

  // ✅ + / - 버튼에서 사용할 증감 함수 (카드 토글과 충돌 방지)
  const incQty = (code: string, delta: number) => {
    const current = items.find((x) => x.code === code)?.qty ?? 0;
    const next = clampInt(current + delta, 0, MAX_QTY);
    handleQty(code, next);
  };

  /**
   * ✅ 카드 클릭:
   * - 선택됨 클릭 -> 미선택 (qty 유지)
   * - 미선택 클릭 -> 선택 + qty가 0이면 1로
   */
  const toggleSelect = (code: string) => {
    setSelectedCodes((prevSel) => {
      const nextSel = new Set(prevSel);

      if (nextSel.has(code)) {
        nextSel.delete(code);
        return nextSel;
      }

      nextSel.add(code);
      setItems((prevItems) => prevItems.map((it) => (it.code === code && it.qty === 0 ? { ...it, qty: 1 } : it)));
      return nextSel;
    });
  };

  const handleBudgetChange = (raw: string) => {
    const digits = extractDigits(raw);
    if (!digits) {
      setBudget(0);
      setBudgetText("");
      return;
    }
    const n = Math.min(parseInt(digits, 10) || 0, MAX_BUDGET);
    setBudget(n);
    setBudgetText(formatNumberWithComma(n));
  };

  return (
		<Container maxWidth="lg" sx={{ py: 1 }}>
      {/* Header */}
      <BudgetSimulationHeader />
      <Stack spacing={3} sx={{mt: 4}}>
				{/* 2 Column */}
				<Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="flex-start">
					{/* Left: Items */}
					<Box sx={{ flex: 1, width: "100%", minWidth: 0 }}>
						<Box
							sx={{
								display: "grid",
								gap: 1.5,
								gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(2, 1fr)" },
								alignItems: "stretch",
							}}
						>
							{items.map((it) => {
								const isSelected = selectedCodes.has(it.code);

								const initCost = it.unitPrice * it.qty;
								const annualUnit = it.elecMonthly * 12 + it.waterMonthly * 12;
								const annualCost = annualUnit * it.qty;

								return (
									<Paper
										key={it.code}
										elevation={0}
										onClick={() => toggleSelect(it.code)}
										role="button"
										tabIndex={0}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												toggleSelect(it.code);
											}
										}}
										sx={{
											cursor: "pointer",
											borderRadius: UI_BORDER_RADIUS,
											border: "1px solid",
											borderColor: isSelected ? "primary.main" : "divider",
											bgcolor: isSelected ? UI_BG_ITEM_CARD_SELECTED : UI_BG_ITEM_CARD,
											boxShadow: isSelected ? 2 : 0,
											overflow: "hidden",
											transition: "all 160ms ease",
											height: "100%",
											display: "flex",
											flexDirection: "column",
											"&:hover": { boxShadow: 4 },
										}}
									>
										{/* Code / Selected */}
										<Box sx={{ px: 2, pt: 2, pb: 1.25 }}>
											<RowBetween>
												<Chip size="small" label={it.code} variant="outlined" sx={{ ...UI_CODE_CHIP_SX, ...UI_CHIP_NOCLICK_SX }} />
												{isSelected ? (
													<Chip size="small" color="primary" label="선택됨" sx={{ height: 24, ...UI_CHIP_NOCLICK_SX }} />
												) : (
													<Chip size="small" variant="outlined" label="미선택" sx={{ height: 24, ...UI_CHIP_NOCLICK_SX }} />
												)}
											</RowBetween>
										</Box>

										{/* Image */}
										<Box sx={{ px: 2, pb: 1.5 }}>
											<Box
												sx={{
													height: 190,
													width: "100%",
													borderRadius: UI_IMAGE_RADIUS,
													overflow: "hidden",
													border: "1px solid",
													borderColor: "divider",
													bgcolor: "background.paper",
													"&:hover img": {
														transform: "scale(1.06)",
													},
												}}
											>
												<Box
													component="img"
													src={it.imgUrl}
													alt={it.name}
													sx={{
														width: "100%",
														height: "100%",
														objectFit: "cover",
														display: "block",
														transform: "scale(1)",
														transition: "transform 180ms ease",
														transformOrigin: "center",
													}}
												/>
											</Box>
										</Box>

										{/* Content */}
										<Box sx={{ px: 2, pb: 2.25, flex: 1, display: "flex", flexDirection: "column" }}>
											<Stack spacing={1.1} sx={{ flex: 1 }}>
                        <RowBetween>
                          <Typography fontWeight={900} sx={{ lineHeight: 1.2, minWidth: 0 }}>
                            {it.name}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", whiteSpace: "nowrap", textAlign: "right" }}
                          >
                            추천 설치: {it.loc}
                          </Typography>
                        </RowBetween>

                        <Stack spacing={1}>
                          {/* A row */}
                          <RowBetween>
                            <Typography
                              variant="overline"
                              color="text.secondary"
                              sx={{ fontWeight: 900, letterSpacing: "0.08em", lineHeight: 1.1 }}
                            >
                              A. 초기 설치비
                            </Typography>

                            <Stack spacing={0} sx={{ minWidth: 0, textAlign: "right" }}>
                              <Typography fontWeight={700} sx={{ lineHeight: 1.12, letterSpacing: "-0.02em" }}>
                                {formatKRW(initCost)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2, display: "block" }}>
                                단가 {formatKRW(it.unitPrice)}
                              </Typography>
                            </Stack>
                          </RowBetween>

                          {/* B row */}
                          <RowBetween>
                            <Typography
                              variant="overline"
                              color="text.secondary"
                              sx={{ fontWeight: 900, letterSpacing: "0.08em", lineHeight: 1.1 }}
                            >
                              B. 연간 운영비
                            </Typography>

                            <Stack spacing={0} sx={{ minWidth: 0, textAlign: "right" }}>
                              <Typography fontWeight={700} sx={{ lineHeight: 1.12, letterSpacing: "-0.02em" }}>
                                {formatKRW(annualCost)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2, display: "block" }}>
                                개당 {formatKRW(annualUnit)}
                              </Typography>
                            </Stack>
                          </RowBetween>
                        </Stack>


                        <Divider sx={{ mt: 0.5 }} />

												<RowBetween>
													<Stack direction="row" spacing={1} alignItems="center" onClick={stopClick} onKeyDown={stopKeyDown}>
														<IconButton
															size="small"
															onClick={() => incQty(it.code, -1)}
															disabled={it.qty <= 0}
															aria-label="설치개수 감소"
															sx={{
																border: "1px solid",
																borderColor: "divider",
																borderRadius: 1,
																width: 32,
																height: 32,
																bgcolor: "background.paper",
															}}
														>
															<Typography sx={{ fontWeight: 700, lineHeight: 1 }}>−</Typography>
														</IconButton>

														<TextField
															size="small"
															type="text"
															inputMode="numeric"
															value={String(it.qty)}
															onClick={stopClick}
															onChange={(e) => handleQty(it.code, normalizeQtyText(e.target.value))}
															sx={{ width: 72, bgcolor: "background.paper" }}
															// ✅ TS6385: inputProps deprecated → slotProps.htmlInput 사용(MUI v6+)
															slotProps={{
																htmlInput: {
																	style: { textAlign: "center", fontWeight: 700, paddingLeft: 4, paddingRight: 4 },
																	"aria-label": "설치개수 입력",
																},
															}}
														/>

														<IconButton
															size="small"
															onClick={() => incQty(it.code, +1)}
															disabled={it.qty >= MAX_QTY}
															aria-label="설치개수 증가"
															sx={{
																border: "1px solid",
																borderColor: "divider",
																borderRadius: 1,
																width: 32,
																height: 32,
																bgcolor: "background.paper",
															}}
														>
															<Typography sx={{ fontWeight: 900, lineHeight: 1 }}>+</Typography>
														</IconButton>
													</Stack>

													{it.link ? (
														<Button
															size="small"
															variant="outlined"
															endIcon={<OpenInNewIcon fontSize="small" />}
															href={it.link}
															target="_blank"
															rel="noopener noreferrer"
															onClick={(e) => e.stopPropagation()}
														>
															구매 링크
														</Button>
													) : (
														<Button size="small" variant="outlined" disabled onClick={(e) => e.stopPropagation()}>
															링크 준비중
														</Button>
													)}
												</RowBetween>
											</Stack>
										</Box>
									</Paper>
								);
							})}
						</Box>
					</Box>

					{/* Right: Sticky Sidebar */}
					<Box
						sx={{
							width: { xs: "100%", md: 355 },
							position: { md: "sticky" },
							top: { md: STICKY_TOP },
							flexShrink: 0,
						}}
					>
						<Stack spacing={1.25}>
							{/* Settings card */}
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
										<Select labelId="years-label" label="운영기간" value={String(years)} onChange={handleYears}>
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
										label="가용 예산(원)"
										value={budgetText}
										onChange={(e) => handleBudgetChange(e.target.value)}
										placeholder="예: 2,000,000,000"
										sx={{ background: "white" }}
										slotProps={{
											htmlInput: { inputMode: "numeric" },
											input: {
												startAdornment: <InputAdornment position="start">₩</InputAdornment>,
												endAdornment: (
													<InputAdornment position="end">
														<Tooltip title="최대 9999억까지 입력 가능합니다.">
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
										가용 예산을 입력하면 사용률/남은 금액이 표시됩니다.
									</Typography>
								</Stack>
							</Paper>

							{/* Budget Summary card */}
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
										<Chip size="small" color="info" label={`총 설치 ${totalQty}개`} sx={{ height: 26, ...UI_CHIP_NOCLICK_SX }} />
									</Stack>

									<Stack spacing={0.75}>
										<Stack direction="row" justifyContent="space-between" alignItems="center">
											<Typography variant="caption" color="text.secondary">
												예산 사용율(%)
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

										<Typography
											variant="caption"
											sx={{ fontWeight: 900, textAlign: "end" }}
											color={status === "over" ? "error.main" : "text.primary"}
										>
											{budget <= 0 ? "가용 예산을 입력하세요." : over ? `부족 ${formatKRW(Math.abs(remain))}` : `잔액 ${formatKRW(remain)}`}
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

							<AIDocumentsPanel years={years} budget={budget} pickedItems={pickedItems} allItems={items} />
						</Stack>
					</Box>
				</Stack>
        <Typography variant="caption" color="text.secondary">
          * 연간 운영비(B)는 (월 전기세 + 월 수도세)를 12개월로 환산하여 계산되며, 전기/수도 항목을 별도로 표시하지 않습니다.
        </Typography>
			</Stack>
		</Container>
  );
}
