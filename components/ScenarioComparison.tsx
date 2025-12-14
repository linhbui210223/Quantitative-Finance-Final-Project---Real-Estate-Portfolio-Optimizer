
import React from 'react';
import { SavedScenario } from '../types';
import { formatCurrency, formatBillions } from '../services/optimizer';

interface ScenarioComparisonProps {
  scenarios: SavedScenario[];
  onDelete: (id: string) => void;
}

const ScenarioComparison: React.FC<ScenarioComparisonProps> = ({ scenarios, onDelete }) => {
  if (scenarios.length === 0) return null;

  // Helper to find the best value for highlighting
  const maxNPV = Math.max(...scenarios.map(s => s.result.grandTotalNPV));
  const maxROI = Math.max(...scenarios.map(s => (s.result.operationalProfit / s.result.totalInvestmentCost)));

  const downloadScenarioCSV = (scenario: SavedScenario) => {
    const items = scenario.result.portfolio;
    if (items.length === 0) return;

    // CSV Headers
    const headers = ["Project Name", "Address", "Distance (km)", "Unit Cost", "Monthly Rent", "Unit NPV", "Quantity", "Total Cost", "Total NPV"];
    
    // Map data to rows
    const rows = items.map(item => [
      `"${item.project_name.replace(/"/g, '""')}"`, // Escape quotes
      `"${(item.address || '').replace(/"/g, '""')}"`,
      item.distance_km || '',
      item.cost,
      item.rental_fee_monthly || 0,
      item.npv,
      item.units,
      item.cost * item.units,
      item.npv * item.units
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create download link with BOM for Excel UTF-8 support
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${scenario.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_portfolio.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
      <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Scenario Comparison</h3>
          <p className="text-xs text-gray-500 mt-1">Side-by-side analysis of saved strategies</p>
        </div>
        <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">
          {scenarios.length} Scenarios
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                Metric
              </th>
              {scenarios.map((scenario) => (
                <th key={scenario.id} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 tracking-wider min-w-[200px]">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="block font-bold text-sm">{scenario.name}</span>
                      <span className="text-[10px] text-gray-400 font-normal">
                        {new Date(scenario.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <button 
                          onClick={() => downloadScenarioCSV(scenario)}
                          className="text-gray-400 hover:text-indigo-600 transition-colors p-1"
                          title="Export CSV"
                        >
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        </button>
                        <button 
                          onClick={() => onDelete(scenario.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          title="Delete Scenario"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {/* INPUTS SECTION */}
            <tr className="bg-gray-50/50">
              <td className="px-6 py-2 font-semibold text-gray-500 text-xs uppercase" colSpan={scenarios.length + 1}>Inputs</td>
            </tr>
            <tr>
              <td className="px-6 py-3 font-medium text-gray-600">Total Budget</td>
              {scenarios.map(s => (
                <td key={s.id} className="px-6 py-3 text-gray-900">{formatBillions(s.result.budgetLimit)}</td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-3 font-medium text-gray-600">LTV Ratio</td>
              {scenarios.map(s => (
                <td key={s.id} className="px-6 py-3 text-gray-900">{(s.inputs.ltvRatio * 100).toFixed(0)}%</td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-3 font-medium text-gray-600">Loan Rate</td>
              {scenarios.map(s => (
                <td key={s.id} className="px-6 py-3 text-gray-900">{(s.inputs.loanRateAnnual * 100).toFixed(2)}%</td>
              ))}
            </tr>

            {/* FINANCIALS SECTION */}
            <tr className="bg-gray-50/50">
              <td className="px-6 py-2 font-semibold text-gray-500 text-xs uppercase" colSpan={scenarios.length + 1}>Performance</td>
            </tr>
            <tr>
              <td className="px-6 py-3 font-medium text-gray-600">Total Invested</td>
              {scenarios.map(s => (
                <td key={s.id} className="px-6 py-3 text-gray-900">{formatBillions(s.result.totalInvestmentCost)}</td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-3 font-medium text-gray-600">Operational Profit</td>
              {scenarios.map(s => (
                <td key={s.id} className="px-6 py-3 text-gray-900">{formatBillions(s.result.operationalProfit)}</td>
              ))}
            </tr>
            <tr className="bg-indigo-50/30">
              <td className="px-6 py-4 font-bold text-indigo-900">Adjusted PV of Portfolio</td>
              {scenarios.map(s => {
                const isBest = s.result.grandTotalNPV === maxNPV;
                return (
                  <td key={s.id} className={`px-6 py-4 font-bold text-base ${isBest ? 'text-green-600' : 'text-gray-900'}`}>
                     {formatCurrency(s.result.grandTotalNPV)}
                     {isBest && <span className="ml-2 text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded border border-green-200">BEST</span>}
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="px-6 py-3 font-medium text-gray-600">ROI</td>
              {scenarios.map(s => {
                const roi = s.result.operationalProfit / s.result.totalInvestmentCost;
                const isBest = roi === maxROI;
                return (
                  <td key={s.id} className={`px-6 py-3 font-medium ${isBest ? 'text-green-600' : 'text-gray-900'}`}>
                    {(roi * 100).toFixed(2)}%
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="px-6 py-3 font-medium text-gray-600">Units Purchased</td>
              {scenarios.map(s => (
                <td key={s.id} className="px-6 py-3 text-gray-900">
                    {s.result.portfolio.reduce((acc, item) => acc + item.units, 0)}
                </td>
              ))}
            </tr>

            {/* PORTFOLIO COMPOSITION */}
             <tr className="bg-gray-50/50">
              <td className="px-6 py-2 font-semibold text-gray-500 text-xs uppercase" colSpan={scenarios.length + 1}>Portfolio Composition</td>
            </tr>
             <tr>
              <td className="px-6 py-3 font-medium text-gray-600 align-top">Assets</td>
              {scenarios.map(s => (
                <td key={s.id} className="px-6 py-3 text-gray-900 align-top">
                    <ul className="space-y-1">
                        {s.result.portfolio.map(p => (
                            <li key={p.id} className="text-xs flex justify-between gap-2 border-b border-gray-100 last:border-0 pb-1 last:pb-0">
                                <span className="truncate max-w-[140px]" title={p.project_name}>
                                    {p.project_name.split('-')[0].trim()}
                                </span>
                                <span className="font-semibold text-gray-700 bg-gray-100 px-1.5 rounded">x{p.units}</span>
                            </li>
                        ))}
                        {s.result.portfolio.length === 0 && <li className="text-xs text-gray-400 italic">No assets</li>}
                    </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScenarioComparison;
