import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware para controle de autenticação e redirecionamentos
 * Gerencia fluxo de login/logout e proteção de rotas
 * 
 * @param request - Request do Next.js
 * @returns Response com redirecionamento ou continuação
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Verificar se o usuário está autenticado através de cookies
  const userCookie = request.cookies.get('nextar_user');
  const isAuthenticated = !!userCookie?.value;
  
  console.log('🛡️ Middleware executado:', {
    pathname,
    hasUserCookie: !!userCookie,
    isAuthenticated,
    cookieValue: userCookie?.value ? 'presente' : 'ausente'
  });
  
  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/login'];
  const isPublicRoute = publicRoutes.includes(pathname);
  
  // Rota raiz - redirecionar baseado na autenticação
  if (pathname === '/') {
    if (isAuthenticated) {
      console.log('🏠 Redirecionando de / para /dashboard (autenticado)');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      console.log('🏠 Redirecionando de / para /login (não autenticado)');
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Se usuário autenticado tentar acessar login, redirecionar para dashboard
  if (isAuthenticated && pathname === '/login') {
    console.log('🔐 Usuário autenticado tentando acessar /login, redirecionando para /dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Se usuário não autenticado tentar acessar rota protegida, redirecionar para login
  if (!isAuthenticated && !isPublicRoute) {
    console.log('🚫 Usuário não autenticado tentando acessar rota protegida, redirecionando para /login');
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  console.log('✅ Permitindo acesso a:', pathname);
  // Continuar para a rota solicitada
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/dashboard/:path*',
    '/users/:path*',
    '/chamados/:path*',
    '/equipamentos/:path*',
    '/setores/:path*'
  ]
};
