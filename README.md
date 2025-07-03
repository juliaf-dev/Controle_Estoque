# API REST - Sistema de Controle de Estoque

Backend do sistema de controle de estoque "So Bugiganga" desenvolvido em Node.js, Express e Sequelize.

## Funcionalidades

- Cadastro e autenticação de usuários (JWT)
- Gestão de produtos, categorias, clientes, fornecedores e pedidos
- Relacionamento entre entidades
- Documentação interativa via Swagger

## Instalação e Execução

1. **Instale as dependências:**
   ```bash
   npm install
   ```
2. **Configure o banco de dados:**
   - Edite `src/database/database.ts` e `config/config.js` conforme necessário.
3. **Execute as migrações:**
   ```bash
   npx sequelize-cli db:migrate
   ```
4. **Inicie o servidor:**
   ```bash
   npm run dev
   ```

## Documentação da API

Acesse a documentação Swagger em:
[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Estrutura do Projeto

```
src/
├── controllers/   # Lógica dos endpoints
├── models/        # Modelos Sequelize
├── routes/        # Rotas da API
├── middlewares/   # Middlewares (ex: autenticação)
├── services/      # Serviços auxiliares
├── config/        # Configurações (Swagger, etc)
└── database/      # Configuração do banco de dados
```

## Tecnologias Utilizadas

- Node.js
- Express
- Sequelize
- JWT
- Swagger

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b minha-feature`
3. Commit suas alterações: `git commit -m 'feat: minha nova feature'`
4. Push para o branch: `git push origin minha-feature`
5. Abra um Pull Request

## Variáveis de Ambiente (.env)

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

### Banco de Dados
```
PORT=3000                # Porta do servidor backend
DB_USERNAME=usuario      # Usuário do banco de dados
DB_PASSWORD=senha        # Senha do banco de dados
DB_NAME=nome_do_banco    # Nome do banco de dados
DB_HOST=localhost        # Host do banco de dados
DB_PORT=5432             # Porta do banco de dados
DB_SSL=false             # Usar SSL (true/false)
DATABASE_URL=            # (Opcional) URL completa de conexão, substitui as variáveis acima se definido
```

### Recuperação de Senha (E-mail)
```
EMAIL_HOST=smtp.exemplo.com   # Servidor SMTP
EMAIL_PORT=587                # Porta SMTP
EMAIL_USER=usuario@exemplo.com # Usuário do e-mail
EMAIL_PASS=sua_senha           # Senha do e-mail
EMAIL_FROM="Nome <usuario@exemplo.com>" # Remetente padrão dos e-mails
```
