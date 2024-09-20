'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { paramsType } from '@/types/params-type';
import moment from 'moment';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import DataSelect from './dataSelect';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

export default function DashFilters({
  applyFilters,
}: {
  applyFilters: (filters: Partial<paramsType>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<Partial<paramsType>>({});
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const userId =
      searchParams.get('userId') !== 'none'
        ? searchParams.get('userId')
        : undefined;
    const status = searchParams.get('status') || undefined;
    const data_inicio = searchParams.get('data_inicio') || undefined;
    const data_fim = searchParams.get('data_fim') || undefined;

    const newFilters = {
      userId: userId ? Number(userId) : undefined,
      status: status as paramsType['status'],
      data_inicio: data_inicio
        ? moment(data_inicio).startOf('day').toISOString()
        : undefined,
      data_fim: data_fim
        ? moment(data_fim).endOf('day').toISOString()
        : undefined,
      userNome: searchParams.get('userNome') || undefined,
    };

    setFilters(newFilters);
    applyFilters({
      userId: newFilters.userId,
      status: newFilters.status,
      data_inicio: newFilters.data_inicio,
      data_fim: newFilters.data_fim,
    });
  }, [searchParams]);

  const handleFilterChange = (key: keyof paramsType, value: unknown) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (value === undefined || value === null) {
        delete newFilters[key];
      } else {
        newFilters[key] = value as never;
      }
      return newFilters;
    });
  };

  const handleApplyFilters = () => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.set(key, value as string);
      }
    });

    router.push(`?${queryParams.toString()}`, undefined);
    applyFilters({
      userId: filters.userId,
      status: filters.status,
      data_inicio: filters.data_inicio,
      data_fim: filters.data_fim,
    });
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 text-base px-8 py-6 rounded-full bg-white mb-4">
          Filtros
        </Button>
      </DialogTrigger>
      <Link href="/home">
        <Button
          className="gap-2 text-base px-8 py-6 rounded-full bg-white border ml-4 mb-4"
          variant={'secondary'}
        >
          Meus projetos
        </Button>
      </Link>

      <DialogContent className="sm:max-w-[425px] bg-white p-10">
        <DialogHeader>
          <DialogTitle>Filtros de Pesquisa</DialogTitle>
          <DialogDescription>
            Utilize os filtros abaixo para refinar sua pesquisa.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4">
          <div>
            <label
              htmlFor="user"
              className="block text-sm font-medium text-gray-700"
            >
              Usuário
            </label>
            <DataSelect
              placeholder={filters.userNome || 'Pesquisar usuários...'}
              url="/api/usuarios"
              setValue={value => handleFilterChange('userId', value)}
              setHolder={value => setFilters({ ...filters, userNome: value })}
              value={filters.userId?.toString()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Data de Início
            </label>
            <Input
              type="date"
              value={
                filters.data_inicio
                  ? moment(filters.data_inicio).format('YYYY-MM-DD')
                  : ''
              }
              onChange={e =>
                handleFilterChange(
                  'data_inicio',
                  moment(e.target.value).startOf('day').toISOString(),
                )
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Data de Fim
            </label>
            <Input
              type="date"
              value={
                filters.data_fim
                  ? moment(filters.data_fim).format('YYYY-MM-DD')
                  : ''
              }
              onChange={e =>
                handleFilterChange(
                  'data_fim',
                  moment(e.target.value).endOf('day').toISOString(),
                )
              }
            />
          </div>

          <DialogFooter className="flex justify-center items-center gap-2 w-full">
            <Button
              className="z-50 bg-white border text-base px-12 py-6 rounded-full mt-4"
              variant={'secondary'}
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              className="z-50 text-white text-base px-8 py-6 rounded-full mt-4"
              variant={'default'}
              onClick={handleApplyFilters}
            >
              Aplicar Filtros
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
