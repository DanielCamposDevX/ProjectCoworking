import { prisma } from '../config/database';
import { transporter } from '../config/mail';

export async function sendNotificationMail({
   projectId,
   text,
}: {
   projectId: number;
   text: string;
}) {
   const project = await prisma.projeto.findUnique({
      where: {
         id: projectId,
      },
      include: {
         usuarios: {
            select: {
               email: true,
            },
         },
      },
   });
   project.usuarios.forEach((user) => {
      transporter.sendMail({
         from: 'Coworking <daniel.campos.dev3@gmail.com>',
         to: user.email,
         subject: 'Nova notificação',
         text,
         html: `
      <h1>Nova notificação no sistema</h1>
      <p>${text}</p>
    `,
      });
   });
}
