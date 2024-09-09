'use client';
import { api } from '@/app/config/api';
import { User, UsersCommand } from '@/components/project-users-command';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { projectType } from '@/types/project-type';

import { Link, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type linkProjectUserFormData = {
  users: User[];
  total: number;
};

export default function LinkProjectUserForm({
  project,
  get,
}: {
  project: projectType;
  get: () => void;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      getProjectusers();
    }
  }, [open]);

  function getProjectusers() {
    api
      .get(`/api/projetos/${project.id}/usuarios`)
      .then(response => {
        setUsers((response.data as linkProjectUserFormData).users);
      })
      .catch(err => {
        toast.error(err.response.data || 'Erro ao buscar usuários');
      });
  }

  function deleteProjectUser(userId: number) {
    api
      .delete(`/api/projetos/${project.id}/usuarios/${userId}`)
      .then(() => {
        getProjectusers();
        toast.success('Usuário removido com sucesso');
      })
      .catch(err => {
        toast.error(err.response.data || 'Erro ao remover usuário');
      });
  }

  function handleClose(arg: boolean) {
    if (!arg) {
      get();
    }
    setOpen(arg);
  }

  return (
    <Dialog onOpenChange={handleClose} open={open}>
      <DialogTrigger>
        <Button variant={'ghost'} className="p-2 rounded-full">
          <Link className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-white p-10">
        <DialogHeader>
          <DialogTitle>Usuários em : {project.nome}</DialogTitle>
          <DialogDescription>
            {users.length === 0 && 'Nenhum usuário vinculado a este projeto'}
          </DialogDescription>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="hidden lg:flex">Email</TableHead>
              <TableHead>Papel</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.nome}</TableCell>
                <TableCell className="hidden lg:flex">{user.email}</TableCell>
                <TableCell>{user.papel}</TableCell>
                <TableCell>
                  <Button
                    variant={'ghost'}
                    className="p-1 rounded-full "
                    onClick={() => {
                      deleteProjectUser(user.id);
                    }}
                  >
                    <Trash2 className="text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <DialogFooter className="flex justify-center items-center gap-2 w-full">
          <Button
            className=" z-50 border text-base px-8 py-6 rounded-full mt-4 "
            variant={'secondary'}
            onClick={() => handleClose(false)}
          >
            Cancelar
          </Button>
          <UsersCommand
            get={getProjectusers}
            project={project}
            projectUsers={users}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
