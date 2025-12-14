import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList, PieChart, Pie, Cell } from 'recharts';
import { PortfolioItem, OptimizationResult } from '../types';

interface ChartsProps {
  portfolio: PortfolioItem[];
  result: OptimizationResult;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#3b82f6', '#14b8a6'];

const Charts: React.FC<ChartsProps> = ({ portfolio, result }) => {
  const data = portfolio.map(p => ({
    name: p.project_name, // Use full name for uniqueness
    Investment: (p.cost * p.units) / 1e9,
    Return: (p.npv * p.units) / 1e9,
  }));

  // Dynamic height: Min 500px, or 60px per item if list is long
  const chartHeight = Math.max(500, portfolio.length * 60);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      
      {/* Portfolio Allocation Chart - Takes 2/3 width */}
      <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Portfolio Allocation (Billions VND)</h3>
        <div style={{ height: `${chartHeight}px`, width: '100%' }}> 
            {portfolio.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 5, right: 60, left: 10, bottom: 5 }}
                    >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} />
                    <XAxis type="number" />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={220} 
                      tick={{fontSize: 11, fill: '#4b5563', fontWeight: 500}} 
                      interval={0} 
                    />
                    <Tooltip 
                        formatter={(value: number) => [`${value.toFixed(2)}B`, '']}
                        labelStyle={{ color: '#111827', fontWeight: 600 }}
                        contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '10px' }}/>
                    <Bar dataKey="Investment" fill="#6366f1" name="Cost" radius={[0, 4, 4, 0]} maxBarSize={40}>
                        <LabelList 
                            dataKey="Investment" 
                            position="right" 
                            formatter={(val: number) => `${val.toFixed(2)}B`} 
                            style={{ fill: '#6366f1', fontSize: 10, fontWeight: 600 }} 
                        />
                    </Bar>
                    <Bar dataKey="Return" fill="#10b981" name="NPV" radius={[0, 4, 4, 0]} maxBarSize={40}>
                        <LabelList 
                            dataKey="Return" 
                            position="right" 
                            formatter={(val: number) => `${val.toFixed(2)}B`} 
                            style={{ fill: '#10b981', fontSize: 10, fontWeight: 600 }} 
                        />
                    </Bar>
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-gray-400">No Data</div>
            )}
        </div>
      </div>

      {/* Value Breakdown - Takes 1/3 width */}
      <div className="lg:col-span-1 bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col">
         <h3 className="text-lg font-bold text-gray-800 mb-4">Value Breakdown</h3>
         <div className="flex-grow flex flex-col space-y-8 px-4 py-2">
            
            {/* Portfolio Weight (Pie Chart) */}
            <div className="flex flex-col items-center justify-center min-h-[200px]">
                <div className="flex mb-2 items-center justify-between w-full">
                     <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-100">
                        Portfolio Weight
                    </span>
                    <span className="text-xs text-gray-400 italic">by Cost</span>
                </div>
                <div className="h-48 w-full">
                    {portfolio.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={45}
                                    outerRadius={70}
                                    paddingAngle={2}
                                    dataKey="Investment"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(value: number, name: string) => [`${value.toFixed(2)}B`, name]}
                                    contentStyle={{ borderRadius: '0.5rem', fontSize: '12px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                         <div className="h-full flex items-center justify-center text-gray-400 text-xs">No Data</div>
                    )}
                </div>
            </div>

            {/* Budget Utilization */}
            <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                    <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                        Budget Utilization
                    </span>
                    </div>
                    <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-indigo-600">
                        {result.budgetLimit > 0 ? ((result.totalInvestmentCost / result.budgetLimit) * 100).toFixed(1) : 0}%
                    </span>
                    </div>
                </div>
                <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-indigo-100">
                    <div style={{ width: `${Math.min((result.totalInvestmentCost / result.budgetLimit) * 100, 100)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-500"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                 <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">
                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Cost</span>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{ (result.totalInvestmentCost / 1e9).toFixed(2) }B</p>
                 </div>
                 <div className="bg-green-50 p-6 rounded-xl border border-green-100 text-center">
                    <span className="text-xs text-green-600 uppercase font-bold tracking-wider">Total Return</span>
                    <p className="text-3xl font-bold text-green-700 mt-2">{ (result.operationalProfit / 1e9).toFixed(2) }B</p>
                 </div>
            </div>
             
             <div className="text-center pt-6 border-t border-gray-100">
                 <p className="text-sm text-gray-500 mb-1">Return on Investment</p>
                 <p className="text-4xl font-bold text-indigo-600">
                     { result.totalInvestmentCost > 0 ? ((result.operationalProfit / result.totalInvestmentCost) * 100).toFixed(2) : 0 }%
                 </p>
             </div>
         </div>
      </div>
    </div>
  );
};

export default Charts;