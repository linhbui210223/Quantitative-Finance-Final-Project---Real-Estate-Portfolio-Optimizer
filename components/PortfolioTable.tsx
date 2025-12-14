
import React from 'react';
import { PortfolioItem } from '../types';
import { formatCurrency } from '../services/optimizer';

interface PortfolioTableProps {
  items: PortfolioItem[];
  totalCost: number;
}

const PortfolioTable: React.FC<PortfolioTableProps> = ({ items, totalCost }) => {
  
  const downloadCSV = () => {
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
    link.setAttribute('download', 'portfolio_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 gap-4">
        <h3 className="text-lg font-bold text-gray-800">Selected Portfolio</h3>
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-sm font-medium text-gray-500">
            Total Invested: <span className="text-gray-900">{formatCurrency(totalCost)}</span>
            </span>
            {items.length > 0 && (
                <button
                    onClick={downloadCSV}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                    <svg className="-ml-0.5 mr-2 h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    Export CSV
                </button>
            )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Address</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">Dist from city center in km</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Cost</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Rent/Mo in 2025</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total NPV</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.length === 0 ? (
                <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-gray-500 text-sm">
                        No projects selected based on current budget.
                    </td>
                </tr>
            ) : (
                items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs">
                        <div className="truncate" title={item.project_name}>{item.project_name}</div>
                        {/* Mobile only address/dist/rent */}
                        <div className="md:hidden text-xs text-gray-400 mt-1 truncate">
                           {item.address} • {item.distance_km}km
                        </div>
                        <div className="lg:hidden text-xs text-indigo-500 mt-1">
                           Expected Rental in 2025: {formatCurrency(item.rental_fee_monthly || 0)}/mo
                        </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell max-w-xs truncate" title={item.address}>
                        {item.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right hidden xl:table-cell">
                        {item.distance_km}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {formatCurrency(item.cost)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right hidden lg:table-cell">
                        {formatCurrency(item.rental_fee_monthly || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center font-bold bg-indigo-50">
                        {item.units}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                        {formatCurrency(item.cost * item.units)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium text-right">
                        {formatCurrency(item.npv * item.units)}
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortfolioTable;
