# 🔍 Checklist de Debug - Supabase não retorna dados

## Passo 1: Verificar se a conexão básica funciona
Abra o **DevTools do navegador** (F12) e na aba **Console**, execute:

```javascript
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.98.0/+esm';

const supabase = createClient(
  'https://jqwtiyejqzbkmgxtqtfd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impxd3RpeWVqcXpia21neHRxdGZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0Nzg1MzksImV4cCI6MjA4MTA1NDUzOX0.YtQlhIjAA99a02a1ZC5lYrAzQJN5r-y_CkKAmYuGmcs'
);

const { data, error } = await supabase.from('CORPREGISTRY').select('*').limit(1);
console.log('Dados:', data);
console.log('Erro:', error);
```

Se receber um erro, anote:
- `code` (erro)
- `message` (mensagem)
- `details` (detalhes)

---

## Passo 2: Verificar RLS (Row Level Security)

No **Supabase Dashboard**:
1. Vá em **SQL Editor**
2. Execute:
```sql
-- Verificar se RLS está ativado
SELECT tablename, rowsecurity FROM pg_tables 
WHERE tablename = 'CORPREGISTRY';

-- Se RLS está ON e bloqueando, execute:
ALTER TABLE public."CORPREGISTRY" DISABLE ROW LEVEL SECURITY;
```

---

## Passo 3: Verificar se a tabela existe e tem dados

No **SQL Editor**:
```sql
-- Contar registros
SELECT COUNT(*) FROM "CORPREGISTRY";

-- Ver estrutura
\d "CORPREGISTRY"
```

---

## Passo 4: Criar política de segurança (se RLS está habilitado)

Se a tabela precisa de RLS, crie uma política:
```sql
-- Permitir leitura com anon key
CREATE POLICY "Allow public read" ON "CORPREGISTRY"
  FOR SELECT
  USING (true);
```

---

## Passo 5: Verificar logs do console do app

Abra **DevTools (F12)** → **Console** e procure por logs:
- `[api] Iniciando busca...` — se aparecer, a função foi chamada
- `[api] ❌ Erro...` — se aparecer, há erro específico
- `[api] ✅ Dados recebidos...` — se aparecer, funcionou!

---

## 📝 Respostas esperadas:

Se o `console.log` do Passo 1 mostrar:
```javascript
Dados: null
Erro: { code: "invalid_rls_check_policy", message: "..." }
```
→ **Solução**: Desabilitar ou criar política RLS no Passo 2

Se mostrar:
```javascript
Dados: []
Erro: null
```
→ **Problema**: A tabela existe mas está vazia (inserir dados)

Se mostrar:
```javascript
Dados: [{CD_FILIAL: 1, NOME_FILIAL: "...", ...}, ...]
Erro: null
```
→ **✅ Funcionando!** O app deve trazer os dados
