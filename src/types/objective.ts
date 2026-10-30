export type ObjectiveStatus = 'nao_iniciado' | 'em_andamento' | 'concluido';

export interface StudyObjective {
  id: string;
  title: string;
  description: string;
  deadline: string; // Formato YYYY-MM-DD
  status: ObjectiveStatus;
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
}

export interface ObjectiveFormData {
  title: string;
  description: string;
  deadline: string;
  status: ObjectiveStatus;
}

export const STATUS_CONFIG: Record<
  ObjectiveStatus,
  {
    label: string;
    description: string;
    badgeClass: string;
    borderClass: string;
    bgLight: string;
  }
> = {
  nao_iniciado: {
    label: 'Não iniciado',
    description: 'Planejado para começar',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    borderClass: 'border-l-amber-500',
    bgLight: 'bg-amber-50/50',
  },
  em_andamento: {
    label: 'Em andamento',
    description: 'Estudo em progresso',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    borderClass: 'border-l-blue-500',
    bgLight: 'bg-blue-50/50',
  },
  concluido: {
    label: 'Concluído',
    description: 'Meta atingida!',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    borderClass: 'border-l-emerald-500',
    bgLight: 'bg-emerald-50/50',
  },
};
