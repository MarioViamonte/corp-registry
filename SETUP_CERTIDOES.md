# 📋 Setup - Exportar Certidões do Supabase

## ✅ Status Atual

- ✅ Bucket `Documentos` criado
- ✅ Arquivos PDF enviados (1.pdf, 3.pdf, 4.pdf, etc.)
- ✅ Tabela `doc_corp` criada com `id` e `documento_path`
- ✅ App integrado com banco de dados

---

## 🔧 Como Funciona Agora

O app **busca automaticamente** o arquivo no banco de dados:

1. **Usuário clica** no botão "Exportar Certidão" no modal
2. **App consulta** a tabela `doc_corp` com o `id` da empresa
3. **Recupera** o `documento_path` (ex: `public/1.pdf`)
4. **Faz download** do arquivo do bucket `Documentos`
5. **Arquivo** é salvo no computador do usuário

---

## 📊 Estrutura de Dados Esperada

### Tabela: `doc_corp`

```sql
CREATE TABLE doc_corp (
  id INT4 PRIMARY KEY,
  documento_path TEXT NOT NULL
);

-- Exemplo de dados:
INSERT INTO doc_corp VALUES
  (1, 'public/1.pdf'),
  (3, 'public/3.pdf'),
  (4, 'public/4.pdf'),
  (5, '5.pdf'),  -- Pode estar direto na raiz
  -- ... etc
```

**Coluna `documento_path`**: Caminho relativo do arquivo dentro do bucket
- Exemplos: `1.pdf`, `public/1.pdf`, `certidoes/1.pdf`, etc.

---

## 📁 Estrutura do Bucket `Documentos`

O bucket deve conter os arquivos PDF:

```
Documentos/
  ├── 1.pdf
  ├── 3.pdf
  ├── 4.pdf
  ├── 5.pdf
  ├── 6.pdf
  ├── 7.pdf
  ├── 8.pdf
  ├── 9.pdf
  ├── 10.pdf
  ├── ... (um arquivo por ID)
```

Ou organizado em subpastas:

```
Documentos/
  ├── public/
  │   ├── 1.pdf
  │   ├── 3.pdf
  │   └── ...
```

**O importante**: O caminho em `documento_path` deve corresponder ao local real do arquivo.

---

## ✅ Checklist Final

- [ ] Tabela `doc_corp` criada com colunas `id` (int4) e `documento_path` (text)
- [ ] Todos os IDs da tabela `CORPREGISTRY` têm entradas em `doc_corp`
- [ ] Arquivos PDF estão no bucket `Documentos`
- [ ] Valores de `documento_path` correspondem aos arquivos (ex: `1.pdf` para ID 1)
- [ ] Variável `VITE_SUPABASE_BUCKET=Documentos` está em `.env`
- [ ] RLS policies do bucket permitem leitura pública

---

## 🧪 Testar

1. **Rode o app**: `npm run dev`
2. **Acesse**: http://localhost:3001/
3. **Clique** em um card (ex: ID 1, 3, 4...)
4. **Clique** no botão "Exportar Certidão"
5. **Verifique** se o arquivo faz download

---

## 🐛 Se não funcionar

### Erro: "Documento não encontrado"
- ✓ Confirme se existe um registro em `doc_corp` com o `id` da empresa
- ✓ Verifique o campo `documento_path` (não deixe vazio)

### Erro: "Arquivo não encontrado no Storage"
- ✓ O arquivo deve estar exatamente no caminho especificado em `documento_path`
- ✓ Diferencie maiúscula/minúscula (Linux é case-sensitive)
- ✓ Exemplos corretos: `1.pdf`, `public/1.pdf`, `certidoes/1.pdf`

### Erro: "Unauthorized"
- ✓ Verifique as RLS policies do bucket
- ✓ O bucket precisa ter política de leitura pública

---

## 📝 Variáveis de Ambiente

No `.env`:
```dotenv
VITE_SUPABASE_URL=https://jqwtiyejqzbkmgxtqtfd.supabase.co
VITE_SUPABASE_KEY=eyJ...
VITE_SUPABASE_BUCKET=Documentos
```

Pronto! 🎉
