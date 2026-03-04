import { supabase } from './supabaseClient.js';

const BUCKET_NAME = (import.meta as any).env.VITE_SUPABASE_BUCKET || 'Documentos';
const DOC_TABLE = 'doc_corp';

/**
 * Faz download de um certificado/documento da filial
 * Busca o caminho do arquivo na tabela doc_corp e faz download do Storage
 * @param {number} cdFilial - Código da filial / ID da empresa
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function downloadCertidao(cdFilial: number | string) {
  try {
    console.log('[certidaoService] Iniciando download para ID:', cdFilial);
    
    // Step 1: Buscar o caminho do arquivo na tabela doc_corp
    const { data: docData, error: docError } = await supabase
      .from(DOC_TABLE)
      .select('documento_path')
      .eq('id', cdFilial)
      .single();

    if (docError || !docData) {
      console.error('[certidaoService] Documento não encontrado:', docError?.message);
      return { 
        success: false, 
        error: 'Documento não encontrado para esta unidade'
      };
    }

    const documentPath = docData.documento_path;
    console.log('[certidaoService] Caminho do documento:', documentPath);

    // Step 2: Obter URL pública do arquivo (bucket é público)
    const { data: publicUrlData } = supabase
      .storage
      .from(BUCKET_NAME)
      .getPublicUrl(documentPath);

    if (!publicUrlData?.publicUrl) {
      console.error('[certidaoService] ❌ Erro ao gerar URL pública');
      return { 
        success: false, 
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
    
    // Step 4: Extrair nome do arquivo do caminho
    const fileName = documentPath.split('/').pop() || `certidao-${cdFilial}.pdf`;

    // Step 5: Disparar download no navegador
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
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

