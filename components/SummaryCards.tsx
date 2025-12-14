
import React from 'react';
import { OptimizationResult, UserInputs } from '../types';
import { formatCurrency, formatBillions } from '../services/optimizer';

interface SummaryCardsProps {
  result: OptimizationResult;
  inputs: UserInputs;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ result, inputs }) => {
  const equity = (inputs.budgetTotalBillions * 1e9) - result.loanAmount;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      
      {/* Buying Power */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500">Total Buying Power</h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Budget</span>
        </div>
        <div className="text-2xl font-bold text-gray-900">{formatBillions(result.budgetLimit)}</div>
        <div className="text-xs text-gray-500 mt-1">
          {formatBillions(equity)} Cash + {formatBillions(result.loanAmount)} Loan
        </div>
      </div>

      {/* Operational Profit */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500">Operational Profit</h3>
          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">Project NPV (if not loan)</span>
        </div>
        <div className="text-2xl font-bold text-gray-900 truncate" title={formatCurrency(result.operationalProfit)}>
          {formatBillions(result.operationalProfit)}
        </div>
        <div className="text-xs text-green-600 mt-1 font-medium">
          Derived from {result.portfolio.reduce((acc, curr) => acc + curr.units, 0)} units
        </div>
      </div>

       {/* Grand Total */}
       <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-5 rounded-xl shadow-md text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-indigo-100">Adjusted PV of Portfolio (given loan)</h3>
          <svg className="w-5 h-5 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
        </div>
        <div className="text-2xl font-bold truncate" title={formatCurrency(result.grandTotalNPV)}>
          {formatBillions(result.grandTotalNPV)}
        </div>
        <div className="text-xs text-indigo-100 mt-1 opacity-90">
          Portfolio Value Adjusted 
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
