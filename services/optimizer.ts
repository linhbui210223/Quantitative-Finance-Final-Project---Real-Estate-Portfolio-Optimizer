
import { PROJECTS, CONSTANTS } from '../constants';
import { UserInputs, OptimizationResult, PortfolioItem } from '../types';

interface KnapsackItem {
  originalId: number;
  weight: number;
  value: number;
  ratio: number;
}

export const calculatePortfolio = (inputs: UserInputs): OptimizationResult => {
  const { budgetTotalBillions, ltvRatio, loanRateAnnual, loanPeriodYears, constraints = {} } = inputs;

  const budgetTotal = budgetTotalBillions * 1e9;
  
  // --- 1. Global Financing Calculations ---
  const totalLoanAmount = budgetTotal * ltvRatio;

  let netFinancingValue = 0;
  
  if (totalLoanAmount > 0) {
    const months = loanPeriodYears * 12;
    const monthlyRate = loanRateAnnual / 12;
    const monthlyDiscount = CONSTANTS.DISCOUNT_RATE / 12;

    const monthlyPayment = totalLoanAmount * monthlyRate;
    
    const pvPayments = (monthlyPayment * (1 - Math.pow(1 + monthlyDiscount, -months))) / monthlyDiscount;
    const pvPrincipal = totalLoanAmount / Math.pow(1 + monthlyDiscount, months);
    
    const totalPVDebtCost = pvPayments + pvPrincipal;
    
    netFinancingValue = totalLoanAmount - totalPVDebtCost;
  }

  // --- 2. Handle Constraints & Pre-allocation ---
  
  let currentBudget = budgetTotal;
  let baselineNPV = 0;
  let baselineCost = 0;
  
  // Map to track units bought (starts with mandatory ones)
  const portfolioMap = new Map<number, number>();

  // Process "Force Include" (Must Have)
  // We buy 1 unit of each 'force' project upfront if budget allows.
  // Note: If budget is insufficient for mandatory items, we buy what we can (Greedy by order) 
  // or arguably should fail. Here we attempt to buy.
  PROJECTS.forEach(p => {
    const type = constraints[p.id] || 'auto';
    if (type === 'force') {
        if (currentBudget >= p.cost) {
            currentBudget -= p.cost;
            baselineCost += p.cost;
            baselineNPV += p.npv;
            portfolioMap.set(p.id, 1);
        }
    }
  });

  // --- 3. Optimization Logic (Exact Branch & Bound Knapsack) ---
  
  // Prepare items for the *remaining* budget
  const items: KnapsackItem[] = [];
  
  PROJECTS.forEach(p => {
    const type = constraints[p.id] || 'auto';
    
    // Skip if excluded
    if (type === 'exclude') return;

    // Calculate how many MORE units we can buy
    // If 'force', we already bought 1, so max remaining is MAX - 1
    // If 'auto', max remaining is MAX
    const unitsAlreadyBought = portfolioMap.get(p.id) || 0;
    const remainingMaxUnits = CONSTANTS.MAX_UNITS_PER_PROJECT - unitsAlreadyBought;

    if (p.cost > 0 && remainingMaxUnits > 0) {
      for (let i = 0; i < remainingMaxUnits; i++) {
        items.push({
          originalId: p.id,
          weight: p.cost,
          value: p.npv,
          ratio: p.npv / p.cost
        });
      }
    }
  });

  // Sort by efficiency (NPV/Cost) descending
  items.sort((a, b) => b.ratio - a.ratio);

  let bestValue = 0;
  let bestSelection: number[] = []; 

  // Upper Bound Calculation
  const getBound = (index: number, curWeight: number, curValue: number): number => {
    if (curWeight >= currentBudget) return 0;

    let boundVal = curValue;
    let totWeight = curWeight;

    for (let j = index; j < items.length; j++) {
      const item = items[j];
      if (totWeight + item.weight <= currentBudget) {
        totWeight += item.weight;
        boundVal += item.value;
      } else {
        const remaining = currentBudget - totWeight;
        boundVal += item.value * (remaining / item.weight);
        break; 
      }
    }
    return boundVal;
  };

  // Branch and Bound Solver
  const solve = (index: number, curWeight: number, curValue: number, curSelection: number[]) => {
    if (curWeight > currentBudget) return;

    if (index === items.length) {
      if (curValue > bestValue) {
        bestValue = curValue;
        bestSelection = [...curSelection];
      }
      return;
    }

    const bound = getBound(index, curWeight, curValue);
    if (bound <= bestValue) return;

    const item = items[index];

    // Include
    if (curWeight + item.weight <= currentBudget) {
      curSelection.push(index);
      solve(index + 1, curWeight + item.weight, curValue + item.value, curSelection);
      curSelection.pop();
    }

    // Exclude
    solve(index + 1, curWeight, curValue, curSelection);
  };

  // Run Solver on remaining budget
  solve(0, 0, 0, []);

  // --- 4. Merge Results ---
  
  // Add optimized items to the portfolio map
  bestSelection.forEach(idx => {
    const originalId = items[idx].originalId;
    portfolioMap.set(originalId, (portfolioMap.get(originalId) || 0) + 1);
  });

  const portfolio: PortfolioItem[] = [];
  let totalInvestmentCost = 0; // Recalculate strictly from final map to be safe
  let operationalProfit = 0;

  PROJECTS.forEach(p => {
    const units = portfolioMap.get(p.id) || 0;
    if (units > 0) {
      portfolio.push({
        ...p,
        units
      });
      totalInvestmentCost += units * p.cost;
      operationalProfit += units * p.npv;
    }
  });

  const grandTotalNPV = operationalProfit + netFinancingValue;

  return {
    portfolio,
    totalInvestmentCost,
    operationalProfit,
    netFinancingValue,
    grandTotalNPV,
    loanAmount: totalLoanAmount,
    budgetLimit: budgetTotal // Original full budget
  };
};

export const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

export const formatBillions = (val: number) => {
    return (val / 1e9).toLocaleString('en-US', { maximumFractionDigits: 2 }) + "B";
};
