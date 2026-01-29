
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Empresa } from './types';
import { fetchEmpresas } from './services/api';
import { Layout } from './components/Layout';
import { CompanyCard } from './components/CompanyCard';
import { CompanyDetailModal } from './components/CompanyDetailModal';

const App: React.FC = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchEmpresas();
      setEmpresas(data);
    } catch (err: any) {
      setError(`Não foi possível conectar ao banco de dados das empresas. Detalhes: ${err instanceof Error ? err.message : String(err)}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredEmpresas = useMemo(() => {
    return empresas.filter(emp =>
      emp.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.setor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.localizacao?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [empresas, searchTerm]);

  const sectorsCount = useMemo(() => {
    return new Set(empresas.map(e => e.setor)).size;
  }, [empresas]);

  return (
    <Layout>
      <div className="space-y-10 pb-20">
        {/* Header de Boas-vindas */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
              Explorador de Dados
            </h2>
            <p className="mt-4 text-lg text-slate-500 font-medium leading-relaxed">
              Base de consulta unificada para informações corporativas, segmentos de mercado e geolocalização de parceiros.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Empresas</span>
              <span className="text-2xl font-black text-indigo-600 leading-none">{empresas.length}</span>
            </div>
            <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Setores</span>
              <span className="text-2xl font-black text-indigo-600 leading-none">{sectorsCount}</span>
            </div>
          </div>
        </div>


        {/* Barra de Busca e Ações */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-5 border-2 border-transparent rounded-2xl leading-5 bg-white shadow-sm placeholder-slate-400 focus:outline-none focus:ring-0 focus:border-indigo-500 transition-all sm:text-base font-medium text-slate-700"
              placeholder="Pesquisar por nome, segmento ou localização..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Grid de Conteúdo Principal */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white rounded-3xl h-72 animate-pulse border border-slate-100 p-6">
                <div className="flex gap-4 mb-6">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl"></div>
                  <div className="flex-1 space-y-3 pt-1">
                    <div className="h-4 bg-slate-100 rounded-full w-3/4"></div>
                    <div className="h-3 bg-slate-100 rounded-full w-1/3"></div>
                  </div>
                </div>
                <div className="space-y-4 pt-6 border-t border-slate-50">
                  <div className="h-3 bg-slate-50 rounded-full w-full"></div>
                  <div className="h-3 bg-slate-50 rounded-full w-4/5"></div>
                  <div className="h-14 bg-slate-50 rounded-2xl w-full mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-sm">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-red-900 mb-2">Erro de Carregamento</h3>
            <p className="text-red-600 mb-8">{error}</p>
            <button
              onClick={loadData}
              className="bg-red-600 text-white px-10 py-3 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100"
            >
              Tentar Novamente
            </button>
          </div>
        ) : filteredEmpresas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEmpresas.map((emp) => (
              <CompanyCard
                key={emp.id}
                empresa={emp}
                onViewDetails={setSelectedCompany}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Nada por aqui...</h3>
            <p className="text-slate-500 max-w-xs mx-auto mb-8 font-medium">Não encontramos empresas com esses critérios de busca.</p>
            <button
              onClick={() => setSearchTerm('')}
              className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-colors shadow-lg"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>

      {/* Modal de Detalhes - Otimizado para Mobile */}
      {selectedCompany && (
        <CompanyDetailModal
          empresa={selectedCompany}
          onClose={() => setSelectedCompany(null)}
        />
      )}
    </Layout>
  );
};

export default App;
