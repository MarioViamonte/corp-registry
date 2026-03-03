#!/usr/bin/env node
// Script de teste rápido para Supabase

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_KEY;

console.log('🔍 Testando conexão com Supabase...');
console.log('URL:', url ? '✓ definida' : '✗ NÃO DEFINIDA');
console.log('KEY:', key ? '✓ definida' : '✗ NÃO DEFINIDA');

if (!url || !key) {
  console.error('\n❌ Variáveis de ambiente não configuradas!');
  console.error('Certifique-se de que .env contém:');
  console.error('  VITE_SUPABASE_URL=...');
  console.error('  VITE_SUPABASE_KEY=...');
  process.exit(1);
}

const supabase = createClient(url, key);

console.log('\n🔗 Testando SELECT * FROM CORPREGISTRY...\n');

const { data, error, status } = await supabase
  .from('CORPREGISTRY')
  .select('CD_FILIAL, NOME_FILIAL, NOME, ESTADO, Situacao')
  .limit(5);

if (error) {
  console.error('❌ ERRO:', {
    status,
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
  });
  process.exit(1);
}

console.log('✅ Conexão OK!');
console.log('📊 Primeiros ' + (data?.length ?? 0) + ' registros:');
console.log(JSON.stringify(data, null, 2));
