import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

const steps = [
	{
		title: 'Search',
		description:
			'Find available pitches in your area using our search feature.',
	},
	{
		title: 'Book',
		description:
			'Select your preferred time slot and confirm your booking.',
	},
	{
		title: 'Play',
		description: 'Show up at the pitch and enjoy your game!',
	},
];

export default function HowItWorksSection() {
	return (
		<section id='how-it-works' className='w-full py-12 md:py-24 lg:py-32 layoutXPadding bg-primary'>
			<div className='container px-4 md:px-6'>
				<h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12'>
					How It Works
				</h2>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					{steps.map((step, index) => (
						<Card
							key={index}
							className='text-center'>
							<CardHeader>
								<div className='mx-auto rounded-full bg-primary text-foreground w-12 h-12 flex items-center justify-center text-2xl font-bold mb-4'>
									{index + 1}
								</div>
								<CardTitle>{step.title}</CardTitle>
							</CardHeader>
							<CardContent>
								<p>{step.description}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
