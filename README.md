

<h1 align="center">Teste Backend para IPSolution</h1>

<p align="center">Com essa aplicação é possível manipular usuários e chats, adicionando conjuntos e interligando-se. Possui testes de Controllers onde acontece as principais saídas e entradas de dados. Escolhi uma arquitetura limpa, com pastas organizadas e aplicação facilmente escalável e de facil leitura.</p>

## Baixar o Projeto

- É necessário possuir ou instalar o [Docker](https://www.docker.com/)
- Dentro da pasta do projeto digite o comando no terminal:

```bash
$ npm install
```

## Compilar e rodar 

```bash
# Inicie o banco de dados PostgreSQL
$ npm run start:dev:db

# Inicie a aplicação
$ npm run start:dev
```
É possivel ver todos os dados do PostgreSQL no [localhost:8001](localhost:8001) com os containêrs do pgAdmin e do banco de dados já rodando com essas etapas:
- Abra **[localhost:8001](localhost:8001)** após usar o comando de inicialização do banco de dados (**npm run start:dev:db**)
- Coloque o Email **admin@admin.com** e a Senha **admin**
- Caso ainda não houver a visualização do banco de dados clique em **Adicionar Novo Servidor**
- Coloque o Nome **postgres** na aba GERAL
- Vá para aba CONEXÃO e insira:
  - Host name/adress: **postgresdb**
  - Username: **postgres**
  - Senha: **12345**
- Clique em **Salvar** e pronto! Todos os dados já estão disponíveis para visualização ;)

```bash
# Caso queira parar de executar o banco de dados
$ npm run stop:dev:db
```

## Realização de Testes

Realiza todas as requisições possíveis e funcionais

```bash
# Unit tests
$ npm run test

# Test coverage
$ npm run test:cov
```

## Manipulação da API e da Aplicação
Com o uso de [Insomnia](https://insomnia.rest/download) ou [Postman](https://www.postman.com/) para fazer requisições POST, GET, PUT e DELETE

```bash
# Para ver todos os Chats criados - GET
http://localhost:3000/chats/

# Para ver todos os Usuários criados - GET
http://localhost:3000/users/

# Para ver um Usuário específico - GET
http://localhost:3000/users/${id do usuário}

# Para ver um Chat específico - GET
http://localhost:3000/chats/${id do chat}

# Criar um novo Chat - POST
# Inserir um JSON { "title": "exemplo" }
http://localhost:3000/users/

# Criar um novo Usuário - POST
# Inserir um JSON { "name": "exemplo" }
http://localhost:3000/users/

# Adicionar um Usuário a um Chat - POST
http://localhost:3000/chats/${id da conversa}/users/${id do usuário}

# Editar um Usuário - PUT
# Inserir um JSON { "name": "exemplo1" }
http://localhost:3000/users/${id do usuário}

# Editar um Chat - PUT
# Inserir um JSON { "title": "exemplo1" }
http://localhost:3000/chats/${id do chat}

# Deletar um Chat - DELETE
http://localhost:3000/chats/${id do chat}

# Deletar um Usuário - DELETE
http://localhost:3000/users/${id do usuário}
```

## Tecnologias Utilizadas
- Nest.js
- Docker
- Git
- PostgreSQL
- Typescript
- Jest
- Node.js
