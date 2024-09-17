'use client';
import DashCard from '@/components/dashCard';
import DashFilters from '@/components/dashFilters';
import Header from '@/components/default/header';
import Logs from '@/components/logs';
import { ChartContainer } from '@/components/ui/chart';
import { useGet } from '@/hooks/useApi';
import { logsType } from '@/types/logs-type';
import { taskType } from '@/types/task-type';
import {
  AlarmClock,
  AlertCircle,
  FolderCheck,
  FolderOpen,
  Loader2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type dashType = {
  totalProjetos: number;
  projetosEmAndamento: number;
  projetosPendentes: number;
  projetosConcluidos: number;
  tarefasPorProjeto: taskType[];
  logsRecentes: logsType[];
};

export default function Dash() {
  const { loading, response, get } = useGet({
    url: `/api/projetos/dashboard`,
  });

  const [dashboardData, setDashboardData] = useState<dashType | null>(null);

  useEffect(() => {
    if (response) {
      setDashboardData(response as dashType);
    }
  }, [response]);

  const barChartData =
    dashboardData?.tarefasPorProjeto.flat().reduce((acc, task) => {
      const projectName = task.projeto.nome;

      const existingProject = acc.find(item => item.name === projectName);

      if (existingProject) {
        existingProject.quantidade += 1;
      } else {
        acc.push({ name: projectName, quantidade: 1 });
      }

      return acc;
    }, [] as { name: string; quantidade: number }[]) || [];

  const pieChartData = [
    { name: 'Em Andamento', value: dashboardData?.projetosEmAndamento },
    { name: 'Pendentes', value: dashboardData?.projetosPendentes },
    { name: 'Concluídos', value: dashboardData?.projetosConcluidos },
  ].filter(item => item.value || 0 > 0);

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center bg-cover bg-no-repeat`}
      style={{ backgroundImage: `url('/background.jpg')` }}
    >
      <Header />
      <main className="mt-16 flex w-10/12 flex-col gap-10 p-10 items-center relative bg-white rounded-3xl">
        {loading ? (
          <Loader2 className="animate-spin h-7 w-7 mt-10" />
        ) : dashboardData ? (
          <div className="w-full">
            <div className="flex flex-col items-center py-10 mb-10 gap-8">
              <div className="flex">
                <DashFilters
                  applyFilters={filters => {
                    get({ params: filters });
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                <DashCard
                  icon={<FolderOpen className="h-7 w-7 text-blue-500" />}
                  title="Total de Projetos"
                  number={dashboardData.totalProjetos}
                  color="bg-blue-500"
                />
                <DashCard
                  icon={<AlarmClock className="h-7 w-7 text-yellow-500" />}
                  title="Projetos em Andamento"
                  number={dashboardData.projetosEmAndamento}
                  color="bg-yellow-500"
                />
                <DashCard
                  icon={<AlertCircle className="h-7 w-7 text-red-500" />}
                  title="Projetos Pendentes"
                  number={dashboardData.projetosPendentes}
                  color="bg-red-500"
                />
                <DashCard
                  icon={<FolderCheck className="h-7 w-7 text-green-600" />}
                  title="Projetos Concluídos"
                  number={dashboardData.projetosConcluidos}
                  color="bg-green-600"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-10">
              <div className="p-8 border rounded-xl shadow-lg">
                <h2 className="text-lg font-semibold mb-3">
                  Gráfico de Tarefas por Projeto
                </h2>
                <ChartContainer config={{}} className="bg-white rounded-3xl">
                  <BarChart data={barChartData} width={600} height={300}>
                    <XAxis dataKey="name" />
                    <YAxis tickCount={1} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantidade" fill="#3b82f6" />
                  </BarChart>
                </ChartContainer>
              </div>

              <div className="p-8 border rounded-xl shadow-lg">
                <h2 className="text-lg font-semibold mb-3">
                  Distribuição dos Status dos Projetos
                </h2>
                <ChartContainer className="bg-white rounded-3xl" config={{}}>
                  <PieChart width={600} height={300}>
                    <Pie
                      data={pieChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={['#eab308', '#ef4444', '#16a34a'][index % 3]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ChartContainer>
              </div>
            </div>
            <Logs logs={dashboardData.logsRecentes} />
          </div>
        ) : (
          <p>Nenhum dado disponível.</p>
        )}
      </main>
    </div>
  );
}
