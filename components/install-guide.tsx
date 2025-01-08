import Image from 'next/image';
import { Button } from '@/components/ui/button';

const steps = [
	{
		title: 'Open in Safari',
		description:
			'Launch Safari browser on your iOS device and navigate to our website.',
		illustration: '/placeholder.svg?height=200&width=200',
	},
	{
		title: 'Tap Share',
		description: 'Tap the Share button at the bottom of the browser.',
		illustration: '/placeholder.svg?height=200&width=200',
	},
	{
		title: 'Add to Home Screen',
		description: "Scroll down and tap 'Add to Home Screen'.",
		illustration: '/placeholder.svg?height=200&width=200',
	},
	{
		title: 'Confirm',
		description:
			"Tap 'Add' in the top right corner to install the app.",
		illustration: '/placeholder.svg?height=200&width=200',
	},
];

export function InstallGuide() {
	return (
		<div className='container mx-auto px-4 py-16 max-w-4xl'>
			<h1 className='text-4xl font-bold text-center mb-8'>
				Install Sports Addicts on iOS
			</h1>
			<p className='text-xl text-center text-muted-foreground mb-12'>
				Follow these simple steps to add Sports Addicts to your home
				screen and enjoy a full-screen, app-like experience.
			</p>
			<div className='space-y-16'>
				{steps.map((step, index) => (
					<div
						key={index}
						className='flex flex-col md:flex-row items-center gap-8'>
						<div className='w-full md:w-1/2 order-2 md:order-1'>
							<div className='bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4'>
								<span className='text-2xl font-bold text-primary'>
									{index + 1}
								</span>
							</div>
							<h2 className='text-2xl font-semibold mb-2'>
								{step.title}
							</h2>
							<p className='text-muted-foreground'>
								{step.description}
							</p>
						</div>
						<div className='w-full md:w-1/2 order-1 md:order-2'>
							<Image
								src={step.illustration}
								width={200}
								height={200}
								alt={`Step ${index + 1}: ${step.title}`}
								className='mx-auto'
							/>
						</div>
					</div>
				))}
			</div>
			<div className='mt-16 text-center'></div>
		</div>
	);
}
