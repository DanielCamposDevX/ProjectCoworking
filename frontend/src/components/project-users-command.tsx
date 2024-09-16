'use client';
import { api } from '@/app/config/api';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
} from '@/components/ui/command';
import { projectType } from '@/types/project-type';
import { ChevronDown, ChevronUp, PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from './ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

export type User = {
  id: number;
  nome: string;
  email: string;
  papel: string;
};

export function UsersCommand({
  project,
  projectUsers,
  get,
}: {
  project: projectType;
  projectUsers: User[];
  get: () => void;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/usuarios');
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (userId: number) => {
    api
      .post(`/api/projetos/${project.id}/usuarios`, { usuario_id: userId })
      .then(() => {
        get();
        toast.success('Usuário adicionado ao projeto');
        setOpen(false);
      })
      .catch(err => {
        toast.error(
          err.response.data || 'Erro ao adicionar usuário ao projeto',
        );
      });
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (debounceTimeout) clearTimeout(debounceTimeout);

    const timeout = setTimeout(() => {
      fetchUsersBySearch(value);
    }, 300);

    setDebounceTimeout(timeout);
  };

  const fetchUsersBySearch = async (query: string) => {
    if (!query) {
      const response = await api.get('/api/usuarios');
      setUsers(response.data);
      return;
    }

    try {
      const response = await api.get(`/api/usuarios?search=${query}`);
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  return (
    <div>
      <Button
        onClick={e => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className=" z-50 text-white text-base px-8 py-6 rounded-full mt-4"
      >
        Adicionar {open ? <ChevronUp /> : <ChevronDown />}
      </Button>
      {open && (
        <Command className="rounded-lg border shadow-md md:min-w-[450px] max-w-full h-52 lg:h-min  absolute z-50 top-200 left-0 lg:left-2/3 ">
          <CommandInput
            placeholder="Pesquisar"
            value={search}
            onChangeCapture={e => handleSearchChange(e.currentTarget.value)}
          />
          <CommandList>
            {loading ? (
              <CommandEmpty>Loading...</CommandEmpty>
            ) : users.length === 0 ? (
              <CommandEmpty>Nenhum usuário encontrado</CommandEmpty>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead className="hidden lg:flex lg:justify-end lg:items-end">
                      Email
                    </TableHead>
                    <TableHead>Papel</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.nome}</TableCell>
                      <TableCell className="hidden lg:flex lg:justify-end lg:items-end">
                        {user.email}
                      </TableCell>
                      <TableCell>{user.papel}</TableCell>
                      <TableCell>
                        {!projectUsers.some(
                          projectUser => projectUser.id === user.id,
                        ) && (
                          <Button
                            variant={'ghost'}
                            className="p-1 rounded-full"
                            onClick={e => {
                              e.stopPropagation();
                              handleUserClick(user.id);
                            }}
                          >
                            <PlusCircle />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CommandList>
        </Command>
      )}
    </div>
  );
}
