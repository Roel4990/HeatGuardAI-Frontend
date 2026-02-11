"use client";

import * as React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";

import type { BudgetItem } from "@/types/budgetSimulation/budget";
import { FOG_ITEMS } from "@/app/dashboard/data/budgetSimulation/coolingfog-items";
import { BudgetSimulationHeader } from "@/app/dashboard/budgetSimulation/components/budget-simulation-header";
import ItemGrid from "@/app/dashboard/budgetSimulation/components/items/item-grid";
import BudgetSidebar from "@/app/dashboard/budgetSimulation/components/summary/budget-sidebar";
import {
  clampInt,
  extractDigits,
  formatNumberWithComma,
  normalizeQtyText,
} from "@/app/dashboard/budgetSimulation/lib/budget-utils";

const MAX_BUDGET = 999_900_000_000; // 9999억
const MAX_QTY = 99;

const stopClick: React.MouseEventHandler<HTMLElement> = (e) => {
  e.stopPropagation();
};
const stopKeyDown: React.KeyboardEventHandler<HTMLElement> = (e) => {
  e.stopPropagation();
};

export default function CoolingFogBudgetPage() {
  const [items, setItems] = React.useState<BudgetItem[]>(FOG_ITEMS.map((it) => ({ ...it, qty: 0 })));

  const [years, setYears] = React.useState(1);
  const [budget, setBudget] = React.useState(0);
  const [budgetText, setBudgetText] = React.useState("");

  const [selectedCodes, setSelectedCodes] = React.useState<Set<string>>(() => new Set());

  const pickedItems = React.useMemo(() => items.filter((it) => selectedCodes.has(it.code)), [items, selectedCodes]);

  const selectedItemCount = React.useMemo(() => pickedItems.length, [pickedItems]);
  const totalQty = React.useMemo(() => pickedItems.reduce((acc, it) => acc + it.qty, 0), [pickedItems]);

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

  const handleYears = (e: React.ChangeEvent<{ value: unknown }> | any) => setYears(clampInt(e.target.value, 1, 5));

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

  const incQty = (code: string, delta: number) => {
    const current = items.find((x) => x.code === code)?.qty ?? 0;
    const next = clampInt(current + delta, 0, MAX_QTY);
    handleQty(code, next);
  };

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
      <BudgetSimulationHeader />
      <Stack spacing={3} sx={{ mt: 4 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="flex-start">
          <Box sx={{ flex: 1, width: "100%", minWidth: 0 }}>
            <ItemGrid
              items={items}
              selectedCodes={selectedCodes}
              onToggle={toggleSelect}
              onIncQty={incQty}
              onQtyChange={(code, value) => handleQty(code, normalizeQtyText(value))}
              stopClick={stopClick}
              stopKeyDown={stopKeyDown}
              maxQty={MAX_QTY}
            />
          </Box>

          <BudgetSidebar
            years={years}
            budget={budget}
            budgetText={budgetText}
            onYearsChange={handleYears}
            onBudgetChange={handleBudgetChange}
            selectedItemCount={selectedItemCount}
            totalQty={totalQty}
            sumInit={sumInit}
            sumAnnual={sumAnnual}
            sumTotal={sumTotal}
            usagePct={usagePct}
            progressPct={progressPct}
            remain={remain}
            status={status}
            pickedItems={pickedItems}
            allItems={items}
          />
        </Stack>

        <Typography variant="caption" color="text.secondary">
          * 연간 운영비(B)는 전기·수도비를 12개월로 환산하여 계산되며, 전기/수도 단가는 별도 표기하지 않습니다.
        </Typography>
      </Stack>
    </Container>
  );
}
