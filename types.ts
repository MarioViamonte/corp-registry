
export interface Empresa {
  id: number;
  created_at?: string;
  nome: string;
  setor: string;
  localizacao: string;
  cnpj?: string;
  descricao?: string;
  faturamento_anual?: number;
  numero_funcionarios?: number;
  site?: string;
  logo_url?: string;
  extra?: {
    cep?: string;
    regiao?: string;
    tipo?: string;
    endereco_completo?: string;
    municipio?: string;
    uf?: string;
  };
  [key: string]: any;
}

export interface BusinessInsight {
  summary: string;
  recommendations: string[];
  marketAnalysis: string;
}
