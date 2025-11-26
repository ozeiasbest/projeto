import React from 'react';
import { StatCardProps } from '../types';

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center justify-between transition-all duration-200 ${
        onClick 
          ? 'cursor-pointer hover:shadow-md hover:border-indigo-200 active:scale-95' 
          : 'hover:shadow-md'
      }`}
    >
      <div>
        <h3 className="text-sm font-medium text-slate-500 mb-1">{title}</h3>
        <p className="text-3xl font-bold text-slate-800">{value}</p>
      </div>
      <div className={`p-4 rounded-lg ${colorClass}`}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;