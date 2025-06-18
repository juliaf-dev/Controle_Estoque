# Rotas de Categorias - API Controle de Estoque

## Visão Geral

As rotas de categorias permitem gerenciar as categorias de produtos no sistema de controle de estoque. Todas as operações de remoção são feitas via soft delete (marcação como inativa).

## URL Base
```
http://localhost:3000
```

## Endpoints Disponíveis

### 1. Listar Categorias
**GET** `/categories`

Lista todas as categorias ativas ordenadas por nome.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "Eletrônicos",
      "descricao": "Produtos eletrônicos e tecnológicos",
      "ativo": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 1
}
```

### 2. Buscar Categoria por ID
**GET** `/categories/:id`

Busca uma categoria específica pelo ID.

**Parâmetros:**
- `id` (number): ID da categoria

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nome": "Eletrônicos",
    "descricao": "Produtos eletrônicos e tecnológicos",
    "ativo": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Resposta de Erro (404):**
```json
{
  "success": false,
  "error": "Categoria não encontrada"
}
```

### 3. Criar Categoria
**POST** `/categories`

Cria uma nova categoria.

**Body (JSON):**
```json
{
  "nome": "Eletrônicos",
  "descricao": "Produtos eletrônicos e tecnológicos"
}
```

**Validações:**
- `nome`: Obrigatório, entre 2 e 100 caracteres
- `descricao`: Opcional, máximo 500 caracteres

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "message": "Categoria criada com sucesso",
  "data": {
    "id": 1,
    "nome": "Eletrônicos",
    "descricao": "Produtos eletrônicos e tecnológicos",
    "ativo": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Resposta de Erro (409):**
```json
{
  "success": false,
  "error": "Já existe uma categoria com este nome"
}
```

### 4. Atualizar Categoria
**PUT** `/categories/:id`

Atualiza uma categoria existente.

**Parâmetros:**
- `id` (number): ID da categoria

**Body (JSON):**
```json
{
  "nome": "Eletrônicos Atualizados",
  "descricao": "Produtos eletrônicos e tecnológicos atualizados",
  "ativo": true
}
```

**Validações:**
- `nome`: Opcional, entre 2 e 100 caracteres
- `descricao`: Opcional, máximo 500 caracteres
- `ativo`: Opcional, valor booleano

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Categoria atualizada com sucesso",
  "data": {
    "id": 1,
    "nome": "Eletrônicos Atualizados",
    "descricao": "Produtos eletrônicos e tecnológicos atualizados",
    "ativo": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. Remover Categoria
**DELETE** `/categories/:id`

Remove uma categoria (soft delete - marca como inativa).

**Parâmetros:**
- `id` (number): ID da categoria

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Categoria removida com sucesso"
}
```

## Códigos de Status HTTP

- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Erro de validação
- **404**: Categoria não encontrada
- **409**: Conflito (nome duplicado)
- **500**: Erro interno do servidor

## Exemplos de Uso

### Criar Categorias de Exemplo

1. **Eletrônicos:**
```bash
curl -X POST http://localhost:3000/categories \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Eletrônicos",
    "descricao": "Produtos eletrônicos e tecnológicos"
  }'
```

2. **Roupas:**
```bash
curl -X POST http://localhost:3000/categories \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Roupas",
    "descricao": "Vestuário e acessórios"
  }'
```

3. **Livros:**
```bash
curl -X POST http://localhost:3000/categories \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Livros",
    "descricao": "Livros e publicações"
  }'
```

### Listar Todas as Categorias
```bash
curl -X GET http://localhost:3000/categories
```

### Atualizar uma Categoria
```bash
curl -X PUT http://localhost:3000/categories/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Eletrônicos Premium",
    "descricao": "Produtos eletrônicos de alta qualidade"
  }'
```

## Testes no Postman

Importe o arquivo `Postman_Collection_Categorias.json` no Postman para ter acesso a todos os exemplos de requisições pré-configuradas.

## Documentação Swagger

Acesse `http://localhost:3000/api-docs` para ver a documentação interativa da API com todos os endpoints de categorias.

## Estrutura do Banco de Dados

A tabela `categorias` possui os seguintes campos:

- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
- `nome` (VARCHAR(100), NOT NULL, UNIQUE)
- `descricao` (TEXT, NULL)
- `ativo` (BOOLEAN, NOT NULL, DEFAULT: true)
- `createdAt` (DATETIME, NOT NULL)
- `updatedAt` (DATETIME, NOT NULL) 