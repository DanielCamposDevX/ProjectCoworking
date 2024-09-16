import { api } from '@/app/config/api';
import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export default function DataSelect({
  url,
  placeholder,
  setValue,
  setHolder,
  value,
}: {
  url: string;
  placeholder: string;
  setValue: (value: string | undefined) => void;
  setHolder?: (value: string | undefined) => void;
  value?: string;
}) {
  const [data, setData] = useState<{ id: number; nome: string }[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const [selectedName, setSelectedName] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params: { search?: string; userName?: string } = {};

        if (search) {
          params.search = search;
        }

        if (selectedName) {
          params.userName = selectedName;
        }

        const response = await api.get(url, { params });
        const newData = response.data;

        const userExists = newData.some(
          (user: { id: number }) => user.id === Number(selected),
        );
        if (!userExists && selected) {
          newData.push({ id: Number(selected), nome: selectedName });
        }

        setData(newData);
      } catch (error) {
        console.error('Failed to fetch:', error);
      }
    };

    const debounceFetch = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(debounceFetch);
  }, [search, selected, selectedName]);

  const handleSelect = (id: string) => {
    if (id === 'none') {
      setSelected(undefined);
      setSelectedName(undefined);
      setHolder && setHolder(undefined);
      setValue(undefined);
      setSearch('');
      setData([]);
      return;
    }
    const user = data.find(user => user.id === Number(id));
    if (user) {
      setSelectedName(user.nome);
      setHolder && setHolder(user.nome);
      setSelected(id);
      setValue(id);
    }
  };

  return (
    <Select value={selected || ''} onValueChange={handleSelect}>
      <SelectTrigger className="w-full border rounded-full py-7 px-3">
        <SelectValue placeholder={!selected ? placeholder : selectedName} />
      </SelectTrigger>
      <SelectContent>
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded-full py-2 px-3 w-full mb-2"
        />
        {value && <SelectItem value="none">Limpar</SelectItem>}
        {data.length > 0 ? (
          data.map(user => (
            <SelectItem key={user.id} value={user.id.toString()}>
              {user.nome}
            </SelectItem>
          ))
        ) : (
          <SelectItem value="e" disabled>
            Nenhum usuário encontrado
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
