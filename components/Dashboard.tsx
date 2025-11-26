import React, { useMemo, useState } from 'react';
import { UnitData, FilterType } from '../types';
import { Users, Car, AlertCircle, Building2, TicketCheck, ChevronDown, ChevronUp } from 'lucide-react';
import StatCard from './StatCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

interface DashboardProps {
  data: UnitData[];
  loading: boolean;
  onFilterSelect: (type: FilterType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, loading, onFilterSelect }) => {
  const [showObservations, setShowObservations] = useState(true);

  const stats = useMemo(() => {
    const totalUnits = data.length;
    // Check if plate exists and is not just whitespace
    const totalVehicles = data.filter(u => u.plate && u.plate.trim().length > 0).length;
    // Check if rentedSpotObs exists
    const totalRented = data.filter(u => u.rentedSpotObs && u.rentedSpotObs.trim().length > 0).length;
    // Check if observations exists
    const totalObs = data.filter(u => u.observations && u.observations.trim().length > 0).length;

    return { totalUnits, totalVehicles, totalRented, totalObs };
  }, [data]);

  const recentObservations = useMemo(() => {
    // Filter units with observations and take the top 5 (simulated "recent" as data doesn't have timestamps, taking first 5 found)
    return data
      .filter(u => u.observations && u.observations.trim().length > 0)
      .slice(0, 5);
  }, [data]);

  const vehicleDistribution = useMemo(() => {
    const withCar = data.filter(u => u.plate && u.plate.trim().length > 0).length;
    const withoutCar = data.length - withCar;
    return [
      { name: 'Com Veículo', value: withCar },
      { name: 'Sem Veículo', value: withoutCar },
    ];
  }, [data]);

  const COLORS = ['#10b981', '#cbd5e1'];

  if (loading) {
    return (
      <div className="flex flex-col space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 w-1/3 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Página Inicial</h2>
        <p className="text-slate-500">Resumo estatístico do condomínio</p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Unidades"
          value={stats.totalUnits}
          icon={<Building2 className="w-6 h-6 text-indigo-600" />}
          colorClass="bg-indigo-50"
          onClick={() => onFilterSelect(FilterType.ALL)}
        />
        <StatCard
          title="Total de Veículos"
          value={stats.totalVehicles}
          icon={<Car className="w-6 h-6 text-emerald-600" />}
          colorClass="bg-emerald-50"
          onClick={() => onFilterSelect(FilterType.VEHICLES)}
        />
        <StatCard
          title="Vagas Alugadas"
          value={stats.totalRented}
          icon={<Users className="w-6 h-6 text-indigo-600" />}
          colorClass="bg-indigo-50"
          onClick={() => onFilterSelect(FilterType.RENTED_SPOTS)}
        />
        <StatCard
          title="Observações Ativas"
          value={stats.totalObs}
          icon={<AlertCircle className="w-6 h-6 text-amber-600" />}
          colorClass="bg-amber-50"
          onClick={() => onFilterSelect(FilterType.OBSERVATIONS)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Observations List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6 transition-all duration-300">
          <div 
            className="flex justify-between items-center mb-4 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setShowObservations(!showObservations)}
          >
            <h3 className="text-lg font-semibold text-slate-800">Últimas Observações</h3>
            <button className="text-slate-400 hover:text-indigo-600">
               {showObservations ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
          
          {showObservations && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
              {recentObservations.length > 0 ? (
                recentObservations.map((unit) => (
                  <div key={unit.id} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-slate-700">{unit.blockApt}</h4>
                      <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Recente</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{unit.observations}</p>
                    {unit.rentedSpotObs && (
                        <div className="mt-2 flex items-start space-x-2 text-xs text-indigo-600 bg-indigo-50 p-2 rounded">
                            <TicketCheck className="w-4 h-4 shrink-0" />
                            <span>{unit.rentedSpotObs}</span>
                        </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-sm">Nenhuma observação registrada.</p>
              )}
            </div>
          )}
        </div>

        {/* Mini Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Frota do Condomínio</h3>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vehicleDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {vehicleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;