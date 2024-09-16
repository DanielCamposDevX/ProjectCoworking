'use client';
import DashFilters from '@/components/dashFilters';
import Header from '@/components/default/header';
import { ChartContainer } from '@/components/ui/chart';
import { useGet } from '@/hooks/useApi';
import { logsType } from '@/types/logs-type';
import { taskType } from '@/types/task-type';
import { Loader2 } from 'lucide-react';
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
      <main className="mt-16 flex flex-1 flex-col gap-10 p-10 items-center relative">
        {loading ? (
          <Loader2 className="animate-spin h-7 w-7 mt-10" />
        ) : dashboardData ? (
          <div className="w-full max-w-4xl">
            <DashFilters
              applyFilters={filters => {
                get({ params: filters });
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <div className="p-4 bg-white shadow rounded-md">
                <h2>Total de Projetos</h2>
                <p className="text-lg font-semibold">
                  {dashboardData.totalProjetos}
                </p>
              </div>
              <div className="p-4 bg-white shadow rounded-md">
                <h2>Projetos em Andamento</h2>
                <p className="text-lg font-semibold">
                  {dashboardData.projetosEmAndamento}
                </p>
              </div>
              <div className="p-4 bg-white shadow rounded-md">
                <h2>Projetos Pendentes</h2>
                <p className="text-lg font-semibold">
                  {dashboardData.projetosPendentes}
                </p>
              </div>
              <div className="p-4 bg-white shadow rounded-md">
                <h2>Projetos Concluídos</h2>
                <p className="text-lg font-semibold">
                  {dashboardData.projetosConcluidos}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              <div>
                <h2 className="text-lg font-semibold mb-3">
                  Gráfico de Tarefas por Projeto
                </h2>
                <ChartContainer config={{}} className="bg-white rounded-3xl">
                  <BarChart data={barChartData} width={600} height={300}>
                    <XAxis dataKey="name" />
                    <YAxis tickCount={1} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantidade" fill="#8884d8" />
                  </BarChart>
                </ChartContainer>
              </div>

              <div>
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
                          fill={['#1e66c4', 'green', 'gray'][index % 3]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ChartContainer>
              </div>
            </div>

            <h2 className="text-lg font-semibold mb-3">Logs Recentes</h2>
            <ul className="bg-white shadow rounded-md p-4">
              {dashboardData.logsRecentes.length > 0 ? (
                dashboardData.logsRecentes.map((log, index) => (
                  <li key={index} className="border-b py-2">
                    {log.acao}
                  </li>
                ))
              ) : (
                <p>Nenhum log recente disponível.</p>
              )}
            </ul>
          </div>
        ) : (
          <p>Nenhum dado disponível.</p>
        )}
      </main>
    </div>
  );
}
