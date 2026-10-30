import React from 'react';
import { BookOpen, Plus, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenCreateModal: () => void;
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCreateModal, totalCount }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Study<span className="text-indigo-600">Flow</span>
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Sparkles className="w-3 h-3" /> MVP Iniciante
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Organize seus objetivos de estudo com foco, prazos e clareza.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-right hidden sm:block">
              <span className="text-xs text-slate-500 block">Total cadastrado</span>
              <span className="text-sm font-semibold text-slate-800">
                {totalCount} {totalCount === 1 ? 'meta' : 'metas'}
              </span>
            </div>

            <button
              type="button"
              onClick={onOpenCreateModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-all shadow-sm hover:shadow shadow-indigo-200 cursor-pointer w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Novo Objetivo</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
