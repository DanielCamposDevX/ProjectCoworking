export type commentType = {
  id: number;
  texto: string;
  usuarioId: number;
  usuario: {
    nome: string;
    id: number;
  };
  projetoId: number;
  data: Date;
};
