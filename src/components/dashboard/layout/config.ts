import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: '홈', href: paths.dashboard.overview, icon: 'home' },
  { key: 'realTimeControl', title: '실시간 관제', href: paths.dashboard.realTimeControl, icon: 'air-traffic-control' },
  { key: 'AIBestLocation', title: 'AI 최적위치', href: paths.dashboard.AIBestLocation, icon: 'brain' },
  { key: 'budgetSimulation', title: '예산 시뮬레이션', href: paths.dashboard.budgetSimulation, icon: 'currency-dollar' },
  { key: 'notice', title: '공지사항', href: paths.dashboard.notice, icon: 'megaphone', matcher: { type: 'startsWith', href: paths.dashboard.notice } },
] satisfies NavItemConfig[];
