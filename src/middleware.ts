import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory cache for middleware (resets on redeploy)
const routeCache = new Map<string, { result: string; timestamp: number }>();
const CACHE_TTL = 30 * 1000; // 30 seconds

/**
 * Get cached route decision or null if expired/not found
 */
function getCachedRoute(key: string): string | null {
  const cached = routeCache.get(key);
  if (!cached) return null;
  
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    routeCache.delete(key);
    return null;
  }
  
  return cached.result;
}

/**
 * Cache route decision
 */
function setCachedRoute(key: string, result: string): void {
  routeCache.set(key, {
    result,
    timestamp: Date.now()
  });
}

/**
 * Middleware para controle de autenticação e redirecionamentos
 * Gerencia fluxo de login/logout e proteção de rotas com cache otimizado
 * 
 * @param request - Request do Next.js
 * @returns Response com redirecionamento ou continuação
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Permitir acesso a assets e APIs
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/api') || 
      pathname.includes('.')) {
    return NextResponse.next();
  }
  
  // Check cache first
  const userCookie = request.cookies.get('nextar_user');
  const isAuthenticated = !!userCookie?.value;
  const cacheKey = `${pathname}:${isAuthenticated}`;
  
  const cachedResult = getCachedRoute(cacheKey);
  if (cachedResult) {
    if (cachedResult === 'next') {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL(cachedResult, request.url));
    }
  }
  
  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/login'];
  const isPublicRoute = publicRoutes.includes(pathname);
  
  let result: string;
  
  // Rota raiz - redirecionar baseado na autenticação
  if (pathname === '/') {
    result = isAuthenticated ? '/dashboard' : '/login';
    setCachedRoute(cacheKey, result);
    return NextResponse.redirect(new URL(result, request.url));
  }
  
  // Se usuário autenticado tentar acessar login, redirecionar para dashboard
  if (isAuthenticated && pathname === '/login') {
    result = '/dashboard';
    setCachedRoute(cacheKey, result);
    return NextResponse.redirect(new URL(result, request.url));
  }
  
  // Se usuário não autenticado tentar acessar rota protegida, redirecionar para login
  if (!isAuthenticated && !isPublicRoute) {
    result = '/login';
    setCachedRoute(cacheKey, result);
    const response = NextResponse.redirect(new URL(result, request.url));
    // Limpar cookie inválido se existir
    response.cookies.delete('nextar_user');
    return response;
  }
  
  // Continue normally
  setCachedRoute(cacheKey, 'next');
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
