
import React from 'react';
import { Empresa } from '../types';

interface CompanyCardProps {
  empresa: Empresa;
  onViewDetails: (empresa: Empresa) => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ empresa, onViewDetails }) => {
  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-indigo-100 flex flex-col h-full group relative overflow-hidden">
      {/* Background Decorativo sutil */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
      
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-white transition-colors shadow-inner overflow-hidden flex-shrink-0">
          {empresa.logo_url ? (
            <img src={empresa.logo_url} alt={empresa.nome} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-black text-indigo-600">{empresa.nome?.charAt(0)}</span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-700 transition-colors line-clamp-1 leading-tight">{empresa.nome}</h3>
          <span className="inline-block text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg uppercase tracking-tighter mt-1">{empresa.setor}</span>
        </div>
      </div>

      <div className="space-y-4 flex-1 relative z-10">
        <div className="flex items-start text-sm text-slate-500 font-medium">
          <svg className="w-4 h-4 mr-3 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span className="line-clamp-2">{empresa.localizacao}</span>
        </div>
        
        <div className="flex items-center text-sm text-slate-500 font-medium">
          <svg className="w-4 h-4 mr-3 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="font-mono text-xs">{empresa.cnpj || '---'}</span>
        </div>

        {empresa.descricao && (
          <p className="text-xs text-slate-400 line-clamp-2 italic leading-relaxed pt-2 border-t border-slate-50">
            "{empresa.descricao}"
          </p>
        )}
      </div>

      <div className="mt-8 relative z-10">
        <button 
          onClick={() => onViewDetails(empresa)}
          className="w-full bg-slate-900 text-white text-sm font-bold py-4 rounded-2xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-slate-100"
        >
          <span>Ver Informações</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};
