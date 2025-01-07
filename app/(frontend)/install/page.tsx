'use client';

import { useEffect, useState } from 'react';
import { InstallGuide } from '@/components/install-guide';
import { DesktopPrompt } from '@/components/desktop-prompt';
import { AlreadyInstalled } from '@/components/already-installed';

export default function InstallPage() {
	const [isMobile, setIsMobile] = useState(false);
	const [isInstalled, setIsInstalled] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		const checkInstalled = () => {
			// In a real app, you'd want a more robust check here
			const installed = localStorage.getItem(
				'sportsAddicts_installed'
			);
			setIsInstalled(installed === 'true');
		};

		checkMobile();
		checkInstalled();
		window.addEventListener('resize', checkMobile);

		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	if (isInstalled) {
		return <AlreadyInstalled />;
	}

	return <>{isMobile ? <InstallGuide /> : <DesktopPrompt />}</>;
}
