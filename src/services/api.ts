
import { Empresa } from '../../types';
import { supabase } from './supabaseClient.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mapSetor(name: string): string {
  const n = (name || '').toUpperCase();
  if (n.includes('CONSTRUTORA') || n.includes('CONSTRUCAO')) return 'Construção Civil';
  if (n.includes('AGROPECUARIA') || n.includes('FAZENDA')) return 'Agropecuária';
  if (n.includes('NUTRICAO ANIMAL')) return 'Nutrição Animal';
  if (n.includes('MOBILIDADE') || n.includes('MOBILIZE')) return 'Locação de Veículos';
  if (n.includes('LOCACOES') || n.includes('LOCADORA')) return 'Locação de Máquinas';
  if (n.includes('ENERGIA') || n.includes('ZERO CARBONO') || n.includes('FOTOVOLTAICAS') || n.includes('ENERGIZE')) return 'Energia Renovável';
  if (n.includes('DISTRIBUIDORA') || n.includes('ASFALTO')) return 'Indústria & Distribuição';
  if (n.includes('TRANSPORTADORA') || n.includes('RODOVIAS')) return 'Concessão de Rodovias';
  if (n.includes('PARTICIPACOES') || n.includes('GESTAO')) return 'Holding & Gestão';
  return 'Geral';
}

const getLogo = (name: string): string | undefined => {
  const n = name.toUpperCase();
  if (n.includes('MOD ')) return '/logos/MOD.png';
  if (n.includes('MEDALHA')) return '/logos/MEDALHA NUTRIÇÃO ANIMAL.png';
  if (n.includes('JATOBA')) return '/logos/JATOBA.png';
  if (n.includes('AGROPECUARIA') || n.includes('FAZENDA')) return '/logos/AGROPECUARIA.png';
  if (n.includes('CONSTRUTORA') || n.includes('CONSTRUCAO')) return '/logos/CONSTRUTORA.png';
  if (n.includes('MOBILIDADE') || n.includes('MOBILIZE') || n.includes('MOBILIZEC')) return '/logos/MOBILIZEC.png';
  if (n.includes('LOCACOES') || n.includes('LOCADORA')) return '/logos/VF LOCACOES.png';
  if (n.includes('FRONTEIRA')) return '/logos/FRONTEIRA.png';
  if (n.includes('VSB')) return '/logos/VSB.png';
  if (n.includes('PARTICIPACOES') || n.includes('GESTAO')) return '/logos/VF PAR.pdf.png';
  if (n.includes('VIA NORTE SUL')) return '/logos/VIA NORTE SUL.pdf.png';
  if (n.includes('ENERGIA') || n.includes('ZERO CARBONO') || n.includes('FOTOVOLTAICAS') || n.includes('ENERGIZE')) return '/logos/Energize-C.png';
  return undefined;
};

// ---------------------------------------------------------------------------
// Mapeia uma row da tabela CORPREGISTRY para a interface Empresa
// ---------------------------------------------------------------------------

function rowToEmpresa(row: Record<string, any>): Empresa {
  const nome = row.NOME_FILIAL || row.NOME || '';
  return {
    id: row.CD_FILIAL,
    nome,
    setor: mapSetor(nome),
    localizacao: `${row.CIDADE ?? ''} - ${row.ESTADO ?? ''}`,
    cnpj: row.CNPJ,
    descricao: `Unidade operacional em ${row.CIDADE ?? 'N/A'}.`,
    numero_funcionarios: Math.floor(Math.random() * 50) + 10,
    faturamento_anual: undefined,
    site: undefined,
    logo_url: getLogo(nome),
    extra: {
      cep: row.CEP,
      regiao: row['REGIÃO'],
      tipo: row.U_Matriz === 'S' ? 'Matriz' : 'Filial',
      endereco_completo: `${row['ENDEREÇO_1'] ?? ''} ${row['ENDEREÇO_2'] ?? ''}, ${row['ENDEREÇO_3'] ?? ''} ${row['ENDEREÇO_4'] ?? ''}`.trim(),
      municipio: row.CIDADE,
      uf: row.ESTADO,
      inscricao_estadual: row.InscricaoEstadual,
      situacao: row.Situacao,
    },
  };
}

// ---------------------------------------------------------------------------
// API pública — busca do Supabase (tabela CORPREGISTRY)
// ---------------------------------------------------------------------------

export const fetchEmpresas = async (): Promise<Empresa[]> => {
  console.log('[api] Iniciando busca de empresas do Supabase...');
  
  const { data, error } = await supabase
    .from('CORPREGISTRY')
    .select('*')
    .order('CD_FILIAL', { ascending: true });

  if (error) {
    console.error('[api] ❌ Erro ao buscar empresas:', {
      message: error.message,
      code: error.code,
      details: (error as any).details,
      hint: (error as any).hint,
    });
    return [];
  }

  console.log('[api] ✅ Dados recebidos:', data?.length ?? 0, 'registros');

  const filtered = (data ?? [])
    .filter((row: Record<string, any>) => {
      const nome = (row.NOME_FILIAL || row.NOME || '').toUpperCase();
      return !nome.includes('SCP');
    })
    .map(rowToEmpresa);

  console.log('[api] 📊 Após filtro:', filtered.length, 'empresas');
  return filtered;
};
