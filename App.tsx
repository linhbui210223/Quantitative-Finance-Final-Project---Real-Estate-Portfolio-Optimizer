
import React, { useState } from 'react';
import InputForm from './components/InputForm';
import SummaryCards from './components/SummaryCards';
import PortfolioTable from './components/PortfolioTable';
import Charts from './components/Charts';
import ScenarioComparison from './components/ScenarioComparison';
import { UserInputs, OptimizationResult, SavedScenario } from './types';
import { calculatePortfolio } from './services/optimizer';

// Default initial values matching the prompt's R script inputs
const DEFAULT_INPUTS: UserInputs = {
  budgetTotalBillions: 50,
  ltvRatio: 0.5,
  loanRateAnnual: 0.06,
  loanPeriodYears: 5,
  constraints: {},
};

const App: React.FC = () => {
  const [inputs, setInputs] = useState<UserInputs>(DEFAULT_INPUTS);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [scenarios, setScenarios] = useState<SavedScenario[]>([]);

  const handleCalculate = async () => {
    setIsCalculating(true);
    // Slight delay to allow UI to show loading state if calculation is heavy (though typically instant here)
    setTimeout(() => {
        const res = calculatePortfolio(inputs);
        setResult(res);
        setIsCalculating(false);
    }, 100);
  };

  const handleSaveScenario = () => {
    if (!result) return;
    
    const newScenario: SavedScenario = {
        id: crypto.randomUUID(),
        name: `Scenario ${scenarios.length + 1}`,
        timestamp: Date.now(),
        inputs: { ...inputs }, // Copy inputs to avoid ref issues
        result: { ...result }  // Copy result
    };

    setScenarios([...scenarios, newScenario]);
  };

  const handleDeleteScenario = (id: string) => {
    setScenarios(scenarios.filter(s => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-indigo-600 p-2 rounded-lg mr-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Real Estate Investment Portfolio Optimizer</h1>
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">
            Exact Linear Programming Model
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Input */}
          <div className="w-full lg:w-1/4 flex-shrink-0">
            <div className="sticky top-24">
              <InputForm 
                values={inputs} 
                onChange={setInputs} 
                onCalculate={handleCalculate}
                isLoading={isCalculating}
              />
              
              <div className="mt-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">Model Assumptions</h4>
                <ul className="text-xs text-blue-600 space-y-1 list-disc pl-4">
                  <li>Discount Rate: 4.7% (Fixed)</li>
                  <li>Max Units/Project: 3</li>
                  <li>Bullet Loan Structure (Principal at maturity)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Dashboard */}
          <div className="w-full lg:w-3/4">
            
            <ScenarioComparison scenarios={scenarios} onDelete={handleDeleteScenario} />

            {result ? (
              <>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Current Result</h2>
                    <button 
                        onClick={handleSaveScenario}
                        className="inline-flex items-center px-4 py-2 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                        Save as Scenario
                    </button>
                </div>

                <SummaryCards result={result} inputs={inputs} />
                <Charts portfolio={result.portfolio} result={result} />
                <PortfolioTable items={result.portfolio} totalCost={result.totalInvestmentCost} />
              </>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center h-96 flex flex-col justify-center items-center">
                    <div className="p-4 bg-indigo-50 rounded-full mb-4">
                        <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Ready to Optimize</h3>
                    <p className="mt-2 text-gray-500 max-w-sm mx-auto">
                        Enter your financial parameters in the sidebar and click 
                        <span className="font-bold text-gray-700"> Calculate</span> to generate the optimal investment portfolio.
                    </p>
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
