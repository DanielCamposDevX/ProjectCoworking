import { completeprojectType } from '@/types/project-type';
import { BellDot } from 'lucide-react';
import moment from 'moment';

export default function Logs({ project }: { project: completeprojectType }) {
  return (
    <div>
      <h2 className="text-xl font-semibold  flex items-center gap-3 mt-20 mb-6">
        <BellDot className="h-6 w-6 text-blue-600" />
        Notificações:
      </h2>
      {project.Logs?.map(log => (
        <div
          key={log.id}
          className="flex flex-col gap-2 py-4 px-3 border rounded-lg mb-4 shadow-md"
        >
          <span className="text-base font-medium">{log.acao}</span>
          <div className="flex gap-2 items-center justify-end w-full">
            <span className="text-xs text-gray-500 font-semibold">
              {moment(log.data).format('HH:mm')}
            </span>
            <span className="text-xs text-gray-500 font-semibold">
              {moment(log.data).format('DD/MM/YY')}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
