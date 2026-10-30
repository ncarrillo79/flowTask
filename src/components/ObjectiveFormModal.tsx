import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, Clock, PlayCircle, X } from 'lucide-react';
import { ObjectiveFormData, ObjectiveStatus, StudyObjective } from '../types/objective';

interface ObjectiveFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ObjectiveFormData) => void;
  initialData?: StudyObjective | null;
}

export const ObjectiveFormModal: React.FC<ObjectiveFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<ObjectiveStatus>('nao_iniciado');
  const [errors, setErrors] = useState<{ title?: string }>({});

  const isEditing = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setDeadline(initialData.deadline || '');
      setStatus(initialData.status);
    } else {
      // Valores padrão para novo objetivo
      setTitle('');
      setDescription('');
      // Sugere por padrão uma data para daqui a 3 dias
      const defaultDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      setDeadline(defaultDate);
      setStatus('nao_iniciado');
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrors({ title: 'Por favor, informe o título do seu objetivo de estudo.' });
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      deadline: deadline || new Date().toISOString().split('T')[0],
      status,
    });
  };

  const setShortcutDate = (daysAhead: number) => {
    const target = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);
    setDeadline(target.toISOString().split('T')[0]);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-150">
        {/* Cabeçalho do Modal */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 id="modal-title" className="text-lg font-bold text-slate-900">
              {isEditing ? 'Editar Objetivo de Estudo' : 'Novo Objetivo de Estudo'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing
                ? 'Atualize os dados e o andamento da sua meta'
                : 'Defina o que você quer aprender e estabeleça um prazo'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Campo Título */}
          <div>
            <label
              htmlFor="objective-title"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Título do Objetivo <span className="text-rose-500">*</span>
            </label>
            <input
              id="objective-title"
              type="text"
              autoFocus
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({});
              }}
              placeholder="Ex.: Ler 2 capítulos de História do Brasil"
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                errors.title
                  ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              } focus:outline-none focus:ring-3 text-slate-800 placeholder:text-slate-400 transition-all`}
            />
            {errors.title && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.title}</p>
            )}
          </div>

          {/* Campo Descrição */}
          <div>
            <label
              htmlFor="objective-description"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Descrição ou Orientações{' '}
              <span className="text-slate-400 font-normal normal-case">(opcional)</span>
            </label>
            <textarea
              id="objective-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex.: Fazer anotações no caderno, resolver exercícios do final da página 45 e tirar dúvidas com o monitor."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-3 focus:ring-indigo-100 text-slate-800 placeholder:text-slate-400 transition-all resize-y"
            />
          </div>

          {/* Campo Prazo */}
          <div>
            <label
              htmlFor="objective-deadline"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Prazo de Conclusão
            </label>
            <div className="relative">
              <input
                id="objective-deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-3 focus:ring-indigo-100 text-slate-800 transition-all cursor-pointer"
              />
            </div>
            {/* Atalhos rápidos de prazo para facilitar */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap text-xs text-slate-500">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Sugestões:
              </span>
              <button
                type="button"
                onClick={() => setShortcutDate(0)}
                className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-colors cursor-pointer"
              >
                Hoje
              </button>
              <button
                type="button"
                onClick={() => setShortcutDate(1)}
                className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-colors cursor-pointer"
              >
                Amanhã
              </button>
              <button
                type="button"
                onClick={() => setShortcutDate(3)}
                className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-colors cursor-pointer"
              >
                Em 3 dias
              </button>
              <button
                type="button"
                onClick={() => setShortcutDate(7)}
                className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-colors cursor-pointer"
              >
                Em 1 semana
              </button>
            </div>
          </div>

          {/* Campo Status */}
          <div>
            <span className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Status Atual
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('nao_iniciado')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  status === 'nao_iniciado'
                    ? 'border-amber-500 bg-amber-50/70 text-amber-900 ring-2 ring-amber-400 font-semibold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="text-xs">Não iniciado</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('em_andamento')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  status === 'em_andamento'
                    ? 'border-blue-500 bg-blue-50/70 text-blue-900 ring-2 ring-blue-400 font-semibold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <PlayCircle className="w-4 h-4 text-blue-600" />
                <span className="text-xs">Em andamento</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('concluido')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  status === 'concluido'
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 ring-2 ring-emerald-400 font-semibold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs">Concluído</span>
              </button>
            </div>
          </div>

          {/* Rodapé do Modal */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-all shadow-sm hover:shadow shadow-indigo-200 cursor-pointer"
            >
              {isEditing ? 'Salvar Alterações' : 'Cadastrar Objetivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
