'use client';
import { User, UsersCommand } from '@/components/project-users-command';
import { api } from '@/config/api';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
  get?: () => void;
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

  function updatePermissions(
    userId: number,
    permission: string,
    value: boolean,
  ) {
    api
      .put(`/api/permissions/${project.id}/${userId}`, {
        [permission]: value,
      })
      .then(() => {
        toast.success('Permissão atualizada com sucesso');
        getProjectusers();
      })
      .catch(err => {
        toast.error(err.response.data || 'Erro ao atualizar permissão');
      });
  }

  function handleClose(arg: boolean) {
    if (!arg) {
      get && get();
    }
    setOpen(arg);
  }

  return (
    <Dialog onOpenChange={handleClose} open={open}>
      <DialogTrigger onClick={e => e.stopPropagation()}>
        <Button variant={'ghost'} className="p-2 rounded-full">
          <Link className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[700px] bg-white p-10"
        onClick={e => e.stopPropagation()}
      >
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
              <TableHead>Papel</TableHead>
              <TableHead>Criar</TableHead>
              <TableHead>Atualizar</TableHead>
              <TableHead>Deletar</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.nome}</TableCell>
                <TableCell>{user.papel}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={Boolean(user.permissions[0].create)}
                    onCheckedChange={value =>
                      updatePermissions(user.id, 'create', Boolean(value))
                    }
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={Boolean(user.permissions[0].update)}
                    onCheckedChange={value =>
                      updatePermissions(user.id, 'update', Boolean(value))
                    }
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={Boolean(user.permissions[0].delete)}
                    onCheckedChange={value =>
                      updatePermissions(user.id, 'delete', Boolean(value))
                    }
                  />
                </TableCell>

                <TableCell>
                  <Button
                    variant={'ghost'}
                    className="p-1 rounded-full "
                    onClick={e => {
                      e.stopPropagation();
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
            onClick={e => {
              e.stopPropagation();
              handleClose(false);
            }}
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
