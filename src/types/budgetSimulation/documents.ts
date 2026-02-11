export type RiskItem = {
  risk: string;
  mitigation: string;
};

export type BudgetItemLike = {
  code: string;
  name: string;
  unitPrice: number;
  elecMonthly: number;
  waterMonthly: number;
  qty: number;
  loc: string;
};

export type ReportContent = {
  businessOverview: string;
  overview: string;
  conclusion: string;
  initCostAssessment: string;
  totalCostAnalysis: string;
  expectedEffect: string | string[];
  riskManagement: string | RiskItem[];
  finalOpinion: string;
  opexPoint: string;
  notice: string;
};

export type RecommendationText = {
  intro: string;
  basis: string;
  result: string;
  insights: string[];
  betterPlan: string;
  note: string;
};

export type ReportSnapshot = {
  years: number;
  budget: number;
  selectedTypesLabel: string;
  pickedItems: BudgetItemLike[];
  sumInit: number;
  sumAnnual: number;
  sumTotal: number;
  usagePct: number;
  remain: number;
  topOpex?: { name: string; ratioPct: number };
};
