import React from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Edit3,
  PlayCircle,
  Trash2,
} from 'lucide-react';
import { ObjectiveStatus, STATUS_CONFIG, StudyObjective } from '../types/objective';
import { formatDateBr, getDeadlineInfo } from '../utils/dateUtils';

interface ObjectiveCardProps {
  objective: StudyObjective;
  onEdit: (objective: StudyObjective) => void;
  onDeleteRequest: (objective: StudyObjective) => void;
  onQuickStatusChange: (id: string, newStatus: ObjectiveStatus) => void;
}

export const ObjectiveCard: React.FC<ObjectiveCardProps> = ({
  objective,
  onEdit,
  onDeleteRequest,
  onQuickStatusChange,
}) => {
  const statusConfig = STATUS_CONFIG[objective.status];
  const deadlineInfo = getDeadlineInfo(objective.deadline);

  const getStatusIcon = (status: ObjectiveStatus) => {
    switch (status) {
      case 'concluido':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'em_andamento':
        return <PlayCircle className="w-3.5 h-3.5 text-blue-600" />;
      case 'nao_iniciado':
      default:
        return <Clock className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  return (
    <article
      className={`bg-white rounded-xl border border-slate-200 border-l-4 ${statusConfig.borderClass} p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group`}
    >
      <div>
        {/* Cabeçalho do Cartão: Status e Ações */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.badgeClass}`}
            >
              {getStatusIcon(objective.status)}
              {statusConfig.label}
            </span>

            {/* Aviso se o prazo estiver vencido e a tarefa não foi concluída */}
            {deadlineInfo.isOverdue && objective.status !== 'concluido' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                <AlertCircle className="w-3 h-3" />
                Atrasado
              </span>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center gap-1 opacity-90 sm:opacity-75 sm:group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => onEdit(objective)}
              title="Editar objetivo"
              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
              aria-label={`Editar ${objective.title}`}
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDeleteRequest(objective)}
              title="Excluir objetivo"
              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              aria-label={`Excluir ${objective.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Título do Objetivo */}
        <h3
          className={`text-base sm:text-lg font-semibold text-slate-900 tracking-tight mb-2 line-clamp-2 ${
            objective.status === 'concluido' ? 'line-through text-slate-500' : ''
          }`}
        >
          {objective.title}
        </h3>

        {/* Descrição */}
        {objective.description ? (
          <p className="text-xs sm:text-sm text-slate-600 whitespace-pre-line leading-relaxed mb-4 line-clamp-3">
            {objective.description}
          </p>
        ) : (
          <p className="text-xs text-slate-400 italic mb-4">Sem descrição detalhada.</p>
        )}
      </div>

      {/* Rodapé do Cartão: Prazo e Ação Rápida de Status */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Informação de Prazo */}
        <div className="flex items-center gap-1.5 text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-medium text-slate-700">
            {formatDateBr(objective.deadline)}
          </span>
          {objective.deadline && (
            <span className="text-[11px] text-slate-400">
              ({deadlineInfo.label})
            </span>
          )}
        </div>

        {/* Seletor rápido de Status */}
        <div className="flex items-center gap-1">
          <label htmlFor={`status-select-${objective.id}`} className="sr-only">
            Alterar status de {objective.title}
          </label>
          <select
            id={`status-select-${objective.id}`}
            value={objective.status}
            onChange={(e) =>
              onQuickStatusChange(objective.id, e.target.value as ObjectiveStatus)
            }
            className="text-[11px] bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md px-2 py-1 text-slate-700 font-medium focus:outline-none focus:border-indigo-400 cursor-pointer transition-colors"
          >
            <option value="nao_iniciado">Mudar p/ Não iniciado</option>
            <option value="em_andamento">Mudar p/ Em andamento</option>
            <option value="concluido">Mudar p/ Concluído</option>
          </select>
        </div>
      </div>
    </article>
  );
};
