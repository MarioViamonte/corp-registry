
import React, { useState } from 'react';
import { Empresa } from '../types';
import { downloadCertidao, copyEmpresaToClipboard, shareCertidao } from '../src/services/certidaoService';

interface CompanyDetailModalProps {
  empresa: Empresa;
  onClose: () => void;
}

export const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({ empresa, onClose }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    setDownloadError(null);
    setCopiedSuccess(false);

    // Compartilhar dados da empresa e PDF
    const { success, error } = await shareCertidao(empresa, empresa.id);

    if (success) {
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 3000);
    } else {
      setDownloadError(error || 'Erro ao compartilhar');
      setTimeout(() => setDownloadError(null), 5000);
    }

    setIsSharing(false);
  };

  const handleDownloadCertidao = async () => {
    setIsDownloading(true);
    setDownloadError(null);
    setCopiedSuccess(false);

    // Step 1: Copiar dados da empresa para clipboard
    const copied = await copyEmpresaToClipboard(empresa);
    if (copied) {
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 3000);
    }

    // Step 2: Fazer download do PDF
    const { success, error } = await downloadCertidao(empresa.id);

    if (!success) {
      setDownloadError(error || 'Erro ao fazer download');
      setTimeout(() => setDownloadError(null), 5000);
    }

    setIsDownloading(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full animate-in zoom-in-95 duration-200">
          <div className="bg-indigo-600 px-6 py-5 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold">Ficha Cadastral da Unidade</h3>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleShare}
                disabled={isSharing}
                className="hover:bg-white/20 p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                title="Compartilhar dados + PDF (WhatsApp, Email, etc)"
              >
                {isSharing ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                )}
              </button>
              <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="bg-white px-8 py-10">
            <div className="flex flex-col md:flex-row gap-8 items-start mb-10 border-b border-slate-100 pb-10">
              <div className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center border border-indigo-100 shadow-inner flex-shrink-0 mx-auto md:mx-0 overflow-hidden">
                {empresa.logo_url ? (
                  <img src={empresa.logo_url} alt={empresa.nome} className="w-full h-full object-contain p-4" />
                ) : (
                  <span className="text-4xl font-black text-indigo-600">{empresa.nome.charAt(0)}</span>
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-2">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-lg uppercase tracking-wider border border-indigo-100">
                    {empresa.setor}
                  </span>
                  <span className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-wider border ${empresa.extra?.tipo === 'Matriz'
                    ? 'bg-green-50 text-green-700 border-green-100'
                    : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                    {empresa.extra?.tipo || 'Filial'}
                  </span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 leading-tight mb-2">{empresa.nome}</h2>
                <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  ID do Sistema: {empresa.id}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Endereço Operacional</label>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <p className="text-slate-700 font-bold text-sm mb-1">{empresa.extra?.endereco_completo || 'Logradouro não informado'}</p>
                    <p className="text-slate-500 text-xs font-medium">{empresa.extra?.regiao || ''} — {empresa.localizacao}</p>
                    <p className="text-slate-400 text-[10px] font-bold mt-3 uppercase tracking-tighter">CEP: {empresa.extra?.cep || '---'}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Cidade</label>
                    <p className="text-slate-700 font-bold bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">{empresa.extra?.municipio || '---'}</p>
                  </div>
                  <div className="w-20">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">UF</label>
                    <p className="text-slate-700 font-bold bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 text-center">{empresa.extra?.uf || '--'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Dados Fiscais</label>
                  <div className="bg-slate-900 p-6 rounded-2xl shadow-xl shadow-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">CNPJ de Faturamento</span>
                    <p className="text-white font-mono text-xl tracking-wider mb-4">{empresa.cnpj || 'ISENTO / NÃO INF.'}</p>

                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Inscrição Estadual</span>
                    <p className="text-white font-mono text-base tracking-wider">{empresa.extra?.inscricao_estadual || 'ISENTO'}</p>

                    <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Status</span>
                      <span className={`text-[10px] font-black uppercase ${empresa.extra?.situacao?.toUpperCase() === 'ATIVO' || empresa.extra?.situacao?.toUpperCase() === 'HABILITADO' ? 'text-green-400' : 'text-red-400'}`}>
                        {empresa.extra?.situacao || 'SITUAÇÃO DESCONHECIDA'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Resumo da Unidade</label>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    Esta unidade é uma {empresa.extra?.tipo?.toLowerCase()} estratégica do grupo, atuando no setor de {empresa.setor.toLowerCase()} na região de {empresa.extra?.regiao || empresa.extra?.municipio}.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 px-8 py-6 flex justify-between items-center border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400">Última sincronização: {new Date().toLocaleDateString()}</span>
            <div className="flex gap-3 items-center">
              {downloadError && (
                <span className="text-xs text-red-600 font-medium animate-pulse">
                  ⚠️ {downloadError}
                </span>
              )}
              {copiedSuccess && (
                <span className="text-xs text-green-600 font-medium animate-pulse">
                  ✅ Pronto para compartilhar!
                </span>
              )}
              <button
                onClick={handleDownloadCertidao}
                disabled={isDownloading}
                className="px-6 py-3 bg-indigo-600 text-white border border-indigo-700 rounded-2xl font-black text-xs hover:bg-indigo-700 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isDownloading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Baixando...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-4m0 0V8m0 4h4m-4 0H8m6-11a9 9 0 110 18 9 9 0 010-18z" />
                    </svg>
                    Exportar Certidão
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 font-black text-xs hover:bg-slate-50 transition-all shadow-sm active:scale-95"
              >
                Fechar Detalhes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
