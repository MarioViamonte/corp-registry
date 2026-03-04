import { supabase } from './supabaseClient.js';
import type { Empresa } from '../../types';

const BUCKET_NAME = (import.meta as any).env.VITE_SUPABASE_BUCKET || 'Documentos';
const DOC_TABLE = 'doc_corp';

/**
 * Formata as informações da empresa em um texto legível
 * @param {Empresa} empresa - Dados da empresa
 * @returns {string} Texto formatado
 */
export function formatEmpresaInfo(empresa: Empresa): string {
  const lines = [
    '📋 FICHA CADASTRAL DA UNIDADE',
    '',
    `🏢 ${empresa.nome}`,
    empresa.setor ? `📊 Setor: ${empresa.setor}` : '',
    empresa.extra?.tipo ? `🏭 Tipo: ${empresa.extra.tipo}` : '',
    empresa.localizacao ? `📍 Localização: ${empresa.localizacao}` : '',
    empresa.id ? `🆔 ID do Sistema: ${empresa.id}` : '',
    '',
    '🏠 ENDEREÇO OPERACIONAL',
    empresa.extra?.endereco_completo ? `${empresa.extra.endereco_completo}` : `${empresa.endereco}`,
    empresa.extra?.regiao ? `${empresa.extra.regiao}` : '',
    empresa.extra?.cep ? `CEP: ${empresa.extra.cep}` : empresa.cep ? `CEP: ${empresa.cep}` : '',
    `${empresa.extra?.municipio || empresa.municipio || '---'} - ${empresa.extra?.uf || empresa.uf || '--'}`,
    '',
    '🏛️ DADOS FISCAIS',
    `CNPJ: ${empresa.cnpj || 'ISENTO / NÃO INF.'}`,
    empresa.extra?.inscricao_estadual ? `Inscrição Estadual: ${empresa.extra.inscricao_estadual}` : 'Inscrição Estadual: ISENTO',
    `Status: ${empresa.extra?.situacao || empresa.situacao || 'SITUAÇÃO DESCONHECIDA'}`,
    '',
    empresa.descricao ? '📝 DESCRIÇÃO' : '',
    empresa.descricao ? `${empresa.descricao}` : '',
  ];

  return lines.filter(line => line !== '').join('\n');
}

/**
 * Copia as informações da empresa para a clipboard
 * @param {Empresa} empresa - Dados da empresa
 * @returns {Promise<boolean>} True se conseguiu copiar
 */
export async function copyEmpresaToClipboard(empresa: Empresa): Promise<boolean> {
  try {
    const text = formatEmpresaInfo(empresa);
    await navigator.clipboard.writeText(text);
    console.log('[certidaoService] ✅ Dados copiados para clipboard');
    return true;
  } catch (err) {
    console.error('[certidaoService] ❌ Erro ao copiar:', err);
    return false;
  }
}

/**
 * Obtém o PDF como Blob para compartilhamento
 * @param {number} cdFilial - Código da filial / ID da empresa
 * @returns {Promise<{ blob?: Blob, fileName?: string, error?: string }>}
 */
export async function getPdfBlob(cdFilial: number | string) {
  try {
    console.log('[certidaoService] Obtendo PDF para compartilhamento:', cdFilial);
    
    // Step 1: Buscar o caminho do arquivo na tabela doc_corp
    const { data: docData, error: docError } = await supabase
      .from(DOC_TABLE)
      .select('documento_path')
      .eq('id', cdFilial)
      .single();

    if (docError || !docData) {
      console.error('[certidaoService] Documento não encontrado:', docError?.message);
      return { 
        error: 'Documento não encontrado para esta unidade'
      };
    }

    const documentPath = docData.documento_path;
    console.log('[certidaoService] Caminho do documento:', documentPath);

    // Step 2: Obter URL pública do arquivo
    const { data: publicUrlData } = supabase
      .storage
      .from(BUCKET_NAME)
      .getPublicUrl(documentPath);

    if (!publicUrlData?.publicUrl) {
      console.error('[certidaoService] ❌ Erro ao gerar URL pública');
      return { 
        error: 'Erro ao gerar URL do arquivo'
      };
    }

    const publicUrl = publicUrlData.publicUrl;
    console.log('[certidaoService] URL pública:', publicUrl);

    // Step 3: Fazer download via fetch
    const response = await fetch(publicUrl);
    
    if (!response.ok) {
      throw new Error(`Status ${response.status}`);
    }

    const blob = await response.blob();
    const fileName = documentPath.split('/').pop() || `certidao-${cdFilial}.pdf`;

    console.log('[certidaoService] ✅ PDF obtido:', fileName);
    return { blob, fileName };

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('[certidaoService] ❌ Erro ao obter PDF:', message);
    return { 
      error: message
    };
  }
}

/**
 * Faz download de um certificado/documento da filial
 * @param {number} cdFilial - Código da filial / ID da empresa
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function downloadCertidao(cdFilial: number | string) {
  try {
    console.log('[certidaoService] Iniciando download para ID:', cdFilial);
    
    const { blob, fileName, error } = await getPdfBlob(cdFilial);

    if (error || !blob) {
      return { 
        success: false, 
        error: error || 'Erro ao obter arquivo'
      };
    }

    // Disparar download no navegador
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'documento.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log('[certidaoService] 📥 Download concluído:', fileName);
    return { success: true };

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('[certidaoService] ❌ Erro:', message);
    return { 
      success: false, 
      error: message
    };
  }
}

/**
 * Compartilha os dados da empresa e PDF
 * @param {Empresa} empresa - Dados da empresa
 * @param {number} cdFilial - ID da empresa para buscar PDF
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function shareCertidao(empresa: Empresa, cdFilial: number | string) {
  try {
    console.log('[certidaoService] Iniciando compartilhamento:', cdFilial);
    
    // Step 1: Obter PDF
    const { blob, fileName, error } = await getPdfBlob(cdFilial);

    if (error || !blob) {
      return { 
        success: false, 
        error: error || 'Erro ao obter arquivo para compartilhamento'
      };
    }

    // Step 2: Preparar dados da empresa como legenda
    const legenda = formatEmpresaInfo(empresa);

    // Step 3: Tentar compartilhar com Web Share API
    if (navigator.share && navigator.canShare) {
      try {
        const file = new File([blob], fileName || 'documento.pdf', { type: 'application/pdf' });
        
        const shareData: any = {
          title: `Certidão - ${empresa.nome}`,
          text: legenda,
          files: [file],
        };

        // Verificar se pode compartilhar
        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          console.log('[certidaoService] ✅ Compartilhado com Legenda + PDF');
          return { success: true };
        } else {
          // Se não pode compartilhar com arquivo, tenta só com texto
          console.warn('[certidaoService] Não pode compartilhar arquivo, tentando só com texto...');
          await navigator.share({
            title: `Certidão - ${empresa.nome}`,
            text: legenda,
          });
          return { success: true };
        }
      } catch (shareErr) {
        if ((shareErr as Error).name !== 'AbortError') {
          console.error('[certidaoService] Erro no Web Share:', shareErr);
        }
      }
    }

    // Step 4: Se não conseguir compartilhar nativo, fazer download do PDF
    console.log('[certidaoService] Web Share não disponível, fazendo download do PDF...');
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'documento.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // Também copia a legenda para clipboard
    try {
      await navigator.clipboard.writeText(legenda);
      console.log('[certidaoService] ✅ Dados copiados para clipboard | PDF baixado');
    } catch (copyErr) {
      console.error('[certidaoService] Erro ao copiar:', copyErr);
    }

    return { success: true };

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('[certidaoService] ❌ Erro ao compartilhar:', message);
    return { 
      success: false, 
      error: message
    };
  }
}

/**
 * Lista informações de documentos disponíveis
 * @param {number} cdFilial - ID da empresa
 * @returns {Promise<{ document?: any, error?: string }>}
 */
export async function getDocumentInfo(cdFilial: number | string) {
  try {
    const { data, error } = await supabase
      .from(DOC_TABLE)
      .select('*')
      .eq('id', cdFilial)
      .single();

    if (error) {
      return { error: error.message };
    }

    return { document: data };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    return { error: message };
  }
}

