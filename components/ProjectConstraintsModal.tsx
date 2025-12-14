
import React, { useState } from 'react';
import { PROJECTS } from '../constants';
import { ConstraintType } from '../types';
import { formatCurrency } from '../services/optimizer';

interface ProjectConstraintsModalProps {
  isOpen: boolean;
  onClose: () => void;
  constraints: Record<number, ConstraintType>;
  onApply: (newConstraints: Record<number, ConstraintType>) => void;
}

const ProjectConstraintsModal: React.FC<ProjectConstraintsModalProps> = ({ isOpen, onClose, constraints, onApply }) => {
  const [localConstraints, setLocalConstraints] = useState<Record<number, ConstraintType>>(constraints);
  const [searchTerm, setSearchTerm] = useState('');

  // Update local state when prop changes, if needed (mostly for opening)
  React.useEffect(() => {
    if (isOpen) {
        setLocalConstraints(constraints);
        setSearchTerm('');
    }
  }, [isOpen, constraints]);

  if (!isOpen) return null;

  const handleConstraintChange = (id: number, type: ConstraintType) => {
    setLocalConstraints(prev => ({
      ...prev,
      [id]: type
    }));
  };

  const handleSave = () => {
    onApply(localConstraints);
    onClose();
  };

  const handleClear = () => {
      setLocalConstraints({});
  };

  const filteredProjects = PROJECTS.filter(p => 
    p.project_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        {/* Center alignment spacer */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex flex-col max-h-[85vh]">
            
            <div className="sm:flex sm:items-start justify-between mb-4">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Project Constraints
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Exclude projects you don't like or force the optimizer to include specific ones.
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="px-4 mb-4">
                <input 
                    type="text" 
                    placeholder="Search projects..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-grow border-t border-b border-gray-200 min-h-[300px]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Cost</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Constraint</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProjects.map((p) => {
                    const status = localConstraints[p.id] || 'auto';
                    return (
                      <tr key={p.id} className={status !== 'auto' ? 'bg-indigo-50/30' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {p.project_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right hidden sm:table-cell">
                          {formatCurrency(p.cost)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex justify-center space-x-2">
                            {/* Auto Option */}
                            <label className={`cursor-pointer inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${status === 'auto' ? 'bg-white border-gray-300 text-gray-700 shadow-sm' : 'bg-transparent border-transparent text-gray-400 hover:bg-gray-50'}`}>
                              <input 
                                type="radio" 
                                name={`constraint-${p.id}`} 
                                className="sr-only"
                                checked={status === 'auto'}
                                onChange={() => handleConstraintChange(p.id, 'auto')}
                              />
                              Auto
                            </label>

                             {/* Force Include Option */}
                             <label className={`cursor-pointer inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${status === 'force' ? 'bg-green-100 border-green-200 text-green-800 shadow-sm' : 'bg-transparent border-transparent text-gray-400 hover:bg-gray-50'}`}>
                              <input 
                                type="radio" 
                                name={`constraint-${p.id}`} 
                                className="sr-only"
                                checked={status === 'force'}
                                onChange={() => handleConstraintChange(p.id, 'force')}
                              />
                              Must Have
                            </label>

                            {/* Exclude Option */}
                            <label className={`cursor-pointer inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${status === 'exclude' ? 'bg-red-100 border-red-200 text-red-800 shadow-sm' : 'bg-transparent border-transparent text-gray-400 hover:bg-gray-50'}`}>
                              <input 
                                type="radio" 
                                name={`constraint-${p.id}`} 
                                className="sr-only"
                                checked={status === 'exclude'}
                                onChange={() => handleConstraintChange(p.id, 'exclude')}
                              />
                              Exclude
                            </label>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
                type="button" 
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleSave}
            >
              Apply Constraints
            </button>
            <button 
                type="button" 
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={onClose}
            >
              Cancel
            </button>
            <button 
                type="button" 
                className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 sm:mt-0 sm:mr-auto sm:w-auto sm:text-sm"
                onClick={handleClear}
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectConstraintsModal;
