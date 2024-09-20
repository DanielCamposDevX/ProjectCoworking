## Coworking gestor de projetos.

O Gestor Coworking tem como foco ajudar no processo de organização e visualização de um projeto, podendo ser criadas tarefas e comentários em cada projeto. O Coworking conta também com um sistema robusto de notificações em tempo real tanto por e-mail quanto na própria plataforma para facilitar o gerencimento do projeto e se manter atualizado. Todo sistema é pensado para ser o mais simples prático e performático e para que você possa gerir seu projeto sem dores de cabeça.




## Para rodar o projeto:

# Sem Docker:
Utilize o NPM para instalar as dependências: npm install ou npm i ;
Atualize o .env com suas variáveis de ambiente
Para iniciar o projeto como dev utilize: npm run dev;
Para iniciar em produção: npm run build && npm start;

# Com Docker:
Na raiz do projeto digite o comando docker compose up --build -d para buildar a imagem do projeto e subir o container em segundo plano.


## Tecnologias:
NextJS(framework react),
TailwindCSS(rodar o CSS de uma forma mais direta no código)
RadixUI(Lib para facilitar a criação da UI),
ReactHookForm(Otimização de formulários para evitar uso excessivo de states e re-renderizações desnecessárias),
Zod e ZodResolver(Para fazer a criação dos schemas e integra-los com o formulário do hookForm),
lucide(biblioteca de ícones),
framer(Biblioteca para criar animações),
Tanstack query(Biblioteca para otimizar a utilização de cache para entregar uma experiência mais fluida)
Eslint e Prettier(Formatador de código com intuito de manter padrões e clean coding)




