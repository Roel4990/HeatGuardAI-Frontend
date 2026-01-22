import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { AirTrafficControlIcon } from '@phosphor-icons/react/dist/ssr/AirTrafficControl';
import { BrainIcon } from '@phosphor-icons/react/dist/ssr/Brain';
import { CurrencyDollarIcon } from '@phosphor-icons/react/dist/ssr/CurrencyDollar';
import { GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { MegaphoneIcon } from '@phosphor-icons/react/dist/ssr/Megaphone';
import { PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import { UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';
import { HouseSimpleIcon } from '@phosphor-icons/react/dist/ssr/HouseSimple';

export const navIcons = {
	'home': HouseSimpleIcon,
  'air-traffic-control': AirTrafficControlIcon,
  brain: BrainIcon,
  'chart-pie': ChartPieIcon,
  'currency-dollar': CurrencyDollarIcon,
  'gear-six': GearSixIcon,
  megaphone: MegaphoneIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  user: UserIcon,
  users: UsersIcon,
} as Record<string, Icon>;
