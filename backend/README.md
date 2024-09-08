# **Backend**

O backend será responsável por fornecer uma API RESTful que permitirá a interação com os dados do sistema. A API terá endpoints para realizar operações CRUD (Create, Read, Update, Delete) em projetos e usuários além da autenticação do login e registro de usuários usando JWT.

# **Estrutura do Backend**

- Diretório backend: Contém o código do servidor.
- Container (opcional): Para facilitar a execução e o isolamento do ambiente.

## Observação

Solicitamos que façam o uso do Node JS em uma versão 18 ou superior

## Endpoints da API

Esperamos os seguintes endpoints da API para este primeiro projeto:

### **Projetos**

- **Listar projetos (GET):** `/api/projetos`

  - **Resposta de Sucesso (200):** Retorna um array com os projetos.

  ```json
  [
    {
      "id": 1,
      "nome": "Nome do Projeto",
      "descricao": "Descrição do Projeto",
      "data_inicio": "2024-01-01",
      "data_fim": "2024-12-31",
      "status": "Em andamento"
    }
  ]
  ```

  - **Resposta de Erro (404):** Retorna uma mensagem indicando que nenhum projeto foi encontrado.

- **Cadastrar Projeto (POST):** `/api/projetos`

  - **Corpo da Requisição:**

  ```json
  {
    "nome": "Nome do Projeto",
    "descricao": "Descrição do Projeto",
    "data_inicio": "2024-12-31",
    "status": "Em andamento"
  }
  ```

  - **Resposta de Sucesso (200):** Retorna o novo projeto criado.
  - **Resposta de Erro (400):** Retorna uma mensagem indicando que o corpo da requisição está incorreto.

- **Editar Projeto (PUT):** `/api/projetos/:id`

  - **Corpo da Requisição:**

  ```json
  {
    "nome": "Novo Nome do Projeto",
    "descricao": "Nova Descrição do Projeto",
    "data_inicio": "2024-01-01",
    "data_fim": "2024-12-31",
    "status": "Concluído"
  }
  ```

  - **Resposta de Sucesso (200):** Retorna o projeto atualizado.
  - **Resposta de Erro (400):** Retorna uma mensagem indicando que o corpo da requisição está incorreto.

- **Remover Projeto (DELETE):** `/api/projetos/:id`
  - **Resposta de Sucesso (204):** Confirma que o projeto foi removido com sucesso.
  - **Resposta de Erro (400):** Retorna uma mensagem indicando problemas na remoção.

### **Usuários em Projetos**

- **Listar usuários em um projeto (GET):** `/api/projetos/{projetoId}/usuarios`

  - **Resposta de Sucesso (200):** Retorna a lista de usuários vinculados ao projeto.

  ```json
  [
    {
      "id": 1,
      "nome": "Nome do Usuário",
      "email": "email@exemplo.com",
      "papel": "Desenvolvedor"
    }
  ]
  ```

  - **Resposta de Erro (404):** Retorna uma mensagem indicando que nenhum usuário foi encontrado para o projeto especificado..

- **Cadastrar Usuário em Projeto (POST):** `/api/projetos/{projetoId}/usuarios`

  - **Corpo da Requisição:**

  ```json
  {
    "usuario_id": 1
  }
  ```

  - **Resposta de Sucesso (201):** Retorna o usuário adicionado ao projeto.
  - **Resposta de Erro (400):** Retorna uma mensagem indicando que o corpo da requisição está incorreto.

- **Remover Usuário em Projeto (DELETE):** `/api/projetos/{projetoId}/usuarios/{usuarioId}`
  - **Resposta de Sucesso (204):** Confirma que o usuário foi removido do projeto com sucesso.
  - **Resposta de Erro (400):** Retorna uma mensagem indicando problemas na remoção.

### **Autenticação**

- **Registrar novo usuário (POST):** `/api/auth/register`

  - **Corpo da Requisição:**

  ```json
  {
    "nome": "Nome do Usuário",
    "email": "email@exemplo.com",
    "senha": "senha123",
    "papel": "Desenvolvedor"
  }
  ```

  - **Resposta de Sucesso (201):** Usuário criado com sucesso:

  ```json
  {
    "id": 1,
    "nome": "Nome do Usuário",
    "email": "email@exemplo.com",
    "papel": "Desenvolvedor",
    "token": "jwt_token"
  }
  ```

  - **Resposta de Erro (400):** Dados inválidos ou usuário já existente.

- **Realizar login de usuário (POST): ** `/api/auth/login`

  - **Resposta de Sucesso (201):** Retorna um token JWT válido:
  - **Resposta de Erro (400):** Credenciais inválidas.

- **Retornar dados do usuário autenticado (GET):** `/api/auth/me`

  - **Resposta de Sucesso (201):** Retorna os dados do usuário autenticado:
  - **Resposta de Erro (400):** Token inválido ou não fornecido.
