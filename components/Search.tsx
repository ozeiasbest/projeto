import React, { useState, useMemo, useEffect } from 'react';
import { UnitData, FilterType } from '../types';
import { Search as SearchIcon, Filter, X, Phone, Car, Tag, User, Hash, AlertTriangle, FileText, LayoutGrid } from 'lucide-react';

interface SearchProps {
  data: UnitData[];
  initialFilterType: FilterType;
}

const SearchPage: React.FC<SearchProps> = ({ data, initialFilterType }) => {
  const [activeFilterType, setActiveFilterType] = useState<FilterType>(initialFilterType);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Specific filters state
  const [filterBlock, setFilterBlock] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterPlate, setFilterPlate] = useState('');
  const [filterCarModel, setFilterCarModel] = useState('');

  // Update active filter if prop changes (e.g. re-navigating from dashboard)
  useEffect(() => {
    setActiveFilterType(initialFilterType);
  }, [initialFilterType]);

  const filteredData = useMemo(() => {
    return data.filter((unit) => {
      // 1. Global Search
      const searchLower = searchTerm.toLowerCase();
      const matchesGlobal =
        searchTerm === '' ||
        unit.blockApt.toLowerCase().includes(searchLower) ||
        unit.name.toLowerCase().includes(searchLower) ||
        unit.plate.toLowerCase().includes(searchLower) ||
        unit.phone.toLowerCase().includes(searchLower) ||
        unit.sticker.toLowerCase().includes(searchLower) ||
        unit.carModel.toLowerCase().includes(searchLower);

      // 2. Specific Filters
      const matchesBlock = unit.blockApt.toLowerCase().includes(filterBlock.toLowerCase());
      const matchesName = unit.name.toLowerCase().includes(filterName.toLowerCase());
      const matchesPlate = unit.plate.toLowerCase().includes(filterPlate.toLowerCase());
      const matchesCarModel = unit.carModel.toLowerCase().includes(filterCarModel.toLowerCase());

      // 3. Type Filter (From Dashboard)
      let matchesType = true;
      if (activeFilterType === FilterType.VEHICLES) {
        matchesType = !!(unit.plate && unit.plate.trim().length > 0);
      } else if (activeFilterType === FilterType.RENTED_SPOTS) {
        matchesType = !!(unit.rentedSpotObs && unit.rentedSpotObs.trim().length > 0);
      } else if (activeFilterType === FilterType.OBSERVATIONS) {
        matchesType = !!(unit.observations && unit.observations.trim().length > 0);
      }

      return matchesGlobal && matchesBlock && matchesName && matchesPlate && matchesCarModel && matchesType;
    });
  }, [data, searchTerm, filterBlock, filterName, filterPlate, filterCarModel, activeFilterType]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilterBlock('');
    setFilterName('');
    setFilterPlate('');
    setFilterCarModel('');
    setActiveFilterType(FilterType.ALL);
  };

  const hasActiveFilters = searchTerm || filterBlock || filterName || filterPlate || filterCarModel || activeFilterType !== FilterType.ALL;

  const FilterTab = ({ type, label, icon: Icon }: { type: FilterType; label: string; icon: any }) => (
    <button
      onClick={() => setActiveFilterType(type)}
      className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 ${
        activeFilterType === type
          ? 'bg-indigo-600 text-white shadow-md'
          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Buscar Unidades</h2>
          <p className="text-slate-500">Localize moradores, veículos e ocorrências</p>
        </div>
        {hasActiveFilters && (
             <button
             onClick={clearFilters}
             className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
           >
             <X className="w-4 h-4" /> Limpar Filtros
           </button>
        )}
      </div>

      {/* Quick Filter Tabs */}
      <div className="flex flex-wrap gap-3">
        <FilterTab type={FilterType.ALL} label="Todos" icon={LayoutGrid} />
        <FilterTab type={FilterType.VEHICLES} label="Com Veículos" icon={Car} />
        <FilterTab type={FilterType.RENTED_SPOTS} label="Vagas Alugadas" icon={FileText} />
        <FilterTab type={FilterType.OBSERVATIONS} label="Com Observações" icon={AlertTriangle} />
      </div>

      {/* Search Bar & Toggle */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Pesquisa rápida (Nome, Bloco, Placa...)"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg border flex items-center gap-2 font-medium transition-colors ${
              showFilters
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Bloco / Apto</label>
              <div className="relative">
                <Hash className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Ex: 1-102"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    value={filterBlock}
                    onChange={(e) => setFilterBlock(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Nome</label>
              <div className="relative">
                 <User className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Nome do morador"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Placa</label>
              <div className="relative">
                <Tag className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="ABC-1234"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    value={filterPlate}
                    onChange={(e) => setFilterPlate(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Modelo Carro</label>
              <div className="relative">
                <Car className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Fiat Palio..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    value={filterCarModel}
                    onChange={(e) => setFilterCarModel(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
            <span className="text-sm text-slate-500">
                Encontrados: <strong className="text-slate-800">{filteredData.length}</strong> registros
            </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredData.length > 0 ? (
            filteredData.map((unit) => (
              <div
                key={unit.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow duration-200 flex flex-col lg:flex-row gap-6"
              >
                {/* Left: Basic Info */}
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-sm font-bold">
                      {unit.blockApt}
                    </span>
                    <h3 className="font-semibold text-slate-800 text-lg truncate" title={unit.name}>{unit.name}</h3>
                  </div>
                  
                  <div className="flex flex-col gap-1 text-sm text-slate-600 mt-3">
                     {unit.phone && (
                         <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <span>{unit.phone}</span>
                         </div>
                     )}
                     {(unit.plate || unit.carModel) ? (
                        <div className="flex items-center gap-2">
                            <Car className="w-4 h-4 text-slate-400" />
                            <span>
                                {unit.carModel || 'Modelo não inf.'} 
                                {unit.plate && <span className="font-mono bg-slate-100 px-1 ml-1 rounded text-slate-700 border border-slate-200">{unit.plate}</span>}
                            </span>
                        </div>
                     ) : (
                         <div className="flex items-center gap-2 text-slate-400 italic">
                             <Car className="w-4 h-4" /> Sem veículo registrado
                         </div>
                     )}
                     {unit.sticker && (
                         <div className="flex items-center gap-2 text-amber-600">
                             <Tag className="w-4 h-4" />
                             <span className="font-medium">Adesivo: {unit.sticker}</span>
                         </div>
                     )}
                  </div>
                </div>

                {/* Right: Observations & Alerts */}
                <div className="flex-1 lg:border-l lg:border-slate-100 lg:pl-6 flex flex-col gap-3">
                    {unit.observations && (
                        <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                            <h4 className="text-xs font-bold text-amber-700 uppercase mb-1 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Observações
                            </h4>
                            <p className="text-sm text-slate-700">{unit.observations}</p>
                        </div>
                    )}
                    {unit.rentedSpotObs && (
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                             <h4 className="text-xs font-bold text-blue-700 uppercase mb-1 flex items-center gap-1">
                                <FileText className="w-3 h-3" /> Vaga Alugada
                            </h4>
                            <p className="text-sm text-slate-700">{unit.rentedSpotObs}</p>
                        </div>
                    )}
                    {!unit.observations && !unit.rentedSpotObs && (
                        <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
                            Sem observações adicionais.
                        </div>
                    )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
              <SearchIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">Nenhum resultado encontrado.</p>
              <p className="text-slate-400 text-sm">Tente ajustar os filtros de busca ou alterar a categoria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;