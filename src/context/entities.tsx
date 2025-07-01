import React, { createContext, useContext, useState, useEffect } from 'react';
import { Chamado, User, Setor, Equipamento } from '@/types';
import { resources } from '@/services/resources';

/**
 * Props para o contexto de entidades
 * Gerencia todas as operações CRUD para as entidades do sistema
 * @interface EntitiesContextProps
 */
interface EntitiesContextProps {
  // Estados das entidades
  /** Lista de chamados */
  chamados: Chamado[];
  /** Lista de usuários */
  usuarios: User[];
  /** Lista de setores */
  setores: Setor[];
  /** Lista de equipamentos */
  equipamentos: Equipamento[];
  
  // CRUD operations para Chamados
  /** Criar novo chamado */
  createChamado: (chamado: Omit<Chamado, 'id' | 'dataAbertura'>) => Promise<boolean>;
  /** Atualizar chamado existente */
  updateChamado: (id: string, updates: Partial<Chamado>) => Promise<boolean>;
  /** Deletar chamado */
  deleteChamado: (id: string) => Promise<boolean>;
  
  // CRUD operations para Usuários
  /** Criar novo usuário */
  createUsuario: (usuario: Omit<User, 'id'>) => void;
  /** Atualizar usuário existente */
  updateUsuario: (id: string, updates: Partial<User>) => void;
  /** Deletar usuário */
  deleteUsuario: (id: string) => void;
  
  // CRUD operations para Setores
  /** Criar novo setor */
  createSetor: (setor: Omit<Setor, 'id'>) => void;
  /** Atualizar setor existente */
  updateSetor: (id: string, updates: Partial<Setor>) => void;
  /** Deletar setor */
  deleteSetor: (id: string) => void;
  
  // CRUD operations para Equipamentos
  /** Criar novo equipamento */
  createEquipamento: (equipamento: Omit<Equipamento, 'id'>) => void;
  /** Atualizar equipamento existente */
  updateEquipamento: (id: string, updates: Partial<Equipamento>) => void;
  /** Deletar equipamento */
  deleteEquipamento: (id: string) => void;
}

/**
 * Contexto para gerenciar todas as entidades do sistema
 * Fornece operações CRUD para chamados, usuários, setores e equipamentos
 * @default undefined
 */
const EntitiesContext = createContext<EntitiesContextProps | undefined>(undefined);

/**
 * Provider para o contexto de entidades
 * Gerencia estado e operações CRUD para todas as entidades do sistema
 * 
 * @param children - Componentes filhos que terão acesso ao contexto
 * @returns JSX.Element
 * 
 * @example
 * ```tsx
 * <EntitiesProvider>
 *   <Dashboard />
 * </EntitiesProvider>
 * ```
 */
export const EntitiesProvider = ({ children }: { children: React.ReactNode }) => {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [setores, setSetores] = useState<Setor[]>([]);
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);

  // Inicializar dados da API
  useEffect(() => {
    const loadData = async () => {
      try {
        const [chamadosData, usuariosData, setoresData, equipamentosData] = await Promise.all([
          resources.getChamados(),
          resources.getUsers(),
          resources.getSetores(),
          resources.getEquipamentos()
        ]);

        setChamados(chamadosData);
        setUsuarios(usuariosData);
        setSetores(setoresData);
        setEquipamentos(equipamentosData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    loadData();
  }, []);

  /**
   * Cria um novo chamado
   * @decorator @crud - Operação de criação com ID auto-gerado
   * @decorator @realtime - Atualiza estado local imediatamente
   * @param {Omit<Chamado, 'id' | 'dataAbertura'>} chamado - Dados do chamado (sem id e dataAbertura)
   * @returns {Promise<boolean>} True se a operação foi bem-sucedida
   */
  const createChamado = async (chamado: Omit<Chamado, 'id' | 'dataAbertura'>): Promise<boolean> => {
    try {
      const newChamado = {
        ...chamado,
        id: Date.now().toString(),
        dataAbertura: new Date().toISOString(),
      } as Chamado;
      
      setChamados(prev => [...prev, newChamado]);
      return true;
    } catch (error) {
      console.error('Erro ao criar chamado:', error);
      return false;
    }
  };

  /**
   * Atualiza um chamado existente
   * @decorator @immutable - Preserva referências não modificadas
   * @decorator @partial - Permite atualizações parciais dos dados
   * @param {string} id - ID do chamado a ser atualizado
   * @param {Partial<Chamado>} updates - Dados parciais para atualização
   * @returns {Promise<boolean>} True se a operação foi bem-sucedida
   */
  const updateChamado = async (id: string, updates: Partial<Chamado>): Promise<boolean> => {
    try {
      setChamados(prev => 
        prev.map(chamado => 
          chamado.id === id ? { ...chamado, ...updates } : chamado
        )
      );
      return true;
    } catch (error) {
      console.error('Erro ao atualizar chamado:', error);
      return false;
    }
  };

  /**
   * Remove um chamado
   * @decorator @filter - Remove item por ID mantendo integridade da lista
   * @param {string} id - ID do chamado a ser removido
   * @returns {Promise<boolean>} True se a operação foi bem-sucedida
   */
  const deleteChamado = async (id: string): Promise<boolean> => {
    try {
      setChamados(prev => prev.filter(chamado => chamado.id !== id));
      return true;
    } catch (error) {
      console.error('Erro ao deletar chamado:', error);
      return false;
    }
  };

  /**
   * Cria um novo usuário
   * @decorator @validation - ID único gerado automaticamente
   * @decorator @typecast - Força casting para tipo User completo
   * @param {Omit<User, 'id'>} usuario - Dados do usuário (sem id)
   */
  const createUsuario = (usuario: Omit<User, 'id'>) => {
    const newUsuario: User = {
      ...usuario,
      id: Date.now().toString()
    } as User;
    setUsuarios(prev => [...prev, newUsuario]);
  };

  /**
   * Atualiza um usuário existente
   * @param id - ID do usuário a ser atualizado
   * @param updates - Dados parciais para atualização
   */
  const updateUsuario = (id: string, updates: Partial<User>) => {
    setUsuarios(prev => 
      prev.map(usuario => 
        usuario.id === id ? { ...usuario, ...updates } : usuario
      )
    );
  };

  /**
   * Remove um usuário
   * @param id - ID do usuário a ser removido
   */
  const deleteUsuario = (id: string) => {
    setUsuarios(prev => prev.filter(usuario => usuario.id !== id));
  };

  /**
   * Cria um novo setor
   * @param setor - Dados do setor (sem id)
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createSetor = (setorData: any) => {
    const newSetor: Setor = {
      id: Date.now().toString(),
      nome: setorData.nome,
      categoria: setorData.categoria,
      ativo: setorData.ativo,
      descricao: setorData.descricao,
      dataCriacao: setorData.dataCriacao || new Date().toISOString(),
      dataAtualizacao: setorData.dataAtualizacao,
      equipamentosCount: setorData.equipamentosCount || 0
    };
    setSetores(prev => [...prev, newSetor]);
  };

  /**
   * Atualiza um setor existente
   * @param id - ID do setor a ser atualizado
   * @param updates - Dados parciais para atualização
   */
  const updateSetor = (id: string, updates: Partial<Setor>) => {
    setSetores(prev => 
      prev.map(setor => 
        setor.id === id ? { ...setor, ...updates } : setor
      )
    );
  };

  /**
   * Remove um setor
   * @param id - ID do setor a ser removido
   */
  const deleteSetor = (id: string) => {
    setSetores(prev => prev.filter(setor => setor.id !== id));
  };

  /**
   * Cria um novo equipamento
   * @param equipamento - Dados do equipamento (sem id)
   */
  const createEquipamento = (equipamento: Omit<Equipamento, 'id'>) => {
    const newEquipamento: Equipamento = {
      ...equipamento,
      id: Date.now().toString(),
    };
    setEquipamentos(prev => [...prev, newEquipamento]);
  };

  /**
   * Atualiza um equipamento existente
   * @param id - ID do equipamento a ser atualizado
   * @param updates - Dados parciais para atualização
   */
  const updateEquipamento = (id: string, updates: Partial<Equipamento>) => {
    setEquipamentos(prev => 
      prev.map(equipamento => 
        equipamento.id === id ? { ...equipamento, ...updates } : equipamento
      )
    );
  };

  /**
   * Remove um equipamento
   * @param id - ID do equipamento a ser removido
   */
  const deleteEquipamento = (id: string) => {
    setEquipamentos(prev => prev.filter(equipamento => equipamento.id !== id));
  };

  return (
    <EntitiesContext.Provider value={{
      chamados,
      usuarios,
      setores,
      equipamentos,
      createChamado,
      updateChamado,
      deleteChamado,
      createUsuario,
      updateUsuario,
      deleteUsuario,
      createSetor,
      updateSetor,
      deleteSetor,
      createEquipamento,
      updateEquipamento,
      deleteEquipamento,
    }}>
      {children}
    </EntitiesContext.Provider>
  );
};

/**
 * Hook para acessar o contexto de entidades
 * Deve ser usado dentro de um EntitiesProvider
 * 
 * @returns {EntitiesContextProps} Objeto com todas as entidades e operações CRUD
 * @throws {Error} Quando usado fora do EntitiesProvider
 * 
 * @example
 * ```tsx
 * const { 
 *   chamados, 
 *   createChamado, 
 *   updateChamado, 
 *   deleteChamado,
 *   usuarios,
 *   // ... outras entidades e operações
 * } = useEntities();
 * 
 * const handleCreateChamado = () => {
 *   createChamado({
 *     titulo: 'Novo chamado',
 *     descricao: 'Descrição do problema',
 *     // ... outros campos
 *   });
 * };
 * ```
 */
export const useEntities = () => {
  const context = useContext(EntitiesContext);
  if (!context) {
    throw new Error('useEntities must be used within an EntitiesProvider');
  }
  return context;
};
