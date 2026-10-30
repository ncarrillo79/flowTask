/**
 * Utilitários para formatação e cálculo de datas em pt-BR
 */

export function formatDateBr(dateString: string): string {
  if (!dateString) return 'Sem prazo definido';
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    if (!year || !month || !day) return dateString;
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function getDeadlineInfo(dateString: string): {
  label: string;
  isOverdue: boolean;
  isToday: boolean;
  daysRemaining: number;
} {
  if (!dateString) {
    return { label: 'Sem data', isOverdue: false, isToday: false, daysRemaining: 0 };
  }

  const [year, month, day] = dateString.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  targetDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const daysAgo = Math.abs(diffDays);
    return {
      label: daysAgo === 1 ? 'Venceu ontem' : `Atrasado há ${daysAgo} dias`,
      isOverdue: true,
      isToday: false,
      daysRemaining: diffDays,
    };
  }

  if (diffDays === 0) {
    return {
      label: 'Vence hoje!',
      isOverdue: false,
      isToday: true,
      daysRemaining: 0,
    };
  }

  if (diffDays === 1) {
    return {
      label: 'Vence amanhã',
      isOverdue: false,
      isToday: false,
      daysRemaining: 1,
    };
  }

  return {
    label: `${diffDays} dias restantes`,
    isOverdue: false,
    isToday: false,
    daysRemaining: diffDays,
  };
}
