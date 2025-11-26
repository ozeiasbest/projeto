import React from 'react';
import { LayoutDashboard, Search, LogOut, Building, Wifi, ChevronLeft, ChevronRight, Github } from 'lucide-react';
import { Page } from '../types';
import { APP_NAME, SUBTITLE } from '../constants';

interface SidebarProps {
  currentPage: Page;
  setPage: (page: Page) => void;
  apiConnected: boolean;
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setPage, apiConnected, isOpen, toggle }) => {
  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-[#0f172a] text-white flex flex-col z-20 shadow-xl transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Header */}
      <div className={`p-6 flex items-center ${isOpen ? 'justify-between' : 'justify-center'} border-b border-slate-800 relative`}>
        <div className={`flex items-center space-x-3 ${!isOpen && 'hidden'}`}>
           <div className="bg-indigo-600 p-2 rounded-lg shrink-0">
             <Building className="w-6 h-6 text-white" />
           </div>
           <div className="overflow-hidden whitespace-nowrap">
             <h1 className="font-bold text-lg leading-tight">{APP_NAME}</h1>
             <p className="text-xs text-slate-400">{SUBTITLE}</p>
           </div>
        </div>
        
        {/* Collapsed Logo View */}
        {!isOpen && (
            <div className="bg-indigo-600 p-2 rounded-lg shrink-0">
                <Building className="w-6 h-6 text-white" />
            </div>
        )}

        {/* Toggle Button */}
        <button 
          onClick={toggle}
          className={`text-slate-400 hover:text-white transition-colors ${!isOpen ? 'absolute -right-3 top-8 bg-[#0f172a] rounded-full border border-slate-700 p-1 shadow-md' : ''}`}
        >
          {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-3 h-3" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <button
          onClick={() => setPage(Page.DASHBOARD)}
          title={!isOpen ? "Página Inicial" : undefined}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            currentPage === Page.DASHBOARD
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          } ${!isOpen ? 'justify-center px-2' : ''}`}
        >
          <LayoutDashboard className="w-5 h-5 shrink-0" />
          {isOpen && <span className="font-medium whitespace-nowrap">Página Inicial</span>}
        </button>

        <button
          onClick={() => setPage(Page.SEARCH)}
          title={!isOpen ? "Buscar Unidades" : undefined}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            currentPage === Page.SEARCH
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          } ${!isOpen ? 'justify-center px-2' : ''}`}
        >
          <Search className="w-5 h-5 shrink-0" />
          {isOpen && <span className="font-medium whitespace-nowrap">Buscar Unidades</span>}
        </button>

        <button
          onClick={() => setPage(Page.GITHUB)}
          title={!isOpen ? "GitHub" : undefined}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            currentPage === Page.GITHUB
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          } ${!isOpen ? 'justify-center px-2' : ''}`}
        >
          <Github className="w-5 h-5 shrink-0" />
          {isOpen && <span className="font-medium whitespace-nowrap">GitHub</span>}
        </button>
      </nav>

      {/* Footer Status */}
      <div className="p-4 border-t border-slate-800">
        <div 
          title={apiConnected ? 'API Conectada' : 'Desconectado'}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            apiConnected ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-900' : 'bg-red-900/30 text-red-400 border border-red-900'
        } ${!isOpen ? 'justify-center px-0 w-10 h-10 mx-auto' : ''}`}>
            <Wifi className="w-3 h-3 shrink-0" />
            {isOpen && <span className="whitespace-nowrap">{apiConnected ? 'API Conectada' : 'Desconectado'}</span>}
        </div>
        
        <button 
          title={!isOpen ? "Sair" : undefined}
          className={`mt-4 w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ${!isOpen ? 'justify-center px-2' : ''}`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {isOpen && <span>Sair</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;