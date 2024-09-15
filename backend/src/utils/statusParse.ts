import { StatusProjeto } from '@prisma/client';

export function statusParser(status: string): StatusProjeto {
   switch (status) {
      case 'Pendente':
         return 'PENDENTE';
      case 'Em andamento':
         return 'EM_ANDAMENTO';
      case 'Concluído':
         return 'CONCLUIDO';
      default:
         return 'PENDENTE';
   }
}
