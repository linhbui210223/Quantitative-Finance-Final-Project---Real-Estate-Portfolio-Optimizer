
export interface ProjectData {
  id: number;
  project_name: string;
  cost: number;
  pv_rent_cf: number;
  pv_sale: number;
  npv: number;
  rental_fee_monthly?: number;
  address?: string;
  distance_km?: number;
}

export type ConstraintType = 'auto' | 'exclude' | 'force';

export interface UserInputs {
  budgetTotalBillions: number;
  ltvRatio: number;
  loanRateAnnual: number;
  loanPeriodYears: number;
  constraints: Record<number, ConstraintType>;
}

export interface OptimizationResult {
  portfolio: PortfolioItem[];
  totalInvestmentCost: number;
  operationalProfit: number;
  netFinancingValue: number;
  grandTotalNPV: number;
  loanAmount: number;
  budgetLimit: number;
}

export interface PortfolioItem extends ProjectData {
  units: number;
}

export interface SavedScenario {
  id: string;
  name: string;
  timestamp: number;
  inputs: UserInputs;
  result: OptimizationResult;
}
