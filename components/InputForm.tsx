
import React, { useState } from 'react';
import { UserInputs } from '../types';
import ProjectConstraintsModal from './ProjectConstraintsModal';

interface InputFormProps {
  values: UserInputs;
  onChange: (newValues: UserInputs) => void;
  onCalculate: () => void;
  isLoading?: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ values, onChange, onCalculate, isLoading = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (field: keyof UserInputs, val: string) => {
    const numVal = parseFloat(val);
    onChange({
      ...values,
      [field]: isNaN(numVal) ? 0 : numVal,
    });
  };

  const activeConstraintCount = values.constraints 
    ? Object.values(values.constraints).filter(v => v !== 'auto').length 
    : 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
        Parameters
      </h2>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Budget (Billions VND)</label>
          <div className="relative rounded-md shadow-sm">
            <input
              type="number"
              min="0"
              step="1"
              value={values.budgetTotalBillions}
              onChange={(e) => handleChange('budgetTotalBillions', e.target.value)}
              className="block w-full pr-12 text-gray-900 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 border"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">B</span>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">Includes Equity + Loan</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">LTV Ratio</label>
          <input
            type="number"
            min="0"
            max="1"
            step="0.05"
            value={values.ltvRatio}
            onChange={(e) => handleChange('ltvRatio', e.target.value)}
            className="block w-full text-gray-900 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 border"
          />
          <p className="mt-1 text-xs text-gray-500">e.g. 0.5 for 50%</p>
        </div>

        {values.ltvRatio > 0 && (
          <div className="animate-fade-in-down">
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Annual Loan Rate</label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={values.loanRateAnnual}
                  onChange={(e) => handleChange('loanRateAnnual', e.target.value)}
                  className="block w-full pr-12 text-gray-900 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 border"
                />
                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">% (decimal)</span>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">e.g. 0.06 for 6%</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loan Period (Years)</label>
              <input
                type="number"
                min="1"
                step="1"
                value={values.loanPeriodYears}
                onChange={(e) => handleChange('loanPeriodYears', e.target.value)}
                className="block w-full text-gray-900 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 border"
              />
            </div>
          </div>
        )}

        {/* Project Constraints Button */}
        <div className="pt-2 border-t border-gray-100">
           <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Rules</label>
           <button
             onClick={() => setIsModalOpen(true)}
             className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
           >
             <span>Project Constraints</span>
             {activeConstraintCount > 0 ? (
                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                     {activeConstraintCount} Active
                 </span>
             ) : (
                 <span className="text-gray-400 text-xs">Configure</span>
             )}
           </button>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={onCalculate}
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Optimizing...
            </span>
          ) : (
            'Calculate'
          )}
        </button>
      </div>

      <ProjectConstraintsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        constraints={values.constraints || {}}
        onApply={(newConstraints) => onChange({ ...values, constraints: newConstraints })}
      />
    </div>
  );
};

export default InputForm;
