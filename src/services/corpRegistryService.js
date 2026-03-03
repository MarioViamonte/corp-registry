import { supabase } from './supabaseClient.js';

const TABLE = 'CORPREGISTRY';
const PK = 'CD_FILIAL';

/**
 * Busca todos os registros da tabela CORPREGISTRY.
 * @returns {{ data: Array|null, error: object|null }}
 */
export async function getFiliais() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order(PK, { ascending: true });

  if (error) {
    console.error('[corpRegistryService] Erro ao buscar filiais:', error.message);
  }

  return { data, error };
}

/**
 * Busca uma filial pelo CD_FILIAL.
 * @param {number} cdFilial
 * @returns {{ data: object|null, error: object|null }}
 */
export async function getFilialById(cdFilial) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq(PK, cdFilial)
    .single();

  if (error) {
    console.error('[corpRegistryService] Erro ao buscar filial:', error.message);
  }

  return { data, error };
}

/**
 * Insere uma nova filial.
 * @param {object} filial - Objeto com os campos da tabela CORPREGISTRY.
 * @returns {{ data: object|null, error: object|null }}
 */
export async function createFilial(filial) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(filial)
    .select()
    .single();

  if (error) {
    console.error('[corpRegistryService] Erro ao inserir filial:', error.message);
  }

  return { data, error };
}

/**
 * Atualiza uma filial existente pelo CD_FILIAL.
 * @param {number} cdFilial - Código da filial.
 * @param {object} updates  - Campos a serem atualizados.
 * @returns {{ data: object|null, error: object|null }}
 */
export async function updateFilial(cdFilial, updates) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(updates)
    .eq(PK, cdFilial)
    .select()
    .single();

  if (error) {
    console.error('[corpRegistryService] Erro ao atualizar filial:', error.message);
  }

  return { data, error };
}

/**
 * Deleta uma filial pelo CD_FILIAL.
 * @param {number} cdFilial - Código da filial.
 * @returns {{ data: object|null, error: object|null }}
 */
export async function deleteFilial(cdFilial) {
  const { data, error } = await supabase
    .from(TABLE)
    .delete()
    .eq(PK, cdFilial)
    .select()
    .single();

  if (error) {
    console.error('[corpRegistryService] Erro ao deletar filial:', error.message);
  }

  return { data, error };
}

/**
 * Busca filiais filtradas por estado (UF).
 * @param {string} uf - Sigla do estado (ex: "MT", "PA").
 * @returns {{ data: Array|null, error: object|null }}
 */
export async function getByEstado(uf) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('ESTADO', uf)
    .order(PK, { ascending: true });

  if (error) {
    console.error('[corpRegistryService] Erro ao buscar por estado:', error.message);
  }

  return { data, error };
}

/**
 * Busca filiais filtradas por situação.
 * @param {string} situacao - Ex: "Ativo", "Baixado".
 * @returns {{ data: Array|null, error: object|null }}
 */
export async function getBySituacao(situacao) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('Situacao', situacao)
    .order(PK, { ascending: true });

  if (error) {
    console.error('[corpRegistryService] Erro ao buscar por situação:', error.message);
  }

  return { data, error };
}
