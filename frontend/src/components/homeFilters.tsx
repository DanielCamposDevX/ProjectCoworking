'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { paramsType } from '@/types/params-type';
import moment from 'moment';
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

export default function HomeFilters({
  applyFilters,
}: {
  applyFilters: (filters: paramsType) => void;
}) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<paramsType>({
    userId: undefined,
    status: undefined,
    data_inicio: undefined,
    data_fim: undefined,
  });

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

    setFilters({
      userId: userId ? Number(userId) : undefined,
      status: status as paramsType['status'],
      data_inicio: data_inicio
        ? moment(data_inicio).startOf('day').toISOString()
        : undefined,
      data_fim: data_fim
        ? moment(data_fim).endOf('day').toISOString()
        : undefined,
    });
  }, [searchParams]);

  const handleFilterChange = (key: string, value: string | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.set(key, value as string);
      }
    });

    router.push(`?${queryParams.toString()}`, undefined);
    applyFilters(filters);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 text-base px-8 py-6 rounded-full bg-white">
          Filtros
        </Button>
      </DialogTrigger>
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
              placeholder="Pesquisar usuários..."
              url="/api/usuarios"
              setValue={value => {
                handleFilterChange('userId', value);
              }}
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <Select
              value={filters.status || ''}
              onValueChange={value =>
                value === 'none'
                  ? handleFilterChange('status', undefined)
                  : handleFilterChange('status', value)
              }
            >
              <SelectTrigger className="w-full border rounded-full py-7 px-3">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent className="w-full bg-white">
                <SelectItem value="none">Selecione o status</SelectItem>
                <SelectItem value="PENDENTE">Pendente</SelectItem>
                <SelectItem value="EM_ANDAMENTO">Em andamento</SelectItem>
                <SelectItem value="CONCLUIDO">Concluído</SelectItem>
              </SelectContent>
            </Select>
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
                  moment(e.target.value).toISOString(),
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
                  moment(e.target.value).toISOString(),
                )
              }
            />
          </div>

          <DialogFooter className="flex justify-center items-center gap-2 w-full">
            <Button
              className=" z-50 bg-white border text-base px-12 py-6 rounded-full mt-4"
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
