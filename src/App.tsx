/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Check, Info, Plus } from 'lucide-react';
import { ConfirmModal } from './components/ConfirmModal';
import { EmptyState } from './components/EmptyState';
import { FilterBar } from './components/FilterBar';
import { Header } from './components/Header';
import { ObjectiveCard } from './components/ObjectiveCard';
import { ObjectiveFormModal } from './components/ObjectiveFormModal';
import { StatsBar } from './components/StatsBar';
import { storageService } from './services/storageService';
import { ObjectiveFormData, ObjectiveStatus, StudyObjective } from './types/objective';

export default function App() {
  const [objectives, setObjectives] = useState<StudyObjective[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Estados de Modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<StudyObjective | null>(null);
  const [deletingObjective, setDeletingObjective] = useState<StudyObjective | null>(null);

  // Estados de Filtros e Busca
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<'prazo' | 'recentes' | 'titulo'>('prazo');

  // Notificação Toast para feedback amigável ao estudante
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Carrega os objetivos persistidos no localStorage na inicialização
  useEffect(() => {
    const data = storageService.getAll();
    setObjectives(data);
    setIsLoaded(true);
  }, []);

  // Abrir modal de criação
  const handleOpenCreateModal = () => {
    setEditingObjective(null);
    setIsFormModalOpen(true);
  };

  // Abrir modal de edição com o objetivo selecionado
  const handleOpenEditModal = (objective: StudyObjective) => {
    setEditingObjective(objective);
    setIsFormModalOpen(true);
  };

  // Submissão do formulário (Criação ou Edição)
  const handleFormSubmit = (formData: ObjectiveFormData) => {
    if (editingObjective) {
      // Atualização
      const updated = storageService.update(editingObjective.id, formData);
      if (updated) {
        setObjectives((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
        showToast('Objetivo atualizado com sucesso!');
      }
    } else {
      // Novo cadastro
      const created = storageService.create(formData);
      setObjectives((prev) => [created, ...prev]);
      showToast('Objetivo de estudo cadastrado com sucesso!');
    }
    setIsFormModalOpen(false);
    setEditingObjective(null);
  };

  // Mudança rápida de status diretamente pelo cartão
  const handleQuickStatusChange = (id: string, newStatus: ObjectiveStatus) => {
    const updated = storageService.update(id, { status: newStatus });
    if (updated) {
      setObjectives((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
      if (newStatus === 'concluido') {
        showToast('Parabéns! Você concluiu mais um objetivo de estudo! 🎉');
      } else {
        showToast('Status do objetivo atualizado!');
      }
    }
  };

  // Solicitar exclusão (abre o modal de confirmação)
  const handleDeleteRequest = (objective: StudyObjective) => {
    setDeletingObjective(objective);
  };

  // Confirmar exclusão do objetivo
  const handleConfirmDelete = () => {
    if (deletingObjective) {
      const success = storageService.delete(deletingObjective.id);
      if (success) {
        setObjectives((prev) => prev.filter((item) => item.id !== deletingObjective.id));
        showToast('Objetivo removido com sucesso.');
      }
      setDeletingObjective(null);
    }
  };

  // Carregar exemplos práticos se a lista estiver zerada
  const handleLoadSamples = () => {
    const samples = storageService.loadSampleData();
    setObjectives(samples);
    showToast('Exemplos práticos carregados!');
  };

  // Filtragem e Ordenação computada
  const filteredObjectives = useMemo(() => {
    let list = [...objectives];

    // Filtro por termo de busca
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          (o.description && o.description.toLowerCase().includes(q))
      );
    }

    // Filtro por status
    if (statusFilter !== 'todos') {
      list = list.filter((o) => o.status === statusFilter);
    }

    // Ordenação
    list.sort((a, b) => {
      if (sortBy === 'prazo') {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return a.deadline.localeCompare(b.deadline);
      }
      if (sortBy === 'titulo') {
        return a.title.localeCompare(b.title, 'pt-BR');
      }
      // 'recentes' por data de criação decrescente
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return list;
  }, [objectives, searchQuery, statusFilter, sortBy]);

  const isFiltering = Boolean(searchQuery.trim() || statusFilter !== 'todos');

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col font-sans">
      {/* Cabeçalho */}
      <Header
        onOpenCreateModal={handleOpenCreateModal}
        totalCount={objectives.length}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Painel de Boas-Vindas para Estudantes Iniciantes */}
        <section className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 rounded-2xl p-5 sm:p-7 text-white shadow-sm relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight mb-2">
              Seu espaço para organizar o aprendizado passo a passo
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed mb-4">
              Divida matérias grandes em pequenos objetivos diários ou semanais.
              Definir um prazo claro e acompanhar o status ajuda a manter a disciplina e o ritmo.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-indigo-700 hover:bg-indigo-50 font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                Cadastrar Novo Objetivo
              </button>
            </div>
          </div>
          {/* Efeito decorativo sutil */}
          <div className="absolute right-0 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        </section>

        {/* Barra de Estatísticas e Contadores */}
        <StatsBar
          objectives={objectives}
          selectedFilter={statusFilter}
          onSelectFilter={setStatusFilter}
        />

        {/* Barra de Busca, Filtros e Ordenação (se houver objetivos cadastrados) */}
        {objectives.length > 0 && (
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        )}

        {/* Lista de Objetivos ou Estado Vazio */}
        {isLoaded && (
          <section aria-label="Lista de objetivos de estudo">
            {filteredObjectives.length === 0 ? (
              <EmptyState
                isFiltering={isFiltering}
                onOpenCreate={handleOpenCreateModal}
                onClearFilters={() => {
                  setSearchQuery('');
                  setStatusFilter('todos');
                }}
                onLoadSamples={objectives.length === 0 ? handleLoadSamples : undefined}
              />
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 px-1">
                  <span>
                    Exibindo{' '}
                    <strong className="text-slate-700">
                      {filteredObjectives.length}
                    </strong>{' '}
                    de {objectives.length} {objectives.length === 1 ? 'meta' : 'metas'}
                  </span>
                  {statusFilter !== 'todos' && (
                    <button
                      type="button"
                      onClick={() => setStatusFilter('todos')}
                      className="text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
                    >
                      Ver todos
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredObjectives.map((obj) => (
                    <ObjectiveCard
                      key={obj.id}
                      objective={obj}
                      onEdit={handleOpenEditModal}
                      onDeleteRequest={handleDeleteRequest}
                      onQuickStatusChange={handleQuickStatusChange}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Dica pedagógica no rodapé da página */}
        <footer className="mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-500 space-y-1">
          <p className="flex items-center justify-center gap-1.5 text-slate-600">
            <Info className="w-3.5 h-3.5 text-indigo-500" />
            <strong>Dica StudyFlow:</strong> Seus dados são salvos automaticamente no navegador (localStorage).
          </p>
          <p>StudyFlow • Desenvolvido para facilitar a rotina de estudantes iniciantes.</p>
        </footer>
      </main>

      {/* Modal de Criação / Edição de Objetivo */}
      <ObjectiveFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingObjective(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingObjective}
      />

      {/* Modal de Confirmação para Exclusão Segura */}
      <ConfirmModal
        isOpen={Boolean(deletingObjective)}
        objective={deletingObjective}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingObjective(null)}
      />

      {/* Toast de Notificação */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5 text-sm font-medium animate-in slide-in-from-bottom-2 fade-in duration-200 max-w-sm"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-900 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span className="flex-1">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
