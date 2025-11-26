import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SearchPage from './components/Search';
import { Page, UnitData, FilterType } from './types';
import { fetchCondoData } from './services/api';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
  const [currentFilterType, setCurrentFilterType] = useState<FilterType>(FilterType.ALL);
  const [data, setData] = useState<UnitData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await fetchCondoData();
        setData(result);
        setError(null);
      } catch (err) {
        setError("Não foi possível carregar os dados do condomínio. Verifique sua conexão ou contate o administrador.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleFilterSelect = (type: FilterType) => {
    setCurrentFilterType(type);
    setCurrentPage(Page.SEARCH);
  };

  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
    // Reset filter when navigating via sidebar to Search
    if (page === Page.SEARCH) {
        setCurrentFilterType(FilterType.ALL);
    }
  };

  const renderContent = () => {
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                <div className="bg-red-50 p-6 rounded-full mb-4">
                    <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Erro de Conexão</h3>
                <p className="text-slate-600 max-w-md">{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Tentar Novamente
                </button>
            </div>
        )
    }

    switch (currentPage) {
      case Page.DASHBOARD:
        return <Dashboard data={data} loading={loading} onFilterSelect={handleFilterSelect} />;
      case Page.SEARCH:
        return <SearchPage data={data} initialFilterType={currentFilterType} />;
      default:
        return <Dashboard data={data} loading={loading} onFilterSelect={handleFilterSelect} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        currentPage={currentPage} 
        setPage={handlePageChange} 
        apiConnected={!loading && !error}
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} p-8 overflow-y-auto`}>
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;