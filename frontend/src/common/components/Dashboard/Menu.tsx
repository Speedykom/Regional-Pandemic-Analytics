import {
  BiChart,
  BiGitMerge,
  BiGitPullRequest,
  BiHome,
  BiTable,
  BiUser,
} from 'react-icons/bi';
import { motion, AnimationControls } from 'framer-motion';
import { usePermission } from '@/common/hooks/use-permission';
import { NavLink } from '../link';
import { useTranslation } from 'react-i18next';

interface MenuProps {
  controlstextopacity?: AnimationControls;
  controlstext?: AnimationControls;
  isOpen: boolean;
}

export const MenuData = [
  {
    name: 'dashboard',
    items: [
      {
        title: 'home',
        href: '/home',
        icon: BiHome,
        scope: '',
      },
      {
        title: 'dashboards',
        href: '/dashboards',
        icon: BiTable,
        scope: 'dashboard:read',
      },
      {
        title: 'charts',
        href: '/charts',
        icon: BiChart,
        scope: 'chart:read',
      },
    ],
  },
  {
    name: 'manage',
    items: [
      {
        title: 'processChains',
        href: '/process-chains',
        icon: BiGitPullRequest,
        scope: 'process:read',
      },

      {
        title: 'pipelines',
        href: '/pipelines',
        icon: BiGitMerge,
        scope: 'pipeline:read',
      },
    ],
  },
  {
    name: 'settings',
    items: [
      {
        title: 'accounts',
        href: '/users',
        icon: BiUser,
        scope: 'user:read',
      },
    ],
  },
];

export const SideNavLinks = (prop: MenuProps) => {
  const { hasPermission } = usePermission();
  const { t } = useTranslation();
  return (
    <>
      {MenuData.map((group) => (
        <div key={group.name} className="my-4 flex flex-col">
          <motion.p
            animate={prop.controlstextopacity}
            className="text-gray-500 ml-4 text-sm font-bold mb-2"
          >
            {prop?.isOpen ? t(`menu.${group?.name}`) : ''}
          </motion.p>

          {group.items
            .filter(
              ({ title, scope }) =>
                t(`menu.${title}`) === t('menu.home') || hasPermission(scope)
            )
            .map((item) => (
              <NavLink
                key={item.title}
                href={item.href}
                activeClassName="bg-prim text-white hover:bg-prim-hover"
                className="hover:bg-gray-400/40 px-4 py-3 flex w-full cursor-pointer"
              >
                <item.icon className="text-lg" />

                <motion.p animate={prop?.controlstext} className="ml-4 text-sm">
                  {prop?.isOpen ? t(`menu.${item?.title}`) : ''}
                </motion.p>
              </NavLink>
            ))}
        </div>
      ))}
    </>
  );
};
