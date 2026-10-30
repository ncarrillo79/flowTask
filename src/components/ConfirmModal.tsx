import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { StudyObjective } from '../types/objective';

interface ConfirmModalProps {
  isOpen: boolean;
  objective: StudyObjective | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  objective,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !objective) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-desc"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 p-6 animate-in zoom-in-95 duration-150">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="flex-1">
            <h3 id="confirm-title" className="text-base font-bold text-slate-900">
              Excluir objetivo de estudo?
            </h3>
            <p id="confirm-desc" className="text-sm text-slate-600 mt-2 leading-relaxed">
              Você tem certeza de que deseja excluir o objetivo:{' '}
              <span className="font-semibold text-slate-800">
                "{objective.title}"
              </span>
              ?
            </p>
            <p className="text-xs text-rose-500 mt-2 font-medium">
              Esta ação não poderá ser desfeita.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
            aria-label="Cancelar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 transition-all shadow-xs cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Sim, excluir objetivo
          </button>
        </div>
      </div>
    </div>
  );
};
