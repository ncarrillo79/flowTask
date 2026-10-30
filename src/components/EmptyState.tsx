import React from 'react';
import { BookOpen, Plus, RotateCcw, SearchX } from 'lucide-react';

interface EmptyStateProps {
  isFiltering: boolean;
  onOpenCreate: () => void;
  onClearFilters?: () => void;
  onLoadSamples?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltering,
  onOpenCreate,
  onClearFilters,
  onLoadSamples,
}) => {
  if (isFiltering) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 sm:p-12 text-center max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 mx-auto flex items-center justify-center mb-3">
          <SearchX className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">
          Nenhum objetivo encontrado
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mb-5">
          Não localizamos nenhuma meta correspondente aos termos de busca ou filtros selecionados.
        </p>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer"
          >
            Limpar filtros e busca
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white to-indigo-50/30 rounded-2xl border border-dashed border-indigo-200 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs">
      <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 mx-auto flex items-center justify-center mb-4 shadow-xs">
        <BookOpen className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">
        Nenhum objetivo de estudo por aqui ainda!
      </h3>
      <p className="text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
        O primeiro passo para aprender algo novo é definir sua meta com clareza.
        Cadastre o que você quer estudar agora ou carregue exemplos para se inspirar.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-all shadow-sm hover:shadow shadow-indigo-200 cursor-pointer w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Cadastrar Meu Primeiro Objetivo
        </button>

        {onLoadSamples && (
          <button
            type="button"
            onClick={onLoadSamples}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer w-full sm:w-auto"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            Carregar exemplos práticos
          </button>
        )}
      </div>
    </div>
  );
};
