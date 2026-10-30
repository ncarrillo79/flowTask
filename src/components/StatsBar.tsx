import React from 'react';
import { CheckCircle2, Clock, ListTodo, PlayCircle } from 'lucide-react';
import { StudyObjective } from '../types/objective';

interface StatsBarProps {
  objectives: StudyObjective[];
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  objectives,
  selectedFilter,
  onSelectFilter,
}) => {
  const total = objectives.length;
  const pending = objectives.filter((o) => o.status === 'nao_iniciado').length;
  const inProgress = objectives.filter((o) => o.status === 'em_andamento').length;
  const completed = objectives.filter((o) => o.status === 'concluido').length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    {
      id: 'todos',
      label: 'Total de Objetivos',
      value: total,
      subtext: total === 1 ? '1 meta cadastrada' : `${total} metas cadastradas`,
      icon: ListTodo,
      color: 'text-slate-700',
      bgColor: 'bg-slate-100',
      borderColor: 'border-slate-200',
      activeBorder: 'ring-2 ring-indigo-500 border-indigo-500',
    },
    {
      id: 'nao_iniciado',
      label: 'Não Iniciados',
      value: pending,
      subtext: 'Aguardando início',
      icon: Clock,
      color: 'text-amber-700',
      bgColor: 'bg-amber-100',
      borderColor: 'border-amber-200',
      activeBorder: 'ring-2 ring-amber-500 border-amber-500',
    },
    {
      id: 'em_andamento',
      label: 'Em Andamento',
      value: inProgress,
      subtext: 'Em foco agora',
      icon: PlayCircle,
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-200',
      activeBorder: 'ring-2 ring-blue-500 border-blue-500',
    },
    {
      id: 'concluido',
      label: 'Concluídos',
      value: completed,
      subtext: `${completionRate}% de aproveitamento`,
      icon: CheckCircle2,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-100',
      borderColor: 'border-emerald-200',
      activeBorder: 'ring-2 ring-emerald-500 border-emerald-500',
    },
  ];

  return (
    <section aria-label="Estatísticas dos objetivos" className="space-y-3">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedFilter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectFilter(item.id)}
              className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-200 bg-white hover:shadow-xs cursor-pointer ${
                isSelected
                  ? `${item.activeBorder} shadow-xs`
                  : `${item.borderColor} hover:border-slate-300`
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500 truncate">
                  {item.label}
                </span>
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${item.bgColor} ${item.color} flex items-center justify-center shrink-0`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {item.value}
                </span>
              </div>
              <span className="text-xs text-slate-500 mt-1 block truncate">
                {item.subtext}
              </span>
            </button>
          );
        })}
      </div>

      {total > 0 && (
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="font-semibold text-slate-800">Progresso geral:</span>
            <span>
              {completed} de {total} metas concluídas
            </span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-64">
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <span className="font-medium text-slate-700 w-10 text-right">
              {completionRate}%
            </span>
          </div>
        </div>
      )}
    </section>
  );
};
