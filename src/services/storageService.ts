import { ObjectiveFormData, StudyObjective } from '../types/objective';

const STORAGE_KEY = 'studyflow_objectives_v1';

/**
 * Exemplos iniciais acolhedores para estudantes iniciantes
 */
const DEFAULT_OBJECTIVES: StudyObjective[] = [
  {
    id: 'sample-1',
    title: 'Fundamentos de Algoritmos e Lógica',
    description: 'Compreender estruturas condicionais (if/else) e laços de repetição (for/while) com exercícios práticos.',
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'em_andamento',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-2',
    title: 'Organizar cronograma semanal de estudos',
    description: 'Reservar 45 minutos diários pelo método Pomodoro e separar os materiais de leitura.',
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'nao_iniciado',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-3',
    title: 'Introdução ao Git e GitHub',
    description: 'Criar uma conta, instalar o Git e fazer o primeiro commit em um repositório de teste.',
    deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'concluido',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const storageService = {
  /**
   * Recupera todos os objetivos salvos no localStorage
   */
  getAll(): StudyObjective[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        // Inicializa com dados de exemplo na primeira visita para orientar o estudante
        this.saveAll(DEFAULT_OBJECTIVES);
        return DEFAULT_OBJECTIVES;
      }
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Erro ao ler do localStorage:', error);
      return [];
    }
  },

  /**
   * Salva a lista completa de objetivos no localStorage
   */
  saveAll(objectives: StudyObjective[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(objectives));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  },

  /**
   * Cadastra um novo objetivo de estudo
   */
  create(data: ObjectiveFormData): StudyObjective {
    const list = this.getAll();
    const newObjective: StudyObjective = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `obj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: data.title.trim(),
      description: data.description.trim(),
      deadline: data.deadline,
      status: data.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newObjective, ...list];
    this.saveAll(updated);
    return newObjective;
  },

  /**
   * Atualiza os dados de um objetivo existente
   */
  update(id: string, data: Partial<ObjectiveFormData>): StudyObjective | null {
    const list = this.getAll();
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const existing = list[index];
    const updatedItem: StudyObjective = {
      ...existing,
      ...(data.title !== undefined && { title: data.title.trim() }),
      ...(data.description !== undefined && { description: data.description.trim() }),
      ...(data.deadline !== undefined && { deadline: data.deadline }),
      ...(data.status !== undefined && { status: data.status }),
      updatedAt: new Date().toISOString(),
    };

    list[index] = updatedItem;
    this.saveAll(list);
    return updatedItem;
  },

  /**
   * Remove um objetivo pelo ID
   */
  delete(id: string): boolean {
    const list = this.getAll();
    const filtered = list.filter((item) => item.id !== id);
    if (filtered.length === list.length) return false;
    this.saveAll(filtered);
    return true;
  },

  /**
   * Restaura os exemplos pedagógicos padrão
   */
  loadSampleData(): StudyObjective[] {
    this.saveAll(DEFAULT_OBJECTIVES);
    return DEFAULT_OBJECTIVES;
  },

  /**
   * Limpa todos os dados
   */
  clearAll(): void {
    this.saveAll([]);
  },
};
