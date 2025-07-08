import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const routeCache = new Map<string, { result: string; timestamp: number }>();
const CACHE_TTL = 30 * 1000; // 30 seconds

/**
 * Get cached route decision or null if expired/not found
 * @decorator @cache - Sistema de cache em memória com TTL
 * @param {string} key - Chave única para o cache
 * @returns {string | null} Resultado cacheado ou null se expirado
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
 * @decorator @performance - Otimiza decisões de roteamento repetidas
 * @param {string} key - Chave única para o cache
 * @param {string} result - Resultado da decisão de roteamento
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
 * @decorator @security - Protege rotas baseado em autenticação
 * @decorator @cache - Implementa cache para decisões de roteamento
 * @decorator @performance - Otimizado para alta frequência de requisições
 * 
 * @param {NextRequest} request - Request do Next.js
 * @returns {NextResponse} Response com redirecionamento ou continuação
 * 
 * @example
 * ```typescript
 * // Rota protegida: /dashboard/* - requer autenticação
 * // Rota pública: /login - redireciona se já autenticado
 * ```
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/api') || 
      pathname.includes('.')) {
    return NextResponse.next();
  }
  
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
  
  const publicRoutes = ['/login'];
  const isPublicRoute = publicRoutes.includes(pathname);
  
  let result: string;
  
  if (pathname === '/') {
    result = isAuthenticated ? '/dashboard' : '/login';
    setCachedRoute(cacheKey, result);
    return NextResponse.redirect(new URL(result, request.url));
  }
  
  if (isAuthenticated && pathname === '/login') {
    result = '/dashboard';
    setCachedRoute(cacheKey, result);
    return NextResponse.redirect(new URL(result, request.url));
  }
  
  if (!isAuthenticated && !isPublicRoute) {
    result = '/login';
    setCachedRoute(cacheKey, result);
    const response = NextResponse.redirect(new URL(result, request.url));
    response.cookies.delete('nextar_user');
    return response;
  }
  
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
