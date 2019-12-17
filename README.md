Desafio node.js Concrete
Crie um aplicativo backend que exporá uma API RESTful de criação de sing up/sign in.

Instalação do projeto
npm install

Execução do projeto
npm start

Sobre desenvolvimento
Para utilização de Task Runner, optei pelo NPM SCRIPTS

o banco de dados que estou utilizando é o Postgres

O projeto também possui testes de integração

Routes

POST /auth/signup - Cadastro de usuários
Cadastra novos usuários na aplicação

GET /users/:id - Busca de usuário
Recupera um determinado usuário pelo ID

POST /auth/signin - Autenticação
Autentica um usuário na aplicação



Getting Started
# Clone o repositório:

git clone https://github.com/luizardovino/DesafioNode.git

# Criando a tabela de usuário pelo migration
\node_modules\.bin>knex migrate:latest --env test

# Rollback no migrations
\node_modules\.bin>knex migrate:rollback --env test


# Instale as dependencias:

npm install

Inicie o servidor:

# Iniciando o servidor
npm start


Testes:
# Rodando os testes de integração

npm run secure-mode
