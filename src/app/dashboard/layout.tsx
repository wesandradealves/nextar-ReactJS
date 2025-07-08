'use client';

import React from 'react';
import { useAuth } from '@/context/auth';
import { Header as HeaderComponent } from '@/components/organisms/Header';
import { PerfilUsuario } from '@/utils/enums';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout do Dashboard - mantém header fixo e renderiza conteúdo dinâmico
 * Usado para todas as páginas dentro de /dashboard/*
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout, isLoggingOut } = useAuth();
  const router = useRouter();

  /**
   * Manipula logout com redirecionamento
   */
  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  /**
   * Manipula clique no perfil
   */
  const handleProfileClick = () => {
    router.push('/dashboard/profile');
  };

  // Garante que o header permaneça visível durante todo o processo de logout
  const shouldShowHeader = user || isLoggingOut;
  // Dados seguros para o header durante logout
  const headerUserName = user?.nome || 'Usuário';
  const headerUserEmail = user?.email || '';
  const headerUserProfile = user?.perfil || PerfilUsuario.PESQUISADOR;

  if (!shouldShowHeader) {
    return null; // Redirecionamento será feito pelo middleware
  }

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderComponent
        userName={headerUserName}
        userEmail={headerUserEmail}
        userProfile={headerUserProfile}
        isLoggingOut={isLoggingOut}
        onLogout={handleLogout}
        onProfileClick={handleProfileClick}
      />
      <main className="flex-1 pt-[70px]">
        {children}
      </main>
    </div>
  );
}
