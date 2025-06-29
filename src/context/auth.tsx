import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Permission } from '@/types';
import { PERMISSIONS } from '@/utils/enums';
import { resources } from '@/services/resources';
import { useCache } from './cache';
import Cookies from 'js-cookie';

/**
 * Props para o contexto de autenticação
 * @interface AuthContextProps
 */
interface AuthContextProps {
  /** Usuário autenticado atual */
  user: User | null;
  /** Status de autenticação */
  isAuthenticated: boolean;
  /** Status de logout em progresso */
  isLoggingOut: boolean;
  /** Função para realizar login */
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  /** Função para realizar logout */
  logout: () => void;
  /** Função para atualizar dados do usuário */
  updateUser: (userData: Partial<User>) => void;
  /** Função para verificar se o usuário tem uma permissão específica */
  hasPermission: (permission: string) => boolean;
}

/**
 * Contexto para gerenciar autenticação e autorização da aplicação
 * @default undefined
 */
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

/**
 * Provider para o contexto de autenticação
 * Gerencia estado do usuário, login, logout e verificação de permissões
 * 
 * @param children - Componentes filhos que terão acesso ao contexto
 * @returns JSX.Element
 * 
 * @example
 * ```tsx
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * ```
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const cache = useCache();

  useEffect(() => {
    // Recuperar usuário do localStorage e verificar cookie
    const savedUser = localStorage.getItem('user');
    const userCookie = Cookies.get('nextar_user');
    
    if (savedUser && userCookie) {
      setUser(JSON.parse(savedUser));
    } else if (savedUser && !userCookie) {
      // Se há dados no localStorage mas não no cookie, limpar tudo
      localStorage.removeItem('user');
    } else if (!savedUser && userCookie) {
      // Se há cookie mas não localStorage, usar cookie
      setUser(JSON.parse(userCookie));
      localStorage.setItem('user', userCookie);
    }
  }, []);

  /**
   * Função para realizar login do usuário
   * @param email - Email do usuário
   * @param password - Senha do usuário
   * @param rememberMe - Se deve manter o usuário logado por mais tempo
   * @throws {Error} Quando as credenciais são inválidas
   */
  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      const response = await resources.login(email, password);
      setUser(response.user);
      
      // Configurar duração do cookie baseado na opção "lembrar de mim"
      const cookieExpires = rememberMe ? 30 : 1; // 30 dias vs 1 dia
      
      // Salvar no localStorage E em cookies para que o middleware detecte
      localStorage.setItem('user', JSON.stringify(response.user));
      Cookies.set('nextar_user', JSON.stringify(response.user), { 
        expires: cookieExpires,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      // Cache user data for quick access
      cache.set('current_user', response.user, 60 * 60 * 1000, ['auth', 'user']); // 1 hour
      
      // Redirecionamento manual para dashboard
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  /**
   * Função para realizar logout do usuário
   * Remove dados do usuário do estado, localStorage e cookies
   * Força redirecionamento para evitar problemas de cache
   */
  const logout = () => {
    setIsLoggingOut(true);
    
    // Limpeza imediata de dados
    localStorage.removeItem('user');
    Cookies.remove('nextar_user');
    
    // Clear all cache data on logout
    cache.invalidateByTag('auth');
    cache.invalidateByTag('user');
    cache.invalidateByTag('dashboard');
    
    // Redirecionamento forçado após pequeno delay para feedback visual
    setTimeout(() => {
      setUser(null);
      setIsLoggingOut(false);
      
      // Usar window.location para forçar redirecionamento
      window.location.href = '/login';
    }, 300);
  };

  /**
   * Função para atualizar dados do usuário no contexto
   * @param userData - Dados parciais do usuário para atualização
   */
  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    
    // Atualizar localStorage e cookies
    localStorage.setItem('user', JSON.stringify(updatedUser));
    Cookies.set('nextar_user', JSON.stringify(updatedUser), { 
      expires: 30, // Manter configuração existente
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  };

  /**
   * Verifica se o usuário atual possui uma permissão específica
   * @param permission - Nome da permissão a ser verificada
   * @returns {boolean} true se o usuário tem a permissão, false caso contrário
   */
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    const userPermissions = PERMISSIONS[user.perfil];
    return userPermissions.includes(permission as Permission) || 
           userPermissions.includes('all');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoggingOut,
      login,
      logout,
      updateUser,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook para acessar o contexto de autenticação
 * Deve ser usado dentro de um AuthProvider
 * 
 * @returns {AuthContextProps} Objeto com user, isAuthenticated, login, logout e hasPermission
 * @throws {Error} Quando usado fora do AuthProvider
 * 
 * @example
 * ```tsx
 * const { user, isAuthenticated, login, logout, hasPermission } = useAuth();
 * 
 * const handleLogin = async () => {
 *   try {
 *     await login(email, password);
 *   } catch (error) {
 *     console.error('Login failed:', error);
 *   }
 * };
 * 
 * const canEdit = hasPermission('EDIT_USERS');
 * ```
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};