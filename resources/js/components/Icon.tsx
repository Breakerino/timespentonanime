import { AppIcons } from '@/app/types';
import React from 'react';

export interface IconProps {
	id: keyof typeof AppIcons;
	color?: string
	size?: string
	className?: string;
}

const Icon: React.FC<IconProps> = ({ id, color, className }) => {
	const iconURI = React.useMemo(() => {
		const iconID = `icon-${AppIcons[id]}`;
		return import.meta.env.DEV ? `#${iconID}` : `${import.meta.env.BASE_URL}assets/icons.svg#${iconID}`;
	}, [id]);

	return (<>
		<svg className={`text-${color} ${className}`} aria-hidden="true">
			<use xlinkHref={iconURI}></use>
		</svg>
	</>
	);
}

Icon.displayName = 'Icon';

export default Icon;