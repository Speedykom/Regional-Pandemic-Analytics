import {
	BiChart,
	BiData,
	BiGitMerge,
	BiGitPullRequest,
	BiHome,
	BiLock,
	BiTable,
	BiUser,
} from 'react-icons/bi';
import { NavLink } from '../link';
import { motion, AnimationControls } from 'framer-motion';
import { usePermission } from '@/common/hooks/use-permission';
import Tooltip from '../common/Tooltip';

interface MenuProps {
	controlstextopacity?: AnimationControls;
	controlstext?: AnimationControls;
	isOpen: boolean;
}

export const MenuData = [
	{
		name: 'Dashboard',
		items: [
			{
				title: 'Home',
				href: '/home',
				icon: BiHome,
				scope: '',
			},
			{
				title: 'Dashboards',
				href: '/dashboards',
				icon: BiTable,
				scope: 'dashboard:read',
			},
			{
				title: 'Charts',
				href: '/charts',
				icon: BiChart,
				scope: 'chart:read',
			},
		],
	},
	{
		name: 'Manage',
		items: [
			{
				title: 'Process Chains',
				href: '/process-chains',
				icon: BiGitPullRequest,
				scope: 'process:read',
			},
			{
				title: 'Data',
				href: '/data',
				icon: BiData,
				scope: 'data:read',
			},
			{
<<<<<<< HEAD
				title: "My Pipelines",
				href: "/pipelines",
=======
				title: 'My Pipelines',
				href: '/my-pipeline',
>>>>>>> 6d43613 (tooltip component refactor, show tooltip only when sidebar is minimised)
				icon: BiGitMerge,
				scope: 'pipeline:read',
			},
		],
	},
	{
		name: 'Settings',
		items: [
			{
				title: 'Roles',
				href: '/roles',
				icon: BiLock,
				scope: 'user:read',
			},
			{
				title: 'Accounts',
				href: '/users',
				icon: BiUser,
				scope: 'user:read',
			},
		],
	},
];

export const SideNavLinks = (prop: MenuProps) => {
	const { hasPermission } = usePermission();
	return (
		<>
			{MenuData.map((group) => (
				<div key={group.name} className="my-4 flex flex-col">
					<motion.p
						animate={prop.controlstextopacity}
						className='text-gray-500 ml-4 text-sm font-bold mb-2'
					>
						{prop?.isOpen ? group?.name : ''}
					</motion.p>

					{group.items.filter(({ title, scope }) => title == "Home" || hasPermission(scope)).map((item) => (
						<NavLink
							key={item.title}
							href={item.href}
							activeClassName="bg-prim text-white hover:bg-prim-hover"
							className="hover:bg-gray-400/40 px-4 py-3 flex w-full cursor-pointer"
						>
							<item.icon className="text-lg" />

							<motion.p
								animate={prop?.controlstext}
								className="ml-4 text-sm"
							>
								{prop?.isOpen ? item?.title : ""}
							</motion.p>
						</NavLink>
					))}
				</div>
			))}
		</>
	);
};
