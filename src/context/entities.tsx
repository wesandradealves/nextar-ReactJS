import React, { createContext, useContext, useState, useEffect } from 'react';
import { Chamado, User, Setor, Equipamento } from '@/types';
import { resources } from '@/services/resources';

interface EntitiesContextProps {
  // Estados
  chamados: Chamado[];
  usuarios: User[];
  setores: Setor[];
  equipamentos: Equipamento[];
  
  // CRUD operations para Chamados
  createChamado: (chamado: Omit<Chamado, 'id' | 'dataAbertura'>) => void;
  updateChamado: (id: string, updates: Partial<Chamado>) => void;
  deleteChamado: (id: string) => void;
  
  // CRUD operations para Usuários
  createUsuario: (usuario: Omit<User, 'id'>) => void;
  updateUsuario: (id: string, updates: Partial<User>) => void;
  deleteUsuario: (id: string) => void;
  
  // CRUD operations para Setores
  createSetor: (setor: Omit<Setor, 'id'>) => void;
  updateSetor: (id: string, updates: Partial<Setor>) => void;
  deleteSetor: (id: string) => void;
  
  // CRUD operations para Equipamentos
  createEquipamento: (equipamento: Omit<Equipamento, 'id'>) => void;
  updateEquipamento: (id: string, updates: Partial<Equipamento>) => void;
  deleteEquipamento: (id: string) => void;
}

const EntitiesContext = createContext<EntitiesContextProps | undefined>(undefined);

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

  // CRUD Chamados
  const createChamado = (chamado: Omit<Chamado, 'id' | 'dataAbertura'>) => {
    const newChamado: Chamado = {
      ...chamado,
      id: Date.now().toString(),
      dataAbertura: new Date().toISOString(),
    };
    setChamados(prev => [...prev, newChamado]);
  };

  const updateChamado = (id: string, updates: Partial<Chamado>) => {
    setChamados(prev => 
      prev.map(chamado => 
        chamado.id === id ? { ...chamado, ...updates } : chamado
      )
    );
  };

  const deleteChamado = (id: string) => {
    setChamados(prev => prev.filter(chamado => chamado.id !== id));
  };

  // CRUD Usuários
  const createUsuario = (usuario: Omit<User, 'id'>) => {
    const newUsuario: User = {
      ...usuario,
      id: Date.now().toString(),
    };
    setUsuarios(prev => [...prev, newUsuario]);
  };

  const updateUsuario = (id: string, updates: Partial<User>) => {
    setUsuarios(prev => 
      prev.map(usuario => 
        usuario.id === id ? { ...usuario, ...updates } : usuario
      )
    );
  };

  const deleteUsuario = (id: string) => {
    setUsuarios(prev => prev.filter(usuario => usuario.id !== id));
  };

  // CRUD Setores
  const createSetor = (setor: Omit<Setor, 'id'>) => {
    const newSetor: Setor = {
      ...setor,
      id: Date.now().toString(),
    };
    setSetores(prev => [...prev, newSetor]);
  };

  const updateSetor = (id: string, updates: Partial<Setor>) => {
    setSetores(prev => 
      prev.map(setor => 
        setor.id === id ? { ...setor, ...updates } : setor
      )
    );
  };

  const deleteSetor = (id: string) => {
    setSetores(prev => prev.filter(setor => setor.id !== id));
  };

  // CRUD Equipamentos
  const createEquipamento = (equipamento: Omit<Equipamento, 'id'>) => {
    const newEquipamento: Equipamento = {
      ...equipamento,
      id: Date.now().toString(),
    };
    setEquipamentos(prev => [...prev, newEquipamento]);
  };

  const updateEquipamento = (id: string, updates: Partial<Equipamento>) => {
    setEquipamentos(prev => 
      prev.map(equipamento => 
        equipamento.id === id ? { ...equipamento, ...updates } : equipamento
      )
    );
  };

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

export const useEntities = () => {
  const context = useContext(EntitiesContext);
  if (!context) {
    throw new Error('useEntities must be used within an EntitiesProvider');
  }
  return context;
};
