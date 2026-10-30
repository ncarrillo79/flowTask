import React from 'react';
import { ArrowUpDown, Search, X } from 'lucide-react';
import { ObjectiveStatus } from '../types/objective';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  sortBy: 'prazo' | 'recentes' | 'titulo';
  onSortChange: (sort: 'prazo' | 'recentes' | 'titulo') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
}) => {
  const tabs: { id: string; label: string }[] = [
    { id: 'todos', label: 'Todos' },
    { id: 'nao_iniciado', label: 'Não iniciados' },
    { id: 'em_andamento', label: 'Em andamento' },
    { id: 'concluido', label: 'Concluídos' },
  ];

  return (
    <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Barra de busca */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Pesquisar objetivo por título ou descrição..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-9 py-2 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-lg border border-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
              title="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Ordenação */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            Ordenar:
          </span>
          <select
            value={sortBy}
            onChange={(e) =>
              onSortChange(e.target.value as 'prazo' | 'recentes' | 'titulo')
            }
            className="text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="prazo">Prazo (mais urgente)</option>
            <option value="recentes">Mais recentes</option>
            <option value="titulo">Título (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Abas de filtro rápido por status */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none border-t border-slate-100 pt-3">
        <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Filtrar:</span>
        {tabs.map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onStatusFilterChange(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
