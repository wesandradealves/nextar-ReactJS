import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Histórico de Manutenções | Sistema NextAR',
  description: 'Consulte o histórico completo de manutenções com filtros avançados',
};

export default function HistoricoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
