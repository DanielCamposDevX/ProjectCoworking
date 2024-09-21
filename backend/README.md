## Para rodar o projeto:

# Sem Docker:
Utilize o NPM para instalar as dependências: npm install ou npm i ;
Atualize o .env com suas variáveis de ambiente;
Após isso rode as migrations no seu banco: npx prisma migrate dev;
Para iniciar o projeto como dev utilize: npm run dev;
Para iniciar em produção: npm run build && npm start;

# Com Docker:
Na raiz do projeto digite o comando docker compose up --build -d para buildar a imagem do projeto e subir o container em segundo plano.



### Rotas:


# 1. Obter Usuários
Método: GET
Endpoint: /api/usuarios
Middleware: authUser, queryValidations(queryParamsSchema)
Controller: userControllers.getUsers
Descrição: Retorna uma lista de usuários.


# 2. Registrar Usuário
Método: POST
Endpoint: /api/auth/register
Middleware: validate(userSchema)
Controller: userControllers.createUser
Descrição: Cria um novo usuário.


# 3. Login do Usuário
Método: POST
Endpoint: /api/auth/login
Middleware: validate(loginSchema)
Controller: userControllers.loginUser
Descrição: Realiza o login de um usuário.


# 4. Obter Usuário Autenticado
Método: GET
Endpoint: /api/auth/me
Middleware: authUser
Controller: userControllers.getAuthUser
Descrição: Retorna os dados do usuário autenticado.
taskRouter


# 1. Obter Tarefas por Projeto
Método: GET
Endpoint: /api/projetos/:id/tarefas
Middleware: authUser, queryValidations(queryParamsSchema)
Controller: taskControllers.getTasks
Descrição: Retorna as tarefas de um projeto específico.


# 2. Gerar Tarefas
Método: GET
Endpoint: /api/projetos/:id/tarefas/generate
Middleware: authUser
Controller: taskControllers.generateTasks
Descrição: Gera novas tarefas para o projeto.


# 3. Criar Tarefa
Método: POST
Endpoint: /api/projetos/:id/tarefas
Middleware: authUser, validate(taskSchema)
Controller: taskControllers.createTask
Descrição: Cria uma nova tarefa para o projeto.


# 4. Atualizar Tarefa
Método: PUT
Endpoint: /api/projetos/tarefas/:id
Middleware: authUser, validate(taskSchema)
Controller: taskControllers.updateTask
Descrição: Atualiza os dados de uma tarefa existente.


# 5. Deletar Tarefa
Método: DELETE
Endpoint: /api/projetos/tarefas/:id
Middleware: authUser
Controller: taskControllers.deleteTask
Descrição: Deleta uma tarefa específica.
projectRouter

# 1. Obter Dashboard de Projetos
Método: GET
Endpoint: /api/projetos/dashboard
Middleware: authUser, queryValidations(queryParamsSchema)
Controller: projectControllers.getDashboard
Descrição: Retorna o dashboard de projetos.
# 2. Obter Projetos
Método: GET
Endpoint: /api/projetos
Middleware: authUser, queryValidations(queryParamsSchema)
Controller: projectControllers.getProjects
Descrição: Retorna uma lista de projetos.


# 3. Obter Projeto por ID
Método: GET
Endpoint: /api/projetos/:id
Middleware: authUser
Controller: projectControllers.getProjectById
Descrição: Retorna os detalhes de um projeto específico.


# 4. Criar Projeto
Método: POST
Endpoint: /api/projetos
Middleware: authUser, validate(projectSchema)
Controller: projectControllers.createProject
Descrição: Cria um novo projeto.


# 5. Upload de CSV
Método: POST
Endpoint: /api/projetos/many
Middleware: upload.single('file'), authUser
Controller: projectControllers.uploadCSV
Descrição: Faz upload de um arquivo CSV para criar múltiplos projetos.


# 6. Atualizar Projeto
Método: PUT
Endpoint: /api/projetos/:id
Middleware: authUser, validate(updateProjectSchema)
Controller: projectControllers.updateProject
Descrição: Atualiza os detalhes de um projeto existente.


# 7. Deletar Projeto
Método: DELETE
Endpoint: /api/projetos/:id
Middleware: authUser
Controller: projectControllers.deleteProject
Descrição: Deleta um projeto específico.


# 8. Obter Usuários do Projeto
Método: GET
Endpoint: /api/projetos/:id/usuarios
Middleware: authUser, queryValidations(queryParamsSchema)
Controller: projectControllers.getProjectUsers
Descrição: Retorna os usuários associados a um projeto.


# 9. Adicionar Usuário ao Projeto
Método: POST
Endpoint: /api/projetos/:id/usuarios
Middleware: authUser, validate(projectUserSchema)
Controller: projectControllers.postProjectUsers
Descrição: Adiciona um usuário a um projeto.


# 10. Deletar Usuário do Projeto
Método: DELETE
Endpoint: /api/projetos/:id/usuarios/:usuario_id
Middleware: authUser
Controller: projectControllers.deleteProjectUsers
Descrição: Remove um usuário de um projeto.
permissionRouter
Atualizar Permissão
Método: PUT
Endpoint: /api/permissions/:projectId/:userId
Middleware: authUser, validate(permissionSchema)
Controller: permissionControllers.updatePermission
Descrição: Atualiza as permissões de um usuário em um projeto.
commentRouter


# 1. Obter Comentários
Método: GET
Endpoint: /api/projetos/:id/comentarios
Middleware: authUser, queryValidations(queryParamsSchema)
Controller: commentControllers.getComments
Descrição: Retorna os comentários de um projeto específico.


# 2. Criar Comentário
Método: POST
Endpoint: /api/projetos/:id/comentarios
Middleware: authUser, validate(commentSchema)
Controller: commentControllers.createComment
Descrição: Adiciona um novo comentário a um projeto.


# 3. Atualizar Comentário
Método: PUT
Endpoint: /api/projetos/comentarios/:id
Middleware: authUser, validate(commentSchema)
Controller: commentControllers.updateComment
Descrição: Atualiza um comentário existente.


# 4. Deletar Comentário
Método: DELETE
Endpoint: /api/projetos/comentarios/:id
Middleware: authUser
Controller: commentControllers.deleteComment
Descrição: Remove um comentário específico.
