import { OpenAI } from 'openai';
import { completeprojectType } from 'types/project-type';

export const openai = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

export const generationPrompt = (project: completeprojectType) => {
   return `
         Baseando-se nas informações e descrição do projeto e nas funções de cada usuário, gere uma lista de tarefas. 
         Inclua também uma breve descrição de cada tarefa e para qual usuário ela deve ser atribuída.
         Se possível, gere também comentários que podem melhorar o projeto.

         Informações do projeto:
         - Nome: ${project.nome}
         - Descrição: ${project.descricao}

         Usuários:
         ${project.usuarios.map((usuario) => `-id:${usuario.id} cargo:${usuario.papel}`).join('\n')}

         Por favor, forneça as informações estritamente no formato JSON:
         {
            "tarefas": [
               {
                     "nome": "Nome da tarefa",
                     "descricao": "Descrição da tarefa",
                     "usuarioId": "ID do usuário"
               }
            ],
            "comentarios": [
               {
                     "texto": "Texto do comentário"
               }
            ]
         }
      `;
};
